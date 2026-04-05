import 'dotenv/config';
import { sendEmail } from './utils/email.js';

async function testRealEmail() {
  console.log('🔄 Đang thử kết nối bưu cục (SMTP)...');
  
  // Địa chỉ người nhận (Nhận mail test)
  const myEmail = 'nguyenkhanhduy010104@gmail.com';

  try {
    await sendEmail({
      to: myEmail,
      subject: '✅ GamingGear: Mã Xác Thực Hành Công!',
      text: 'Chào Khánh Duy,\n\nĐây là email kiểm thử hệ thống Backend. Nếu bạn đọc được dòng này, nghĩa là cấu hình Mật khẩu Ứng dụng Google của bạn đã chính xác 100% rồi nhé!\n\nMã OTP Demo của bạn là: 999999'
    });
    console.log('🎉 THÀNH CÔNG! Hãy mở điện thoại/tab Gmail của bạn lên kiểm tra nhé!');
  } catch (error) {
    console.error('❌ LỖI RỒI: Không thể gửi mail. Vui lòng kiểm tra lại EMAIL_USER và EMAIL_PASS trong file .env');
    console.error(error);
  }
  process.exit();
}

testRealEmail();
