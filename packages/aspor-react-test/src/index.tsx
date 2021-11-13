import React from "react";
import ReactDOM from "react-dom";
import {TestApp} from "./TestApp";
import {ODataTestService} from "./ODataTestService";
import {TestServiceImpl} from "./services/test.service.impl";
import {TestService} from "./services/test.service";
import {Application, AsporApplication} from "../../aspor-react/src";

let application = Application.new();

application.registerService(new ODataTestService());
application.registerService(ODataTestService);
application.registerService(TestService,TestServiceImpl)
application.registerService(TestService,new TestServiceImpl())

ReactDOM.render(
    <React.StrictMode>
        <AsporApplication application={application}>
                <TestApp />
        </AsporApplication>
    </React.StrictMode>
    ,document.getElementById('root'));
