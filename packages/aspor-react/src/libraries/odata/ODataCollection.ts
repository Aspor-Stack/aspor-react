import {ODataEntity} from "./ODataEntity";
import {ODataQueryable} from "./query/ODataQueryable";

export class ODataCollection<Entity> extends ODataQueryable<Entity> {

    get(id : any) : ODataEntity<Entity> {
        return new ODataEntity<Entity>(this,id);
    }

}
