export const statusObject = {
  NEW: {
    title: {
      ["SALE"]: "Tạo mới",
      ["OFFICE_ADMIN"]: "Tạo mới",
      ["ADMIN"]: "Tạo mới",
      ["LEADER_SALE"]: "Tạo mới",
    },
    color: "#3B82F6", // Blue
  },
  WAIT_APPROVE: {
    title: {
      ["SALE"]: "Chờ duyệt",
      ["OFFICE_ADMIN"]: "Chờ duyệt",
      ["ADMIN"]: "Chờ duyệt",
      ["LEADER_SALE"]: "Chờ duyệt",
    },
    color: "#F59E0B", // Yellow
  },
  APPROVED: {
    title: {
      ["SALE"]: "Đã được duyệt",
      ["OFFICE_ADMIN"]: "Đã duyệt",
      ["ADMIN"]: "Chờ duyệt",
      ["LEADER_SALE"]: "Đã được duyệt",
    },
    color: "#F59E0B", // Yellow
  },
  APPROVE_FAIL: {
    title: {
      ["SALE"]: "Xin duyệt thất bại",
      ["OFFICE_ADMIN"]: "Đã từ chối duyệt",
      ["ADMIN"]: "Đã từ chối duyệt",
      ["LEADER_SALE"]: "Xin duyệt thất bại",
    },
    color: "#EF4444", // Red
  },
  WAIT_SIGN_A: {
    title: {
      ["SALE"]: "Chờ sếp ký",
      ["OFFICE_ADMIN"]: "Chờ sếp ký",
      ["ADMIN"]: "Chờ ký",
      ["LEADER_SALE"]: "Chờ sếp ký",
    },
    color: "#F59E0B", // Yellow
  },
  SIGN_A_OK: {
    title: {
      ["SALE"]: "Sếp ký thành công",
      ["OFFICE_ADMIN"]: "Sếp ký thành công",
      ["ADMIN"]: "Đã ký",
      ["LEADER_SALE"]: "Sếp ký thành công",
    },
    color: "#10B981", // Green
  },
  SIGN_A_FAIL: {
    title: {
      ["SALE"]: "Sếp từ chối ký",
      ["OFFICE_ADMIN"]: "Sếp từ chối ký",
      ["ADMIN"]: "Đã từ chối ký",
      ["LEADER_SALE"]: "Sếp từ chối ký",
    },
    color: "#EF4444", // Red
  },
  WAIT_SIGN_B: {
    title: {
      ["SALE"]: "Chờ khách hàng ký",
      ["OFFICE_ADMIN"]: "Chờ khách hàng ký",
      ["ADMIN"]: "Chờ khách hàng ký",
      ["LEADER_SALE"]: "Chờ khách hàng ký",
    },
    color: "#F59E0B", // Yellow
  },
  SIGN_B_OK: {
    title: {
      ["SALE"]: "Khách ký thành công",
      ["OFFICE_ADMIN"]: "Khách ký thành công",
      ["ADMIN"]: "Khách ký thành công",
      ["LEADER_SALE"]: "Khách ký thành công",
    },
    color: "#10B981", // Green
  },
  SIGN_B_FAIL: {
    title: {
      ["SALE"]: "Khách từ chối ký",
      ["OFFICE_ADMIN"]: "Khách từ chối ký",
      ["ADMIN"]: "Khách từ chối ký",
      ["LEADER_SALE"]: "Khách từ chối ký",
    },
    color: "#EF4444", // Red
  },
  SUCCESS: {
    title: {
      ["SALE"]: "Hợp đồng hoàn thành",
      ["OFFICE_ADMIN"]: "Hợp đồng hoàn thành",
      ["ADMIN"]: "Hợp đồng hoàn thành",
      ["LEADER_SALE"]: "Hợp đồng hoàn thành",
    },
    color: "#000000", // Black
  },
};

export const statusRequest: any = {
  1: {
    status: "WAIT_APPROVE",
    title: "Xin duyệt hợp đồng",
    description: "Yêu cầu xin trình duyệt hợp đồng",
  },
  2: {
    status: "APPROVED",
    title: "Xác nhận duyệt hợp đồng",
    description: "Xác nhận duyệt hợp đồng",
  },
  3: {
    status: "APPROVE_FAIL",
    title: "Từ chối duyệt hợp đồng",
    description: "Từ chối duyệt hợp đồng",
  },
  4: {
    status: "WAIT_SIGN_A",
    title: "Xác nhận xin ký hợp đồng",
    description: "Yêu cầu xin trình kí hợp đồng",
  },
  5: {
    status: "SIGN_A_OK",
    title: "Xác nhận ký hợp đồng",
    description: "Xác nhận ký hợp đồng",
  },
  6: {
    status: "SIGN_A_FAIL",
    title: "Từ chối ký hợp đồng",
    description: "Từ chối ký hợp đồng",
  },
  7: {
    status: "WAIT_SIGN_B",
    title: "Xác nhận trao đổi và ký hợp đồng",
    description: "Yêu cầu xác nhận trao đổi và xin ký hợp đồng",
  },
  8: {
    status: "SIGN_B_OK",
    title: "Xác nhận ký hợp đồng",
    description: "Xác nhận ký hợp đồng",
  },
  9: {
    status: "SIGN_B_FAIL",
    title: "Từ chối ký hợp đồng",
    description: "Từ chối ký hợp đồng",
  },
  10: {
    status: "NEW",
    title: "Tạo mới hợp đồng",
    description: "Bạn đã tạo mới hợp đồng thành công",
  },
};
export const statusContract: any = [
  {
    status: "NEW",
    title: "Tạo mới",
  },
  { status: "WAIT_APPROVE", title: "Chờ duyệt" },
  { status: "WAIT_SIGN_A", title: "Chờ ký" },
  { status: "WAIT_SIGN_B", title: "Gửi khách hàng" },
  { sttaus: "SUCCESS", title: "Hoàn thành" },
];
