import React, {FunctionComponent, useEffect,} from "react";
import {View, StyleSheet} from "react-native";
import {Colors} from "react-native-paper";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {connect} from "react-redux";
import {Category} from "../../data/types/Category";
import {EDIT_CATEGORY_SCREEN} from "../../ScreensNames";
import {currentTopBar, popScreen} from "../../redux/actions/NavigationActions";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";

interface PassProps {
    category?: Category
}

interface StateProps {
    isLoading: boolean,
    currentScreen: string
}

interface DispatchProps {
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void
    popScreen: () => void,
}

type Props = StateProps & DispatchProps & PassProps

const EditCategoryScreen: FunctionComponent<Props> = (props) => {
    console.log(props)

    useEffect(() => {
        if (props.currentScreen == EDIT_CATEGORY_SCREEN) {
            const title = props.category != undefined ? props.category.name : "Add new category"
            props.updateActions(title, [
                {
                    icon: "close",
                    onPress: () =>
                        props.popScreen()
                }, {
                    icon: "content-save",
                    onPress: () => {}
                }
            ], [])
        }
    }, [props.currentScreen])

    return <>
        <View style={styles.container}>

        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey100,
        alignItems:"center"
    }
})


function mapStateToProps(state: GlobalState): StateProps {
    const {editLoading} = state.categoriesState
    const {currentScreenName} = state.navigation
    return {
        isLoading: editLoading,
        currentScreen: currentScreenName
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        popScreen: () => dispatch(popScreen())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategoryScreen)
