import {Board, Project, User} from "./entities";
import ODataSet from "aspor-react/src/libraries/odata/ODataSet";
import ODataQueryable from "aspor-react/src/libraries/odata/query/ODataQueryable";
import ODataCollection from "aspor-react/src/libraries/odata/ODataCollection";
import ODataEntity from "aspor-react/src/libraries/odata/ODataEntity";
import ODataService from "aspor-react/src/libraries/odata/ODataService";
import ODataClient from "aspor-react/src/libraries/odata/ODataClient";
import {Application} from "../../aspor-react/src";

export class ProjectSet extends ODataSet<Project> {

    get(id : any) : ProjectEntity {
        return new ProjectEntity(this,id);
    }

    recent() : ODataQueryable<Project>{
        return new ODataCollection<Project>(this,"recent");
    }

}

export class ProjectEntity extends ODataEntity<Project> {

    owner() :  ODataEntity<User> {
        // @ts-ignore
        return null;
    }

    boards() : ODataSet<Board>
    boards(id : string) : ODataEntity<Board>
    boards(id? : string) : any {
        return id ? new ODataEntity(this,id,"boards") : new ODataSet<Board>(this,"boards")
    }

}

export class ODataTestService extends ODataService {

    constructor() {
        super(new ODataClient({
            handleAuthorization(): string {
                return "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJEa3JpZWdlciN0ZWFtIiwibmFtZSI6IkRrcmllZ2VyIiwianRpIjoiYWY1MjEyMjQtMDI3Ni00OTNkLWFhMDctZmM2MTM2ZjljNGE0IiwiZW1haWwiOiJkYXZpZGUud2lldGxpc2JhY2hAaWNsb3VkLmNvbSIsImRpc2MiOiJ0ZWFtIiwic2NwIjoiN2MwNGM4ODQtYzg4NC0xMWViLThiYTAtMDI0MmFjMTgwMDAyLnVzZXIubG9naW4gN2MwNGM4ODQtYzg4NC0xMWViLThiYTAtMDI0MmFjMTgwMDAyLnVzZXIucmVhZCA3YzA0Yzg4NC1jODg0LTExZWItOGJhMC0wMjQyYWMxODAwMDIudXNlci5tb2RpZnkiLCJhdmF0YXIiOiJodHRwczovL2Nkbi5kaXNjb3JkYXBwLmNvbS9hdmF0YXJzLzM0NTU5MDQ4MjQ4NDcyMzcxNC9jYzhhMDNmZDY3N2M5Yjk1ZGZkNmFiMDI1NWUxMWMwMS5wbmciLCJ0aGVtZSI6ImRhcmsiLCJsYW5nIjoiZW4iLCJ2ZXJpZmllZCI6ImRhdmlkZS53aWV0bGlzYmFjaEBpY2xvdWQuY29tIiwidHlwZSI6InVzZXIiLCJuYmYiOjE2MzU2MDk4MjIsImV4cCI6MTYzNTYxMzQyMiwiaXNzIjoiMzQ0ZWYyZmYtZDBlYy0xMWViLThiYTAtMDI0MmFjMTgwMDAyIiwiYXVkIjoiaHR0cHM6Ly9hdXRoLmFjY291bnQucHJldHJvbmljLm5ldC81OWQ3MTEyMy1jODg0LTExZWItOGJhMC0wMjQyYWMxODAwMDIifQ.EQPl-gB9S3P39UVP3d5kmLKigEX4JGo9czPCbnR-gj3gsLSbmviNfKbaOSH_71x5_JjZXLKUeXTR2gGwllLpw5u2tmU7RQ_m34DgaXWLq9Yw8OLJO-TuRrNkjURjRtxOSf-VM6tf358M_RAChTbNYsByfvM6ksAxQy_p4ZpxCaU9cXjSHqf7oggB9-3-hoc-ZE9kpNAbCautJK9ESJwBNhKS4fKy3asGPN_hjSdk4PNUt8-Vk8x0vYMn6AIASGzUdnHVjUAP_CV7i0xfL8xZIm-KUFnfvhT2kTg_CdS9Xma9r-FL7aKbgmIE2ISKioo3htIba11Lsy27eV7IMIwMDg"
            }
        }),"https://localhost:44305/v1/ba3860e7-28f8-11ec-8ba0-0242ac180002");
    }

    projects() : ProjectSet
    projects(id : string) : ProjectEntity
    projects(id? : string) : any {
        return id ? new ProjectEntity(this,id,"projects"): new ProjectSet(this,"projects");
    }

}
