import { useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";

export default function useApplication() {
    return useContext(ApplicationContext);
}
