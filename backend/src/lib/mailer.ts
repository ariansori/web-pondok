/**
 * Email Notification Service for Al-Fatich Admin System
 */

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendOtpEmail(toEmail: string, otpCode: string, nama: string): Promise<boolean> {
  const subject = `[PP Al-Fatich] Kode Verifikasi Keamanan (OTP): ${otpCode}`;
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #0D5C2B, #169645); padding: 32px 24px; text-align: center; color: #ffffff;">
        <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; background-color: #F4B41A; color: #1A1A1A; font-weight: bold; font-size: 20px; margin-bottom: 12px;">AF</div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Pondok Pesantren Salafi Al-Fatich</h1>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">Sistem Keamanan & Otentikasi Admin Portal</p>
      </div>

      <div style="padding: 32px 24px;">
        <p style="font-size: 15px; color: #374151; margin-top: 0;">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">Yth. <strong>${nama}</strong>,<br/>Berikut adalah kode verifikasi 2FA (One-Time Password) untuk masuk ke panel administrasi website resmi PP Al-Fatich:</p>
        
        <div style="background-color: #f0fdf4; border: 2px dashed #169645; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0D5C2B; font-family: monospace;">${otpCode}</span>
          <p style="margin: 8px 0 0; font-size: 12px; color: #059669; font-weight: 600;">Berlaku selama 10 menit</p>
        </div>

        <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">Jika Anda tidak merasa melakukan permintaan login ini, abaikan email ini atau segera hubungi Super Admin untuk mengamankan akun Anda.</p>
        
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 28px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">Pondok Pesantren Salafi Al-Fatich Surabaya &bull; Jl. Tambak Osowilangun No. 98</p>
      </div>
    </div>
  `;

  console.log(`\n======================================================`);
  console.log(`📧 [EMAIL NOTIFICATION] To: ${toEmail}`);
  console.log(`🔑 [OTP CODE]: ${otpCode} (Valid for 10 minutes)`);
  console.log(`======================================================\n`);

  // If SMTP is configured via env in future, nodemailer can be hooked here seamlessly
  return true;
}
