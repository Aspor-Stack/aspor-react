import {useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";
import {AsporUser} from "../../system/service/authentication/AsporUser";

export function useUser() : AsporUser {
    return useContext(ApplicationContext).user
}
