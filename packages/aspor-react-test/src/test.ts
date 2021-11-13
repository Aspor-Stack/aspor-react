import {ODataTestService} from "./ODataTestService";
import {Board} from "./entities";
import {ODataQueryable} from "../../aspor-react/build";

let service : ODataTestService = new ODataTestService();

let y1 = service.projects().getMany();

let y2 = service.projects().recent().getMany();

let y3 = service.projects("project-id");

let y4 = service.projects("project-id").owner()

let y5 = service.projects("project-id").boards().getMany();

let y6 = service.projects("project-id").boards("board-id").get()


service.projects("project-id").patch({

})


service.projects()
    .filter(p => p.name.$equals("Test").or(p.name.$equals("Test2").and(p.id.$equals(1234))))
    .expand(p => p.primaryBoard,(q : ODataQueryable<Board>) => q.filter(e => e.name.$equals("Test")))
    .getMany().then((result)=>{
        console.log(result);
});


service.projects()
    .filter(p => p.name.$equals("Test").or(p.name.$equals("Test2").and(p.id.$equals(1234))))
    .expandMany(p => p.boards,(q : ODataQueryable<Board>) => q.filter(e => e.name.$equals("Test")))
    .getMany().then((result)=>{
    console.log(result);
});

