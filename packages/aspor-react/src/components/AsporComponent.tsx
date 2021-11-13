import React from "react";
import {ApplicationContext} from "./system/AsporApplication";
import Application from "../system/Application";

export default abstract class AsporComponent<P, S> extends React.Component<P,S> {
    static contextType = ApplicationContext

    get app() : Application {
        return this.context as Application;
    }

}
