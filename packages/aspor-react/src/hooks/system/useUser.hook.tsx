import {useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";
import AsporUser from "../../system/service/authentication/AsporUser";

export default function useUser() : AsporUser {
    return useContext(ApplicationContext).user
}
