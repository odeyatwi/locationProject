import {action} from "typesafe-actions";
import {SCREEN_NAME, UPDATE_TOP_BAR_ACTIONS} from "./types";
import {TopBarAction} from "../reducers/NavigationReducer";
import {Actions} from "react-native-router-flux";

export const currentScreenName = (name: string) => action(SCREEN_NAME, name)
export const currentTopBar = (name: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) =>
    action(UPDATE_TOP_BAR_ACTIONS, {name, rightActions, leftActions})


export function pushScreen(name: string, props: any) {
    Actions.push(name, props)
    return currentScreenName(name)
}

export function popScreen() {
    const prevName = getPreviousScreen()
    console.log('prevScreen', prevName)
    Actions.pop({animated:true})
    console.log('after pop')
    return currentScreenName(prevName)
}

export function getPreviousScreen(): string{
    console.log(Actions.state)
    return (Actions.state as any).routes[(Actions.state as any).index - 1].routeName
}
