import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import {
  getNotification,
  deleteNotify,
  getNumberUnreadNotify,
  readNotify,
} from "@/services/notification.service";
import { useMutation } from "react-query";
import { BASE_URL } from "@/constants";
import { AppContext } from "./Context";

export type NotificationData = {
  id: string;
  title: string;
  message: string;
  sender: string;
  receivers: string[];
  typeNotification: string;
  markRead: boolean;
  markedDeleted: boolean;
  createdDate: string;
  idType: string;
};
type MyContextValue = {
  notifications: NotificationData[] | [];
  totalNotRead: number;
  page: any;
  totalPages: any;
  isReadNotify: (id: string) => void;
  isDeleteNotify: (id: string) => void;
  viewMoreNotify: () => void;
  setNotifications: any;
  setTotalNotRead: any;
  loading: boolean;
  realTime: any;
};
interface Props {
  children: React.ReactNode;
}
const NotifyContext = createContext<MyContextValue>({
  notifications: [],
  totalNotRead: 0,
  page: 0,
  totalPages: 0,
  isReadNotify: (id: string) => {},
  isDeleteNotify: (id: string) => {},
  viewMoreNotify: () => {},
  setNotifications: () => {},
  setTotalNotRead: () => {},
  loading: false,
  realTime: null,
});

const NotifyProvider: React.FC<Props> = ({ children }) => {
  const { userInfoC, realTime, setRealTime }: any = useContext(AppContext);
  const [notifications, setNotifications] = useState<NotificationData[] | []>(
    []
  );
  const [totalNotRead, setTotalNotRead] = useState<number | 0>(0);
  const page = useRef<number>(0);
  const totalPages = useRef<number>(0);

  const readNotifyQuery = useMutation(readNotify);
  const getNotifyDataQuery = useMutation(getNotification, {
    onSuccess: (response) => {
      const data = [...notifications, ...response.content];
      setNotifications(data);
    },
  });
  const deleteNotifyQuery = useMutation(deleteNotify, {
    onSuccess: () => {
      getNotifyQuery.mutate(0);
    },
  });

  const isReadNotify = useCallback(
    async (id: string) => {
      readNotifyQuery.mutate(id);
    },
    [readNotifyQuery]
  );

  const isDeleteNotify = async (id: string) => {
    deleteNotifyQuery.mutate(id);
  };
  const getNotify = async (page: number) => {
    try {
      const notificationData = await getNotification(page);
      const total = await getNumberUnreadNotify();
      setTotalNotRead(total);
      setNotifications(notificationData?.content);
      totalPages.current = notificationData?.totalPages;
    } catch (e) {
      console.log(e);
    }
  };
  const viewMoreNotify = async () => {
    page.current = page.current + 1;
    getNotifyDataQuery.mutate(page.current);
  };
  const getNotifyQuery = useMutation(getNotify);
  const loading = useMemo(() => {
    return getNotifyQuery.isLoading;
  }, [getNotifyQuery.isLoading]);
  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}ws`);
    getNotifyQuery.mutate(0);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame: any) => {
      // console.log("Connected: " + frame);
      stompClient.subscribe(
        `/topic/notifications/${userInfoC?.email}`,
        (message) => {
          if (message.body) {
            setTotalNotRead((totalNotRead) => totalNotRead + 1);
            setNotifications((prevNotifications) => [
              JSON.parse(message.body),
              ...prevNotifications,
            ]);
            setRealTime(new Date());
          }
        }
      );
    });
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [userInfoC]);

  const contextValue = useMemo(
    () => ({
      notifications,
      totalNotRead,
      isReadNotify,
      isDeleteNotify,
      viewMoreNotify,
      setTotalNotRead,
      setNotifications,
      loading,
      page,
      totalPages,
      realTime,
    }),
    [notifications, totalNotRead, loading, page, totalPages]
  );

  return (
    <>
      <NotifyContext.Provider value={contextValue}>
        {children}
      </NotifyContext.Provider>
    </>
  );
};

export const useNotification = () => {
  return useContext(NotifyContext);
};

export default NotifyProvider;
