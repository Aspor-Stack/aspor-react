import AsporUser from "./AsporUser";
import ServiceDefinition from "../ServiceDefinition";

export const AuthenticationService = new ServiceDefinition<IAuthenticationService>("authentication-service");
export default AuthenticationService

export interface IAuthenticationService {

    getUser() : AsporUser,

    isAuthenticated() : boolean

    login(silent? : boolean) : Promise<AsporUser>;

    logout(silent? : boolean) : void;

}
