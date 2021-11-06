import {Tracked} from "./Tracked";

export class TrackedCollection<A extends any> {

    private readonly _tracked : Tracked<A>[];

    constructor(_tracked : Tracked<A>[]) {
        this._tracked = _tracked;
    }

    get all(){
        return this._tracked
    }

    get changed() {
        return this._tracked.filter(t => t.hasChanges());
    }

    get notChanged() {
        return this._tracked.filter(t => !t.hasChanges());
    }

    commit() : Promise<A[]>{
        return new Promise<A[]>((resolve,reject)=>{
            let promises = []
            for (let tracked of this.changed) {
                promises.push(tracked.commit());
            }
            Promise.all<A>(promises)
                .then((values) => resolve(values))
                .catch(reject);
        })
    }
}
