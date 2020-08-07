import React, {FunctionComponent, useCallback, useState} from "react";
import {View, StyleSheet, FlatList, ListRenderItemInfo, TouchableWithoutFeedback} from "react-native";
import {Colors} from "react-native-paper";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {connect} from "react-redux";
import {Category} from "../../data/types/Category";
import {chosenIndex} from "../../redux/actions/CategoryActions";
import ListItem from "../../components/ListItem";

interface StateProps {
    categories: Category[],
    currentIndex: number,
    isLoading: boolean
}

interface DispatchProps {
    chosenIndex: (index: number) => void
}

type Props = StateProps & DispatchProps

const CategoriesScreen: FunctionComponent<Props> = (props) => {
    const words = ['Title1', 'Title2', 'Title3', 'Title4']
    const [selected, setSelected] = useState(-1)
    const setIndexSelected = useCallback((index: number) => () => setSelected(index), [])

    const _renderItem = (item: ListRenderItemInfo<string>) => {
        return <ListItem
            onPress={setIndexSelected(item.index)}
            isSelected={selected == item.index}
            title={item.item}
        />
    }
    return <TouchableWithoutFeedback onPress={setIndexSelected(-1)}>
        <View style={styles.container}>
            <FlatList
                // style={{width: '100%'}}
                data={words}
                renderItem={_renderItem}
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
    return {
        categories,
        currentIndex: selectedIndex,
        isLoading: loadingCategories
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        chosenIndex: (index) => dispatch(chosenIndex(index))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen)
