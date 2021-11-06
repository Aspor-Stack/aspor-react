import ODataSingleQueryable from "./query/ODataSingleQueryable";

export default class ODataEntity<Entity> extends ODataSingleQueryable<Entity> {

    id(){
        return this._id;
    }

    patch(delta : any) {
        return this._base.client().patch(this.url(),delta);
    }

    put(delta : any) {
        return this._base.client().put(this.url(),delta);
    }

    delete() {
        return this._base.client().delete(this.url());
    }
}
