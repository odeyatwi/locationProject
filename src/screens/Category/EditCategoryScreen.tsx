import React, {FunctionComponent, useCallback, useEffect, useState,} from "react";
import {View, StyleSheet} from "react-native";
import {Colors, Snackbar, TextInput} from "react-native-paper";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {connect} from "react-redux";
import {Category} from "../../data/types/Category";
import {EDIT_CATEGORY_SCREEN} from "../../ScreensNames";
import {currentTopBar, popScreen} from "../../redux/actions/NavigationActions";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";
import {addCategory, clearMessage, editCategory} from "../../redux/actions/CategoryActions";
import Loader from "../../components/Loader";
import {dismissError} from "../../redux/actions/ErrorActions";
import appTheme from "../../theme/appTheme";

interface PassProps {
    category?: Category
}

interface StateProps {
    isLoading: boolean,
    currentScreen: string,
    successMessage?: string,
    errorMessage?: string
}

interface DispatchProps {
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void
    popScreen: () => void,
    addCategory: (name: string) => void,
    editCategory: (id: string, name: string) => void,
    successMessageHandled: () => void
    dismissError: () => void
}

type Props = StateProps & DispatchProps & PassProps

const EditCategoryScreen: FunctionComponent<Props> = (props) => {
    const [input, setInput] = useState(props.category ? props.category.name : '')

    const saveAction = () => {
        if (input.length > 0) {
            if (props.category) {
                props.editCategory(props.category.id, input)
            } else {
                props.addCategory(input)
            }
        }
    }

    const setButtons = () => {
        if (props.currentScreen == EDIT_CATEGORY_SCREEN) {
            const title = props.category != undefined ? "Edit category" : "Add new category"
            props.updateActions(title, [
                {
                    icon: "close",
                    onPress: () =>
                        props.popScreen()
                }, {
                    icon: "content-save",
                    onPress: input.length == 0 ? undefined : () => saveAction()

                }
            ], [])
        }
    }

    useEffect(() => {
        setButtons()
    }, [props.currentScreen])

    useEffect(() => {
        setButtons()
    }, [input])

    const onDismissSuccessSnackBar = useCallback(() => {
        props.successMessageHandled()
        props.popScreen()
    }, [])

    const onDismissErrorSnackBar = useCallback(() => {
        props.dismissError()
    }, [])

    return <>
        <View style={styles.container}>
            <TextInput
                label="Category name"
                value={input}
                onChangeText={setInput}
                returnKeyType={'done'}
                mode={'outlined'}
                style={styles.input}
                onEndEditing={saveAction}
            />
            <Snackbar
                visible={!!props.successMessage}
                onDismiss={onDismissSuccessSnackBar}
                duration={100}
            >
                {props.successMessage}
            </Snackbar>
            <Snackbar
                visible={!!props.errorMessage && props.currentScreen == EDIT_CATEGORY_SCREEN}
                onDismiss={onDismissErrorSnackBar}
                duration={100}
                style={styles.errorSnackBar}
            >
                {props.errorMessage}
            </Snackbar>
            <Loader isVisible={props.isLoading}/>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey100,
    },
    input: {
        width: '80%',
        marginStart: 20,
        marginTop: 40
    },
    errorSnackBar: {
        backgroundColor: appTheme.colors.error
    }
})


function mapStateToProps(state: GlobalState): StateProps {
    const {editLoading, editSuccessMessage} = state.categoriesState
    const {currentScreenName} = state.navigation
    const {error} = state.errors
    return {
        isLoading: editLoading,
        currentScreen: currentScreenName,
        successMessage: editSuccessMessage,
        errorMessage: error
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        popScreen: () => dispatch(popScreen()),
        addCategory: (name) => dispatch(addCategory(name)),
        editCategory: (id, name) => dispatch(editCategory(id, name)),
        successMessageHandled: () => dispatch(clearMessage()),
        dismissError: () => dispatch(dismissError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategoryScreen)
