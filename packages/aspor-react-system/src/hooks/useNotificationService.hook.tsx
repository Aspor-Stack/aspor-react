import { useContext} from "react";
import {ApplicationContext} from "../components/AsporApplication";
import {INotificationService, NotificationService} from "../service/notification.service";

export default function useNotificationServiceHook() : INotificationService{
    return useContext(ApplicationContext).service(NotificationService);
}
