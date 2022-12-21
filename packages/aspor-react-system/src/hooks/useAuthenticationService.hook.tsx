import { useContext} from "react";
import {ApplicationContext} from "../components/AsporApplication";
import {
    AuthenticationService,
    IAuthenticationService
} from "../service/authentication/authentication.service";

export default function useAuthenticationService() : IAuthenticationService{
    return useContext(ApplicationContext).service(AuthenticationService);
}
