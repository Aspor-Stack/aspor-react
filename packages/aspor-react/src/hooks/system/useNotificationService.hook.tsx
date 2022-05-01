import { useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";
import {INotificationService, NotificationService} from "../../system/service/authentication.service";

export default function useNotificationServiceHook() : INotificationService{
    return useContext(ApplicationContext).service(NotificationService);
}
