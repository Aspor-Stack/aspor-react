import AsporUser from "./AsporUser";
import ServiceDefinition from "../ServiceDefinition";
import LoginBehavior from "./LoginBehavior";

export const AuthenticationService = new ServiceDefinition<IAuthenticationService>("authentication-service");
export default AuthenticationService

export interface IAuthenticationService {

    getSchema() : string,

    getUser() : AsporUser,

    getAuthorizationToken() : string,

    acquireAuthorizationToken() : Promise<string>

    getAuthorizationHeader() : string,

    acquireAuthorizationHeader() : Promise<string>

    isAuthenticated() : boolean

    login(behavior?: LoginBehavior) : Promise<AsporUser>;

    logout(behavior?: LoginBehavior) : void;

}
