import React, {FunctionComponent, useCallback, useEffect} from "react";
import {View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {Colors} from "react-native-paper";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {connect} from "react-redux";
import {Category} from "../../data/types/Category";
import {EDIT_LOCATION_SCREEN, LOCATIONS_SCREEN} from "../../ScreensNames";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";
import {currentTopBar, pushScreen} from "../../redux/actions/NavigationActions";
import Loader from "../../components/Loader";


interface StateProps {
    // categories: Category[];
    currentIndex: number;
    isLoading: boolean;
    currentScreen: string;
}

interface DispatchProps {
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void;
    pushScreen: (name: string, props: any) => void;
}

type Props = StateProps & DispatchProps;

const CategoriesScreen: FunctionComponent<Props> = (props) => {
    // const setIndexSelected = useCallback((index: number) => () => props.chosenIndex(index), [])


    // const _renderItem = useCallback((item: ListRenderItemInfo<Category>) => {
    //     return <ListItem
    //         onPress={setIndexSelected(item.index)}
    //         isSelected={props.currentIndex == item.index}
    //         title={item.item.name}
    //     />
    // }, [props.currentIndex])

    const openAddLocation = useCallback(()=>{
        props.pushScreen(EDIT_LOCATION_SCREEN, {})
    },[])

    const setSelectedAction = () => {
        // const category = props.categories[props.currentIndex];
        props.updateActions('', [
            {
                icon: "pencil",
                onPress: () => {
                    // props.pushScreen(EDIT_CATEGORY_SCREEN, {category})
                }
            }, {
                icon: "delete",
                onPress: () => {
                }
            }
        ], []);
    }

    const setNotSelectedActions = () => {
        props.updateActions("", [
            {
                icon: "plus",
                onPress: openAddLocation

            },
        ], []);
    }

    useEffect(() => {
        if (props.currentScreen == LOCATIONS_SCREEN) {
            console.log('set location action')
            if (props.currentIndex > -1) {
                setSelectedAction();
            } else {
                setNotSelectedActions();
            }
        }
    }, [props.currentScreen]);


    useEffect(() => {
        if (props.currentScreen == LOCATIONS_SCREEN) {
            if (props.currentIndex > -1) {
                setSelectedAction();
            } else {
                setNotSelectedActions();
            }
        }
    }, [props.currentIndex]);

    const _keyExtractor = useCallback((item: Category) => item.id, []);

    // const renderEmptyComponent = () => {
    //     return <View style={styles.emptyContainer}>
    //         <Button mode={'text'} color={'rgba(1, 87, 155,.2)'} labelStyle={{fontSize:30}} onPress={openAddCategory}>Add new category</Button>
    //     </View>
    // }

    return <TouchableWithoutFeedback>
        <View style={styles.container}>
            {/*<FlatList*/}
            {/*    style={styles.fullContainer}*/}
            {/*    contentContainerStyle={[props.categories.length == 0 && styles.fullContainer]}*/}
            {/*    data={props.categories}*/}
            {/*    renderItem={_renderItem}*/}
            {/*    keyExtractor={_keyExtractor}*/}
            {/*    ListEmptyComponent={renderEmptyComponent}*/}
            {/*/>*/}
            <Loader isVisible={props.isLoading}/>
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey100
    },
    emptyContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    fullContainer: {
        flex:1
    },
})

function mapStateToProps(state: GlobalState): StateProps {
    const {categories, selectedIndex, loadingCategories} = state.categoriesState;
    const {currentScreenName} = state.navigation;
    return {
        // categories,
        currentIndex: -1,
        isLoading: loadingCategories,
        currentScreen: currentScreenName,
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        pushScreen: (name, props) => dispatch(pushScreen(name, props)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen)
