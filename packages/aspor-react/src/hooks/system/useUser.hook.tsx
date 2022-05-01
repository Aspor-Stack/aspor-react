import {useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";
import ServiceDefinition from "../../system/service/ServiceDefinition";
import Application from "../../system/Application";
import AuthenticationService from "../../system/service/authentication/authentication.service";
import AsporUser from "../../system/service/authentication/AsporUser";

export default function useUser() : AsporUser {
    return useContext(ApplicationContext).service(AuthenticationService).getUser();
}
