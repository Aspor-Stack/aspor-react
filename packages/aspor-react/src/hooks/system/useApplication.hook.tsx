import { useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";

export function useApplication() {
    return useContext(ApplicationContext);
}
