/**
 * Email Notification Service for Al-Fatich Admin System
 */
export interface MailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare function sendOtpEmail(toEmail: string, otpCode: string, nama: string): Promise<boolean>;
//# sourceMappingURL=mailer.d.ts.map