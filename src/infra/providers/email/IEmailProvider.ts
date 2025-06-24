export interface IEmailProvider {
    sendEmail(to: string | string[], subject: string, body: string): Promise<void>;
}