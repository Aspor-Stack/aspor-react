import React from "react";
import {TestService} from "./service/test.service";
import useService from "@aspor/aspor-react/build/hooks/system/useService.hook";
import {Process} from "./service/entities";
import useODataCollectionResponse from "@aspor/aspor-react/build/hooks/odata/useODataCollectionResponse.hook";
import useODataEntityResponse from "@aspor/aspor-react/build/hooks/odata/useODataEntityResponse.hook";

export default function App(){

    let service = useService(TestService);

    const [processes,,,,reload] = useODataCollectionResponse(service.processes().getMany())

    const [process] = useODataEntityResponse(service.processes("").get())

    return <div>

    </div>
}
