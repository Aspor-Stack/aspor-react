import {DependencyList, useEffect} from "react";
import {useNotificationService} from "../../../index";

export default function useErrorHandler<T>(errors?: DependencyList) : void {
    const notificationService = useNotificationService();
    useEffect(()=>{
        for(let error in errors){
            if(error) notificationService.handleError(error);
        }
    }, errors);
}
