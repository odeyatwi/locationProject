import {action} from "typesafe-actions";
import {DISMISS_ERROR, HANDLE_ERROR} from "./types";

export const handleError = (message:string) => action(HANDLE_ERROR,message);

export const dismissError = () => action(DISMISS_ERROR);
