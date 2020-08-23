import React, {FunctionComponent, useCallback, useEffect} from "react";
import {View, StyleSheet, FlatList, ListRenderItemInfo, TouchableWithoutFeedback} from "react-native";
import {Button, Colors} from "react-native-paper";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {connect} from "react-redux";
import {Category} from "../../data/types/Category";
import {chosenIndex, deleteCategory, getAllCategories} from "../../redux/actions/CategoryActions";
import ListItem from "../../components/ListItem";
import {CATEGORIES_SCREEN, EDIT_CATEGORY_SCREEN} from "../../ScreensNames";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";
import {currentTopBar, pushScreen} from "../../redux/actions/NavigationActions";
import Loader from "../../components/Loader";


interface StateProps {
    categories: Category[];
    currentIndex: number;
    isLoading: boolean;
    currentScreen: string;
}

interface DispatchProps {
    chosenIndex: (index: number) => void,
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void,
    pushScreen: (name: string, props: any) => void,
    deleteCategory: (id: string) => void,
    getAllCategories: () => void,
}

type Props = StateProps & DispatchProps;

const CategoriesScreen: FunctionComponent<Props> = (props) => {
    const setIndexSelected = useCallback((index: number) => () => props.chosenIndex(index), [])

    useEffect(() => {
        props.getAllCategories();
    }, [])

    const _renderItem = useCallback((item: ListRenderItemInfo<Category>) => {
        return <ListItem
            onPress={setIndexSelected(item.index)}
            isSelected={props.currentIndex == item.index}
            title={item.item.name}
        />
    }, [props.currentIndex])

    const openAddCategory = useCallback(()=>{
        props.pushScreen(EDIT_CATEGORY_SCREEN, {})
    },[])

    const setSelectedAction = () => {
        const category = props.categories[props.currentIndex];
        props.updateActions('', [
            {
                icon: "pencil",
                onPress: () => {
                    props.pushScreen(EDIT_CATEGORY_SCREEN, {category})
                }
            }, {
                icon: "delete",
                onPress: () => {
                    props.deleteCategory(category.id)
                }
            }
        ], []);
    }

    const setNotSelectedActions = () => {
        props.updateActions("", [
            {
                icon: "plus",
                onPress: openAddCategory

            },
        ], []);
    }

    useEffect(() => {
        if (props.currentScreen == CATEGORIES_SCREEN) {
            if (props.currentIndex > -1) {
                setSelectedAction();
            } else {
                setNotSelectedActions();
            }
        }
    }, [props.currentScreen]);


    useEffect(() => {
        if (props.currentScreen == CATEGORIES_SCREEN) {
            if (props.currentIndex > -1) {
                setSelectedAction();
            } else {
                setNotSelectedActions();
            }
        }
    }, [props.currentIndex]);

    const _keyExtractor = useCallback((item: Category) => item.id, []);

    const renderEmptyComponent = () => {
        return <View style={styles.emptyContainer}>
            <Button mode={'text'} color={'rgba(1, 87, 155,.2)'} labelStyle={{fontSize:30}} onPress={openAddCategory}>Add new category</Button>
        </View>
    }

    return <TouchableWithoutFeedback onPress={setIndexSelected(-1)}>
        <View style={styles.container}>
            <FlatList
                style={styles.fullContainer}
                contentContainerStyle={[props.categories.length == 0 && styles.fullContainer]}
                data={props.categories}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
                ListEmptyComponent={renderEmptyComponent}
            />
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
        categories,
        currentIndex: selectedIndex,
        isLoading: loadingCategories,
        currentScreen: currentScreenName,
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        chosenIndex: (index) => dispatch(chosenIndex(index)),
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        pushScreen: (name, props) => dispatch(pushScreen(name, props)),
        deleteCategory: (id: string) => dispatch(deleteCategory(id)),
        getAllCategories: () => dispatch(getAllCategories()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen)
