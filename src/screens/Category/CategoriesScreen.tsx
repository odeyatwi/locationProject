import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {View, StyleSheet, FlatList, ListRenderItemInfo, TouchableWithoutFeedback} from "react-native";
import {Colors} from "react-native-paper";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {connect} from "react-redux";
import {Category} from "../../data/types/Category";
import {chosenIndex, deleteCategory} from "../../redux/actions/CategoryActions";
import ListItem from "../../components/ListItem";
import {CATEGORIES_SCREEN, EDIT_CATEGORY_SCREEN} from "../../ScreensNames";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";
import {currentTopBar, pushScreen} from "../../redux/actions/NavigationActions";


interface StateProps {
    categories: Category[],
    currentIndex: number,
    isLoading: boolean,
    currentScreen: string
}

interface DispatchProps {
    chosenIndex: (index: number) => void,
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void
    pushScreen: (name: string, props: any) => void,
    deleteCategory: (id: string) => void
}

type Props = StateProps & DispatchProps

const CategoriesScreen: FunctionComponent<Props> = (props) => {
    const [selected, setSelected] = useState(-1)
    const setIndexSelected = useCallback((index: number) => () => setSelected(index), [])

    const _renderItem = useCallback((item: ListRenderItemInfo<Category>) => {
        return <ListItem
            onPress={setIndexSelected(item.index)}
            isSelected={selected == item.index}
            title={item.item.name}
        />
    }, [selected])

    const setSelectedAction = () =>{
        const category = props.categories[selected]
        props.updateActions('', [
            {
                icon: "pencil",
                onPress: () => {
                    console.log('push category',category)
                    props.pushScreen(EDIT_CATEGORY_SCREEN, {category}
                    )
                }
            }, {
                icon: "delete",
                onPress: () => props.deleteCategory(category.id)
            }
        ], [])
    }

    const setNotSelectedActions = () => {
        props.updateActions("Categories", [
            {
                icon: "plus",
                onPress: () =>
                    props.pushScreen(EDIT_CATEGORY_SCREEN, {})
            },
        ], [])
    }

    useEffect(() => {
        console.log('screen change', props.currentScreen)
        if (props.currentScreen == CATEGORIES_SCREEN) {
            if (selected > -1) {
                setSelectedAction()
            } else {
                setNotSelectedActions()
            }
        }
    }, [props.currentScreen])

    useEffect(() => {
        if (props.currentScreen == CATEGORIES_SCREEN) {
            if (selected > -1) {
                setSelectedAction()
            } else {
                setNotSelectedActions()
            }
        }
    }, [selected])

    const _keyExtractor = useCallback((item: Category, index: number) => item.id, [])
    return <TouchableWithoutFeedback onPress={setIndexSelected(-1)}>
        <View style={styles.container}>
            <FlatList
                data={props.categories}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
            />
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.grey100
    }
})

function mapStateToProps(state: GlobalState): StateProps {
    const {categories, selectedIndex, loadingCategories} = state.categoriesState
    const {currentScreenName} = state.navigation
    return {
        categories,
        currentIndex: selectedIndex,
        isLoading: loadingCategories,
        currentScreen: currentScreenName
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        chosenIndex: (index) => dispatch(chosenIndex(index)),
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        pushScreen: (name, props) => dispatch(pushScreen(name, props)),
        deleteCategory: (id: string) => dispatch(deleteCategory(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen)
