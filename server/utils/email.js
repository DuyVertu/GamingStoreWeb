import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text }) => {
  let transporter;

  if (process.env.RENDER) {
    console.log(`⚠️ Blocked by Render SMTP firewall. Bypassing email.`);
    return { messageId: 'bypassed-by-render' };
  }

  if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-google-app-password') {
    console.log(`⚠️ Email credentials not provided. Bypassing email sending to prevent timeout.`);
    // Return early, mock sending
    return { messageId: 'mock-id-' + Date.now() };
  } else {
    // Dùng Gmail thật khi có thông tin
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  const senderEmail = (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-google-app-password')
    ? 'test-noreply@ethereal.email' // Fake sender for ethereal
    : process.env.EMAIL_USER;

  // Mail options
  const mailOptions = {
    from: `"GamingGear Store" <${senderEmail}>`,
    to,
    subject,
    text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. ID: ${info.messageId}`);
    
    // In ra link xem thử Email ảo nếu đang gửi test
    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-google-app-password') {
       console.log(`\n📬 LINK XEM EMAIL VỪA TRÊN TRÌNH DUYỆT: \n${nodemailer.getTestMessageUrl(info)}\n`);
    }

    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Email could not be sent');
  }
};

export const generateOTP = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};
