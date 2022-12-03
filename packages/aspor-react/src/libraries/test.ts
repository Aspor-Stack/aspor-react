import ODataService from "./odata/ODataService";
import {Application, ODataClient} from "../index";
import ODataEntity from "./odata/ODataEntity";
import ODataSet from "./odata/ODataSet";

export type TestType = {

    name: string,

    age: number

}

export class TestService extends ODataService {

    constructor(app: Application) {
        super(new ODataClient(""));
    }

    projects(): ODataSet<TestType>
    projects(id: string): ODataEntity<TestType>
    projects(id?: string): any {
        return id ? new ODataEntity(this, id, "projects") : new ODataSet(this, "projects");
    }
}



const testService = new TestService(null);

testService.projects().getFirst().now().then((value)=>{

    const tssss : TestType = value;
})



testService.projects("test").patch({name: "", age: 1}).execute().then(()=>{

})


const batch = testService.startBatch();

batch.addWithPromise(testService.projects().getMany()).then(()=>{
    console.log("test");
})

let id = batch.add(testService.projects("test").patch(({name: "", age: 1})))

batch.commit();

