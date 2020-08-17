import React, {useEffect} from "react";
import {Actions, Router, Scene, Stack} from "react-native-router-flux";
import EditCategoryScreen from "./screens/Category/EditCategoryScreen";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {GlobalState} from "./redux/reducers/GlobalState";
import {RootAction} from "./redux/actions/ActionsTypes";
import {currentScreenName, getPreviousScreen} from "./redux/actions/NavigationActions";
import {useBackHandler} from "@react-native-community/hooks";
import {BackHandler} from "react-native";
import {CATEGORIES_SCREEN, EDIT_CATEGORY_SCREEN, MAIN_SCREEN} from "./ScreensNames";
import MainScreen from "./screens/MainScreen";

interface DispatchProps {
    currentScreen: (name:string) => void
}

const RouterComponent: React.FunctionComponent<DispatchProps> =(props)=>{
    useBackHandler(()=>{
        if((Actions.state as any).index == 0){
            BackHandler.exitApp();
            return true;
        }
        props.currentScreen(getPreviousScreen());
        return false;
    })
    useEffect(()=>{
        props.currentScreen(CATEGORIES_SCREEN);
    },[null])

    return <Router>
        <Stack key="root">
            <Scene key={MAIN_SCREEN} component={MainScreen} initial hideNavBar />
            <Scene key={EDIT_CATEGORY_SCREEN} component={EditCategoryScreen} hideNavBar />
        </Stack>
    </Router>
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        currentScreen: (name)=> dispatch(currentScreenName(name))
    }
}

export default connect(null,mapDispatchToProps)(RouterComponent)
