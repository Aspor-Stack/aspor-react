import React from "react";
import {Application} from "../system/Application";
import {ApplicationContext} from "./system/AsporApplication";

export abstract class AsporComponent<P, S, A = Application> extends React.Component<P,S> {
    static contextType = ApplicationContext

    get app() : A {
        return this.context as A;
    }

}
