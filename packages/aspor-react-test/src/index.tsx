import React from "react";
import ReactDOM from "react-dom";
import {TestApp} from "./TestApp";
import {ODataTestService} from "./ODataTestService";
import {TestServiceImpl} from "./services/test.service.impl";
import {TestService} from "./services/test.service";
import {AsporApplicationBuilder} from "aspor-react/src/system/AsporApplicationBuilder";
import {Application} from "aspor-react/src";
import {AsporApplication} from "aspor-react/src/components/system/AsporApplication";

let builder = AsporApplicationBuilder.new();

builder.registerService(new ODataTestService());
builder.registerService(ODataTestService);
builder.registerService(TestService,TestServiceImpl)
builder.registerService(TestService,new TestServiceImpl())

let application : Application = builder.build();

ReactDOM.render(
    <React.StrictMode>
        <AsporApplication application={application}>
                <TestApp />
        </AsporApplication>
    </React.StrictMode>
    ,document.getElementById('root'));
