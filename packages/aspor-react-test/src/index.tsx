import React from "react";
import ReactDOM from "react-dom";
import {Application, AsporApplication} from "@aspor/aspor-react/build";
import App from "./App";
import {TestService} from "./service/test.service";

let application = Application.new();
application.registerService(TestService)

ReactDOM.render(
    <React.StrictMode>
        <AsporApplication application={application}>
            <App />
        </AsporApplication>
    </React.StrictMode>
    ,document.getElementById('root'));

const service = new TestService(application);

const batch = service.startBatch()

/*
batch.addWithPromise(service.projects("08da1009-b17b-4ac3-8dcc-d9188713f5d0").get()).then((result : Project)=>{
    console.log(result);
})

batch.addWithPromise(service.projects().getManyWithCount()).then((result)=>{
    console.log(result);
})
 */

batch.addWithPromise(service.projects("08da1009-b17b-4ac3-8dcc-d9188713f5d0").patch({
    name: "Test"
})).then((result)=>{
    console.log(result);
})

batch.execute().then((result)=>{
    console.log(result)
})
