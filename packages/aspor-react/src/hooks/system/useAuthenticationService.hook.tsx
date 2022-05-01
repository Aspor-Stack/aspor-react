import { useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";
import {
    AuthenticationService,
    IAuthenticationService
} from "../../system/service/authentication/authentication.service";

export default function useAuthenticationService() : IAuthenticationService{
    return useContext(ApplicationContext).service(AuthenticationService);
}
