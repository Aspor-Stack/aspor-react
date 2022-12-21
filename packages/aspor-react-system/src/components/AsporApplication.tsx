import React from "react";
import Application from "../Application";

//@ts-ignore
export const ApplicationContext = React.createContext<Application>(null);

export interface AsporApplicationProps {
    application: Application,
    children?: any
}

export interface AsporApplicationState {

}


export default class AsporApplication extends React.Component<AsporApplicationProps,AsporApplicationState> {

    render(){
        return <ApplicationContext.Provider value={this.props.application}>
            {this.props.children}
        </ApplicationContext.Provider>
    }

}
