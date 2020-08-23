import React, {FunctionComponent, useCallback, useEffect} from "react";
import {StyleSheet, View} from "react-native";
import {BottomNavigation, Colors, Snackbar} from "react-native-paper";
import CategoriesScreen from "./Category/CategoriesScreen";
import {GlobalState} from "../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../redux/actions/ActionsTypes";
import {currentScreenName} from "../redux/actions/NavigationActions";
import {connect} from "react-redux";
import {CATEGORIES_SCREEN, LOCATIONS_SCREEN, MAIN_SCREEN} from "../ScreensNames";
import {dismissError} from "../redux/actions/ErrorActions";
import appTheme from "../theme/appTheme";
import LocationsScreen from "./Location/LocationsScreen";

interface StateProps {
    currentScreen: string;
    errorMessage?: string;
}

interface DispatchProps {
    updateCurrentScreen: (screenName: string) => void;
    dismissError: () => void;
}

type Props = StateProps & DispatchProps

const MainScreen: FunctionComponent<Props> = (props) => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: CATEGORIES_SCREEN, title: 'Categories', icon: 'shape'},
        {key: LOCATIONS_SCREEN, title: 'Locations', icon: 'map-marker'},
    ]);

    const setScreen = useCallback((index:number)=>{
        setIndex(index);
        props.updateCurrentScreen(routes[index].key);
    },[routes]);

    const renderScene = BottomNavigation.SceneMap({
        [CATEGORIES_SCREEN]: () => <CategoriesScreen/>,
        [LOCATIONS_SCREEN]: () => <LocationsScreen/>,
    });

    useEffect(() => {
        if (props.currentScreen == MAIN_SCREEN) {
            props.updateCurrentScreen(routes[index].key);
        }
    }, [props.currentScreen]);

    const onDismissErrorSnackBar = useCallback(() => {
        props.dismissError();
    }, []);

    return <View style={{flex:1}}>
        <BottomNavigation
            navigationState={{index, routes}}
            onIndexChange={setScreen}
            renderScene={renderScene}
            barStyle={{backgroundColor:  Colors.blueGrey600}}
        />
        <Snackbar
            visible={!!props.errorMessage && (props.currentScreen == CATEGORIES_SCREEN || props.currentScreen == LOCATIONS_SCREEN)}
            onDismiss={onDismissErrorSnackBar}
            duration={500}
            style={styles.errorSnackBar}
        >
            {props.errorMessage}
        </Snackbar>
    </View>
}

const styles = StyleSheet.create({
    errorSnackBar: {
        backgroundColor: appTheme.colors.error
    }
})

function mapStateToProps(state: GlobalState): StateProps {
    const {currentScreenName} = state.navigation;
    const {error} = state.errors
    return {
        currentScreen: currentScreenName,
        errorMessage: error
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateCurrentScreen: screenName => dispatch(currentScreenName(screenName)),
        dismissError: () => dispatch(dismissError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);