import {DependencyList, useEffect} from "react";

export default function useErrorAction<T>(action: (error: any)=>void, errors?: DependencyList) : void {
    useEffect(()=>{
        for(let error in errors){
            if(error) action(error);
        }
    }, errors);
}
