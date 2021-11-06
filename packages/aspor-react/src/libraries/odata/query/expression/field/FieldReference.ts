import type { FieldsFor } from "./FieldsForType";

export class FieldReference<T> {
    constructor(public field: FieldsFor<T>) { }
    public toString() { return this.field; }
}
