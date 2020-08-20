import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {Colors, Provider, Snackbar, TextInput} from "react-native-paper";
import {connect} from "react-redux";
import {Keyboard, StyleSheet, View, TextInput as BaseTextInput} from "react-native";
import {EDIT_CATEGORY_SCREEN, EDIT_LOCATION_SCREEN} from "../../ScreensNames";
import Loader from "../../components/Loader";
import appTheme from "../../theme/appTheme";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {currentTopBar, popScreen} from "../../redux/actions/NavigationActions";
import {dismissError} from "../../redux/actions/ErrorActions";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";
import {Category} from "../../data/types/Category";
import {Location} from "../../data/types/Location";
import MultiChoose, {BaseItem} from "../../components/MultiChoose";
import {addLocation, clearLocationMessage, editLocation} from "../../redux/actions/LocationActions";
import {GroupList} from "../../data/types/GroupList";

interface PassProps {
    location?: Location;
}

interface StateProps {
    // locations: Location[];
    // locationGroup: GroupList[];
    // needUpdate: boolean;
    isLoading: boolean;
    currentScreen: string;
    successMessage?: string;
    errorMessage?: string;
    categories: Category[];
    // chosenLocationId: string;
    // chosenLocationCategoryGroup: string;
}

interface DispatchProps {
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void;
    popScreen: () => void;
    successMessageHandled: () => void;
    dismissError: () => void;
    addLocation: (name: string, categories: string[], location: { lat: number, long: number }) => void;
    updateLocation: (id: string, name: string, categories: string[], location: { lat: number, long: number }) => void;
}

type Props = StateProps & DispatchProps & PassProps

const EditLocationScreen: FunctionComponent<Props> = (props) => {
    const [name, setName] = useState(props.location ? props.location.name : '');
    const [lat, setLat] = useState(props.location ? props.location.lat.toString() : '');
    const [long, setLong] = useState(props.location ? props.location.long.toString() : '');
    const [saveDisable, setSaveDisable] = useState(true)
    const chosenCategoriesTemp = props.categories
        .filter(c => props.location?.categories.includes(c.id))
        .map(c => ({id: c.id, name: c.name}));
    const [chosenCategories, setChosenCategories] = useState<BaseItem[]>(chosenCategoriesTemp)

    const onDismissSuccessSnackBar = useCallback(() => {
        props.successMessageHandled()
        props.popScreen()
    }, [])

    const onDismissErrorSnackBar = useCallback(() => {
        props.dismissError()
    }, [])

    useEffect(() => {
        if (
            name == '' ||
            parseFloat(long) == undefined ||
            parseFloat(lat) == undefined ||
            chosenCategories.length == 0
        ) {
            setSaveDisable(true);
        } else if (
            props.location &&
            props.location.name == name &&
            props.location.lat.toString() == lat &&
            props.location.long.toString() == long &&
            chosenCategories.filter(c => props.location?.categories.includes(c.id.toString())).length == chosenCategories.length
        ) {
            setSaveDisable(true);
        } else {
            setSaveDisable(false);
        }
    }, [name, long, lat, chosenCategories])

    const setButtons = () => {
        if (props.currentScreen == EDIT_LOCATION_SCREEN) {
            const title = props.location != undefined ? "Edit location" : "Add new location"
            props.updateActions(title, [
                {
                    icon: "close",
                    onPress: () => props.popScreen()
                }, {
                    icon: "content-save",
                    onPress: saveDisable ? undefined : save

                }
            ], [])
        }
    }

    const save = useCallback(() => {
        const latF = parseFloat(lat);
        const longF = parseFloat(long);
        if (props.location) {
            props.updateLocation(props.location.id, name, chosenCategories.map(c => c.id.toString()), {long:longF, lat:latF})
        } else {
            props.addLocation(name,chosenCategories.map(c=>c.id.toString()),{long:longF,lat:latF})
        }
    }, [name, long, lat, chosenCategories, props.addLocation, props.updateLocation])

    useEffect(() => {
        setButtons()
    }, [props.currentScreen, saveDisable])

    let longInput: BaseTextInput | null = null;
    let latInput: BaseTextInput | null = null;

    return <Provider theme={appTheme}>
        <View style={styles.container}>
            <TextInput
                label="Location name"
                value={name}
                onChangeText={setName}
                returnKeyType={'next'}
                mode={'outlined'}
                style={styles.input}
                onEndEditing={() => latInput?.focus()}
            />
            <TextInput
                label="Latitude"
                value={lat}
                onChangeText={setLat}
                returnKeyType={'next'}
                mode={'outlined'}
                keyboardType={'decimal-pad'}
                style={styles.input}
                ref={c => latInput = c}
                onEndEditing={() => longInput?.focus()}
            />
            <TextInput
                label="Longitude"
                value={long}
                onChangeText={setLong}
                returnKeyType={'next'}
                mode={'outlined'}
                keyboardType={'decimal-pad'}
                style={styles.input}
                ref={c => longInput = c}
                onEndEditing={Keyboard.dismiss}
            />
            <MultiChoose
                itemsToChoose={props.categories}
                onListChange={setChosenCategories}
                chosenItems={chosenCategories}
                addAction={'Choose Categories'}
                style={[styles.input, {marginTop: 20}]}
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
    const {categories} = state.categoriesState
    const {currentScreenName} = state.navigation
    const {locationGroup, locations, needUpdateLocation, isLoading, successMessage, chosenLocationId, chosenLocationCategoryGroup} = state.locations
    const {error} = state.errors
    return {
        // locations,
        // locationGroup,
        // needUpdate: needUpdateLocation,
        isLoading,
        currentScreen: currentScreenName,
        successMessage,
        errorMessage: error,
        categories,
        // chosenLocationId,
        // chosenLocationCategoryGroup
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        popScreen: () => dispatch(popScreen()),
        successMessageHandled: () => dispatch(clearLocationMessage()),
        dismissError: () => dispatch(dismissError()),
        addLocation: (name, categories, location) => dispatch(addLocation(name, location, categories)),
        updateLocation: (id, name, categories, location) => dispatch(editLocation(id, name, location, categories))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditLocationScreen)