import {useContext} from "react";
import {ApplicationContext} from "../components/AsporApplication";
import AuthenticationService from "../service/authentication/authentication.service";
import AsporUser from "../service/authentication/AsporUser";

export default function useUser() : AsporUser {
    return useContext(ApplicationContext).service(AuthenticationService).getUser();
}
