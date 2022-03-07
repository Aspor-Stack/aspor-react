import AsporUser from "./AsporUser";
import ServiceDefinition from "../ServiceDefinition";
import LoginBehavior from "./LoginBehavior";

export const AuthenticationService = new ServiceDefinition<IAuthenticationService>("authentication-service");
export default AuthenticationService

export interface IAuthenticationService {

    getUser() : AsporUser,

    getAuthorizationToken(),

    getAuthorizationHeader(),

    isAuthenticated() : boolean

    login(behavior?: LoginBehavior) : Promise<AsporUser>;

    logout(behavior?: LoginBehavior) : void;

}
