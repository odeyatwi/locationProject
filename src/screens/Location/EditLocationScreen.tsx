import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {Colors, Dialog, Provider, Snackbar, TextInput} from "react-native-paper";
import {connect} from "react-redux";
import {FlatList, StyleSheet, View, Text, Keyboard} from "react-native";
import {EDIT_CATEGORY_SCREEN, EDIT_LOCATION_SCREEN} from "../../ScreensNames";
import Loader from "../../components/Loader";
import appTheme from "../../theme/appTheme";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {currentTopBar, popScreen} from "../../redux/actions/NavigationActions";
import {clearMessage} from "../../redux/actions/CategoryActions";
import {dismissError} from "../../redux/actions/ErrorActions";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";
import {Category} from "../../data/types/Category";
import {Location} from "../../data/types/Location";

interface PassProps {
    location?: Location;
}

interface StateProps {
    isLoading: boolean;
    successMessage?: string;
    errorMessage?: string;
    currentScreen: string;
    categories: Category[]
}

interface DispatchProps {
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void;
    popScreen: () => void;
    successMessageHandled: () => void;
    dismissError: () => void;
}

type Props = StateProps & DispatchProps & PassProps

const EditLocationScreen: FunctionComponent<Props> = (props) => {
    const [input, setInput] = useState('')
    const [menuVisible, setVisibleMenu] = useState(false)
    // const [chosenCategoryIndex,setChosenCategory] = useState(props.location ? props.location.)

    const onDismissSuccessSnackBar = useCallback(() => {
        props.successMessageHandled()
        props.popScreen()
    }, [])

    const onDismissErrorSnackBar = useCallback(() => {
        props.dismissError()
    }, [])

    const setButtons = () => {
        if (props.currentScreen == EDIT_LOCATION_SCREEN) {
            const title = props.location != undefined ? "Edit location" : "Add new location"
            props.updateActions(title, [
                {
                    icon: "close",
                    onPress: () =>
                        props.popScreen()
                }, {
                    icon: "content-save",
                    onPress: input.length == 0 ? undefined : ()=>{}

                }
            ], [])
        }
    }

    useEffect(() => {
        setButtons()
    }, [props.currentScreen])

    return <Provider theme={appTheme}>
        <View style={styles.container}>
            <TextInput
                label="Location name"
                value={input}
                onChangeText={setInput}
                returnKeyType={'done'}
                mode={'outlined'}
                style={styles.input}
                // onEndEditing={doneEdit}
            />
            <TextInput
                onTouchStart={() => setVisibleMenu(true)}
                label="Choose category"
                // value={input}
                // onChangeText={setInput}
                mode={'outlined'}
                style={styles.input}
                onFocus={() => Keyboard.dismiss()}
            />

            <Dialog visible={menuVisible} onDismiss={() => setVisibleMenu(false)} style={{height: '90%'}}>
                <Dialog.ScrollArea>
                    <FlatList data={props.categories} renderItem={() => <Text>Try</Text>}/>
                </Dialog.ScrollArea>
            </Dialog>
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
                duration={500}
                style={styles.errorSnackBar}
            >
                {props.errorMessage}
            </Snackbar>
            <Loader isVisible={props.isLoading}/>
        </View>
    </Provider>
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
    const {editLoading, editSuccessMessage, categories} = state.categoriesState
    const {currentScreenName} = state.navigation
    const {error} = state.errors
    return {
        isLoading: editLoading,
        currentScreen: currentScreenName,
        successMessage: editSuccessMessage,
        errorMessage: error,
        categories
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        popScreen: () => dispatch(popScreen()),
        successMessageHandled: () => dispatch(clearMessage()),
        dismissError: () => dispatch(dismissError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditLocationScreen)