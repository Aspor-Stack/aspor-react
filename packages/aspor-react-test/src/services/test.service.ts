import ServiceDefinition from "aspor-react/src/system/service/ServiceDefinition";

export const TestService : ServiceDefinition<ITestService> = new ServiceDefinition<ITestService>("test-service");

export interface ITestService {

    create(): void

}
