import React, {FunctionComponent} from "react";
import {Appbar} from "react-native-paper";
import {connect} from "react-redux";
import {GlobalState} from "../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../redux/actions/ActionsTypes";
import {TopBarAction} from "../redux/reducers/NavigationReducer";

interface StateProps {
    currentScreen: string,
    title: string,
    leftActions: TopBarAction[],
    rightActions: TopBarAction[]
}

type Props = StateProps

const MyAppBar: FunctionComponent<Props> = (props) => {
    return <Appbar>
        {props.leftActions.map(action=><Appbar.Action icon={action.icon} onPress={action.onPress}/>)}
        <Appbar.Content title={props.title} />
        {props.rightActions.reverse().map(action=><Appbar.Action icon={action.icon} onPress={action.onPress}/>)}

    </Appbar>
}

function mapStateToProps(state: GlobalState): StateProps {
    const {currentScreenName,topBarTitle,leftActions,rightActions} = state.navigation
    return {
        currentScreen: currentScreenName,
        title:topBarTitle,
        leftActions,
        rightActions
    }
}

export default connect(mapStateToProps)(MyAppBar)
