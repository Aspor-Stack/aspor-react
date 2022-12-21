
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class ServiceDefinition<T> {

    private readonly _name : string;

    constructor(name : string) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

}
