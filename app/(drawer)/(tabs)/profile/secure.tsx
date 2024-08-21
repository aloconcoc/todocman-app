import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Chính Sách Bảo Mật</Text>

        <Text style={styles.sectionTitle}>
          1.1. Thông tin và dữ liệu nào sẽ được thu thập
        </Text>
        <Text style={styles.text}>
          Chúng tôi sẽ yêu cầu bạn cung cấp các thông tin cá nhân cơ bản, bao
          gồm:
        </Text>
        <Text style={styles.text}>- Tên đăng nhập, mật khẩu đăng nhập.</Text>
        <Text style={styles.text}>- Email, số điện thoại, địa chỉ.</Text>
        <Text style={styles.text}>
          Các thông tin này sẽ được thu thập khi bạn đăng ký sử dụng dịch vụ của
          chúng tôi và có thể bao gồm các thông tin khác khi bạn tương tác với
          nội dung trên trang web và ứng dụng của chúng tôi.
        </Text>
        <Text style={styles.text}>
          Chúng tôi cam kết chỉ thu thập thông tin khi cần thiết và cho các mục
          đích hợp pháp nhằm phục vụ lợi ích của bạn trong quá trình sử dụng
          dịch vụ. Việc bạn truy cập và sử dụng dịch vụ đồng nghĩa với việc bạn
          đã hiểu và đồng ý với các quy định trong chính sách bảo mật của chúng
          tôi.
        </Text>
        <Text style={styles.text}>
          Bạn có trách nhiệm bảo mật thông tin tài khoản, mật khẩu, email và số
          điện thoại của mình. Chúng tôi không chịu trách nhiệm về bất kỳ mất
          mát dữ liệu nào do sự bất cẩn hoặc hành động của bạn.
        </Text>
        <Text style={styles.text}>
          Ngoài ra, bạn cũng có trách nhiệm thông báo kịp thời cho chúng tôi về
          bất kỳ hành vi sử dụng trái phép, lạm dụng, hoặc vi phạm bảo mật để
          chúng tôi có thể có các biện pháp xử lý thích hợp.
        </Text>

        <Text style={styles.sectionTitle}>1.2. Dịch vụ, ứng dụng liên kết</Text>
        <Text style={styles.text}>
          Để đảm bảo quyền lợi và trải nghiệm tốt nhất cho bạn, chúng tôi có thể
          yêu cầu quyền truy cập vào một số thông tin khi bạn sử dụng các dịch
          vụ hoặc ứng dụng liên kết với chúng tôi
        </Text>

        <Text style={styles.sectionTitle}>1.3. Phạm vi sử dụng thông tin</Text>
        <Text style={styles.text}>
          Chúng tôi sử dụng thông tin bạn cung cấp để:
        </Text>
        <Text style={styles.text}>- Cung cấp các dịch vụ đến bạn.</Text>
        <Text style={styles.text}>
          - Gửi thông báo về các hoạt động trao đổi thông tin giữa bạn và chúng
          tôi.
        </Text>
        <Text style={styles.text}>
          - Ngăn ngừa các hoạt động phá hoại tài khoản của bạn hoặc các hành vi
          giả mạo.
        </Text>
        <Text style={styles.text}>
          - Liên lạc và giải quyết các vấn đề trong những trường hợp đặc biệt.
        </Text>
        <Text style={styles.text}>
          - Cung cấp thông tin cá nhân khi có yêu cầu từ cơ quan nhà nước có
          thẩm quyền.
        </Text>
        <Text style={styles.text}>
          - Chia sẻ thông tin cần thiết cho bên đối tác nếu được sự đồng ý của
          bạn.
        </Text>

        <Text style={styles.sectionTitle}>
          1.4. Thời gian lưu trữ thông tin
        </Text>
        <Text style={styles.text}>
          Thông tin cá nhân của bạn sẽ được bảo mật hoàn toàn trên máy chủ của
          chúng tôi. Trong một số trường hợp, chúng tôi có thể khôi phục thông
          tin từ cơ sở dữ liệu của mình để giải quyết tranh chấp hoặc thực hiện
          yêu cầu pháp lý và kỹ thuật liên quan đến sự an toàn và hoạt động của
          dịch vụ.
        </Text>

        <Text style={styles.sectionTitle}>
          1.5. Phương tiện và công cụ để khách hàng tiếp cận và chỉnh sửa dữ
          liệu
        </Text>
        <Text style={styles.text}>
          Bạn có quyền kiểm tra, cập nhật, điều chỉnh thông tin cá nhân của mình
          bằng cách đăng nhập vào tài khoản hoặc yêu cầu chúng tôi thực hiện
          việc này. Bạn cũng có quyền gửi khiếu nại về việc lộ thông tin cá nhân
          cho bên thứ ba đến Ban quản trị của chúng tôi.
        </Text>

        <Text style={styles.sectionTitle}>
          1.6. Cam kết bảo mật thông tin cá nhân
        </Text>
        <Text style={styles.text}>
          Chúng tôi cam kết bảo mật thông tin cá nhân của bạn theo chính sách
          bảo vệ thông tin cá nhân và các quy định pháp luật hiện hành. Việc thu
          thập và sử dụng thông tin của bạn chỉ được thực hiện khi có sự đồng ý
          hợp pháp của bạn, trừ khi pháp luật có quy định khác. Chúng tôi cam
          kết không tiết lộ thông tin cá nhân của bạn cho bên thứ ba mà không có
          sự đồng ý của bạn, trừ những trường hợp pháp luật quy định khác.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
});

export default PrivacyPolicyScreen;
