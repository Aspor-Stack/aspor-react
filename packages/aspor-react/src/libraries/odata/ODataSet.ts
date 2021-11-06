import ODataCollection from "./ODataCollection";

export default class ODataSet<Entity> extends ODataCollection<Entity> {

    post(entity : any) : Promise<Entity> {
        return this._base.client().post<Entity>(this.url(),entity);
    }
}
