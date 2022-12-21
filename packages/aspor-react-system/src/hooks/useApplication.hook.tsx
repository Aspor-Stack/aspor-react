import { useContext} from "react";
import {ApplicationContext} from "../components/AsporApplication";

export default function useApplication() {
    return useContext(ApplicationContext);
}
