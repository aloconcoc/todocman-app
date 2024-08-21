import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const TermsOfServiceScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Điều Khoản Sử Dụng Dịch Vụ</Text>

      <Text style={styles.sectionTitle}>1. Định Nghĩa</Text>
      <Text style={styles.text}>
        1.1. Dịch vụ – Phần mềm quản lý hợp đồng online được cung cấp qua nền
        tảng web và ứng dụng di động.
      </Text>
      <Text style={styles.text}>
        1.2. Ứng dụng – Ứng dụng di động quản lý hợp đồng được tải từ các cửa
        hàng ứng dụng chính thức.
      </Text>
      <Text style={styles.text}>
        1.3. Website – Trang thông tin điện tử có thể truy cập qua địa chỉ chính
        thức của dịch vụ.
      </Text>
      <Text style={styles.text}>
        1.4. Nội dung – Tất cả các hình ảnh, bài viết, video và thông tin khác
        được đăng tải trên Website.
      </Text>
      <Text style={styles.text}>
        1.5. Chủ tài khoản – Người đăng ký tài khoản hoặc quản trị viên có quyền
        truy cập vào dịch vụ.
      </Text>
      <Text style={styles.text}>
        1.6. Tài khoản quản trị – Tài khoản chính được tạo ra khi đăng ký dịch
        vụ.
      </Text>
      <Text style={styles.text}>
        1.7. Người dùng – Chủ tài khoản và các nhân viên được cấp quyền truy cập
        vào dịch vụ.
      </Text>
      <Text style={styles.text}>
        1.8. Dịch vụ – Công ty cung cấp dịch vụ quản lý hợp đồng online.
      </Text>
      <Text style={styles.text}>
        1.9. Bên thứ ba – Khách hàng, đối tác, nhà cung cấp hoặc các bên liên
        quan khác.
      </Text>
      <Text style={styles.text}>
        1.10. Dữ liệu hợp đồng – Dữ liệu lưu trữ liên quan đến hợp đồng trên nền
        tảng.
      </Text>
      <Text style={styles.text}>
        1.11. Khu vực chung – Các phần công khai của Website và ứng dụng, bao
        gồm trang chủ và các thông tin hỗ trợ.
      </Text>
      <Text style={styles.text}>
        1.12. Khu vực riêng – Các trang nội bộ và thông tin quản lý được bảo vệ
        bằng mật khẩu.
      </Text>

      <Text style={styles.sectionTitle}>2. Phạm Vi Áp Dụng</Text>
      <Text style={styles.text}>
        2.1. Điều khoản sử dụng này áp dụng cho tất cả các dịch vụ quản lý hợp
        đồng online được cung cấp qua Website và ứng dụng di động. Bằng việc sử
        dụng dịch vụ, bạn đồng ý tuân theo các điều khoản này.
      </Text>
      <Text style={styles.text}>
        2.2. Chúng tôi có quyền thay đổi điều khoản sử dụng. Bạn có trách nhiệm
        kiểm tra các cập nhật thường xuyên. Việc tiếp tục sử dụng dịch vụ đồng
        nghĩa với việc bạn chấp nhận các điều khoản mới.
      </Text>

      <Text style={styles.sectionTitle}>3. Sử Dụng Hợp Pháp</Text>
      <Text style={styles.text}>
        3.1. Bạn phải sử dụng dịch vụ cho mục đích hợp pháp và tuân thủ pháp
        luật hiện hành. Bạn không được sử dụng dịch vụ để phát tán nội dung vi
        phạm pháp luật hoặc gây phiền hà cho người khác.
      </Text>

      <Text style={styles.sectionTitle}>4. Quyền Sở Hữu Trí Tuệ</Text>
      <Text style={styles.text}>
        4.1. Tất cả nội dung trên Website thuộc quyền sở hữu trí tuệ của chúng
        tôi. Bạn có thể sử dụng nội dung cho mục đích cá nhân và không được sao
        chép hay chỉnh sửa mà không có sự đồng ý trước bằng văn bản.
      </Text>

      <Text style={styles.sectionTitle}>5. Bảo Mật Thông Tin</Text>
      <Text style={styles.text}>
        5.1. Bạn có trách nhiệm bảo mật thông tin tài khoản và không để lộ mật
        khẩu cho người khác. Chúng tôi không chịu trách nhiệm về sự xâm nhập
        trái phép do sự bất cẩn của bạn.
      </Text>

      <Text style={styles.sectionTitle}>6. Xử Lý Sự Cố</Text>
      <Text style={styles.text}>
        6.1. Bạn cần thông báo ngay cho chúng tôi khi phát hiện sự cố và phối
        hợp để khắc phục. Chúng tôi không chịu trách nhiệm về thiệt hại phát
        sinh từ sự chậm trễ thông báo hoặc các yếu tố bất khả kháng.
      </Text>

      <Text style={styles.sectionTitle}>7. Giới Hạn Trách Nhiệm</Text>
      <Text style={styles.text}>
        7.1. Chúng tôi không chịu trách nhiệm về hậu quả của việc truy cập trái
        phép vào hệ thống hoặc các thiệt hại liên quan đến việc sử dụng dịch vụ.
      </Text>

      <Text style={styles.sectionTitle}>8. Đảm Bảo Cung Cấp Dịch Vụ</Text>
      <Text style={styles.text}>
        8.1. Chúng tôi cam kết nỗ lực cung cấp dịch vụ tốt nhất, tuy nhiên không
        đảm bảo rằng dịch vụ sẽ luôn sẵn sàng mà không có gián đoạn.
      </Text>

      <Text style={styles.sectionTitle}>9. Tài Liệu Hướng Dẫn</Text>
      <Text style={styles.text}>
        9.1. Tài liệu hướng dẫn sử dụng có thể được cung cấp qua email hoặc trên
        Website. Chúng tôi không đảm bảo cung cấp tài liệu in ấn.
      </Text>
      <View style={{ marginBottom: 10 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
});

export default TermsOfServiceScreen;
