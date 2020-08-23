import React, {FunctionComponent} from "react";
import {Appbar} from "react-native-paper";
import {connect} from "react-redux";
import {GlobalState} from "../redux/reducers/GlobalState";
import {TopBarAction} from "../redux/reducers/NavigationReducer";

interface StateProps {
    currentScreen: string;
    title: string;
    leftActions: TopBarAction[];
    rightActions: TopBarAction[];
}

type Props = StateProps

const MyAppBar: FunctionComponent<Props> = (props) => {
    const renderAction = (action: TopBarAction) => {
        return <Appbar.Action
            icon={action.icon}
            disabled={action.onPress == undefined}
            onPress={action.onPress}
            key={action.icon}
        />
    }

    return <Appbar>
        {props.leftActions.map(action => renderAction(action))}
        <Appbar.Content title={props.title}/>
        {props.rightActions.reverse().map(action => renderAction(action))}

    </Appbar>
}

function mapStateToProps(state: GlobalState): StateProps {
    const {currentScreenName, topBarTitle, leftActions, rightActions} = state.navigation
    return {
        currentScreen: currentScreenName,
        title: topBarTitle,
        leftActions,
        rightActions
    }
}

export default connect(mapStateToProps)(MyAppBar)
