import {DependencyList, useEffect, useState} from "react";
import ODataSingleQueryable from "../../../libraries/odata/query/ODataSingleQueryable";

export default function useErrorAction<T>(action: (error: any)=>void, errors?: DependencyList) : void {
    useEffect(()=>{
        for(let error in errors){
            if(error) action(error);
        }
    }, errors);
}
