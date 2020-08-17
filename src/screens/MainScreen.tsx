import React, {FunctionComponent, useCallback, useEffect} from "react";
import {Text, View} from "react-native";
import {BottomNavigation, Colors} from "react-native-paper";
import CategoriesScreen from "./Category/CategoriesScreen";
import {GlobalState} from "../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../redux/actions/ActionsTypes";
import {currentScreenName} from "../redux/actions/NavigationActions";
import {connect} from "react-redux";
import {CATEGORIES_SCREEN, MAIN_SCREEN} from "../ScreensNames";

interface StateProps {
    currentScreen: string
}

interface DispatchProps {
    updateCurrentScreen: (screenName: string) => void;
}

type Props = StateProps & DispatchProps

const MainScreen: FunctionComponent<Props> = (props) => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: CATEGORIES_SCREEN, title: 'Categories', icon: 'shape'},
        {key: 'locations', title: 'Locations', icon: 'map-marker'},
    ]);

    const setScreen = useCallback((index:number)=>{
        setIndex(index);
        props.updateCurrentScreen(routes[index].key)
    },[routes])

    useEffect(() => {
        if (props.currentScreen == MAIN_SCREEN) {
            props.updateCurrentScreen(routes[index].key)
        }
    }, [props.currentScreen]);

    const renderScene = BottomNavigation.SceneMap({
        [CATEGORIES_SCREEN]: () =><CategoriesScreen/>,
        locations: () => <Text>Locations</Text>,
    });
    return <View style={{flex:1}}>
        <BottomNavigation
            navigationState={{index, routes}}
            onIndexChange={setScreen}
            renderScene={renderScene}
            barStyle={{backgroundColor:  Colors.blueGrey600}}
        />
    </View>
}

function mapStateToProps(state: GlobalState): StateProps {
    const {currentScreenName} = state.navigation;
    const {error} = state.errors
    return {
        currentScreen: currentScreenName,
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateCurrentScreen: screenName => dispatch(currentScreenName(screenName))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);