import React from "react";
import {ODataTestService} from "./ODataTestService";
import {Project} from "./entities";
import ODataSingleResult from "aspor-react/src/components/odata/ODataSingleResult";
import ServiceProvider from "aspor-react/src/components/system/ServiceProvider";

export class TestApp extends React.Component<any, any>{

    render() {
        return <div>

            <ServiceProvider type={ODataTestService} render={(service : ODataTestService)=>

                <ODataSingleResult query={service.projects("08d98b1d-4990-4c8b-8e3f-fe4b39029c8c")} render={(result : Project | undefined, loading)=>{
                    if(loading) return <p>Loading..</p>
                    else return <p>{result?.name}</p>
                }} />

            } />

        </div>;
    }

}
