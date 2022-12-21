import ServiceDefinition from "./ServiceDefinition";

export const NotificationService = new ServiceDefinition<INotificationService>("notification-service");
export default NotificationService

export interface INotificationService {

    sendInfo(message: string): void

    sendWarning(message: string): void

    sendError(message: string): void

    sendSuccess(message: string): void

    handleError: (error: any) => void

}
