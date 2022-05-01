import {DependencyList, useEffect, useState} from "react";
import ODataSingleQueryable from "../../../libraries/odata/query/ODataSingleQueryable";
import {useNotificationService} from "../../../index";

export default function useErrorHandler<T>(action: (error: any)=>void, errors?: DependencyList) : void {
    const notificationService = useNotificationService();
    useEffect(()=>{
        for(let error in errors){
            if(error) notificationService.handleError(error);
        }
    }, errors);
}
