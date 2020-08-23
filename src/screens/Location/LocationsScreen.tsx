import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    FlatList,
    ListRenderItemInfo,
    Platform,
    Linking
} from "react-native";
import {Colors, IconButton, Button} from "react-native-paper";
import {GlobalState} from "../../redux/reducers/GlobalState";
import {ThunkDispatch} from "redux-thunk";
import {RootAction} from "../../redux/actions/ActionsTypes";
import {connect} from "react-redux";
import {Category} from "../../data/types/Category";
import {EDIT_LOCATION_SCREEN, LOCATIONS_SCREEN} from "../../ScreensNames";
import {TopBarAction} from "../../redux/reducers/NavigationReducer";
import {currentTopBar, pushScreen} from "../../redux/actions/NavigationActions";
import Loader from "../../components/Loader";
import {
    deleteLocation,
    getAllLocations,
    getAllLocationsGroup,
    locationChosenIndex
} from "../../redux/actions/LocationActions";
import {Location} from "../../data/types/Location";
import {GroupList} from "../../data/types/GroupList";
import MultiChoose, {BaseItem} from "../../components/MultiChoose";
import ListItem from "../../components/ListItem";
import GroupItem, {Item} from "../../components/GroupItem";


interface StateProps {
    locations: Location[];
    locationGroup: GroupList[];
    needUpdate: boolean;
    isLoading: boolean;
    currentScreen: string;
    errorMessage?: string;
    categories: Category[];
    chosenLocationId: string;
    chosenLocationCategoryGroup: string;
}

interface DispatchProps {
    updateActions: (title: string, rightActions: TopBarAction[], leftActions: TopBarAction[]) => void;
    pushScreen: (name: string, props: any) => void;
    getRegularLocation: (filter: Category[], sort?: boolean) => void;
    getGroupLocation: (filter: Category[], sort?: boolean) => void;
    deleteLocation: (id: string) => void;
    updateChosenLocation: (id: string, categoryId?: string) => void
}

type Props = StateProps & DispatchProps;

const LocationScreen: FunctionComponent<Props> = (props) => {
    const [isGroup, setGroup] = useState(false);
    const [isSort, setIsSort] = useState(false);
    const [filter, setFilter] = useState<Category[]>([])


    const _renderItem = useCallback((item: ListRenderItemInfo<Location>) => {
        let isSelected = props.chosenLocationId == item.item.id
        return <ListItem
            onPress={() => props.updateChosenLocation(item.item.id)}
            isSelected={isSelected}
            title={item.item.name}
            right={'map-marker'}
            rightPress={openMap(item.item.lat,item.item.long)}

        />
    }, [props.chosenLocationId])

    const _renderItemGroup = useCallback((item: ListRenderItemInfo<GroupList>) => {
        return <GroupItem title={item.item.category.name}>
            {item.item.locations.map((location, index) => {
                const isSelected = props.chosenLocationId == location.id && item.item.category.id == props.chosenLocationCategoryGroup
                return <Item
                    key={location.id + ',' + item.item.category.id}
                    title={location.name}
                    onPress={() => props.updateChosenLocation(location.id, item.item.category.id)}
                    isSelected={isSelected}
                    onPressRight={openMap(location.lat,location.long)}
                    isLast={index == item.item.locations.length - 1}
                />
            })}</GroupItem>
    }, [props.chosenLocationId, props.chosenLocationCategoryGroup])

    const openAddLocation = useCallback(() => {
        props.pushScreen(EDIT_LOCATION_SCREEN, {})
    }, [props.pushScreen]);

    const openEditLocation = useCallback(() => {
            if (props.chosenLocationId != '') {
                const location = props.locations.find(l => l.id == props.chosenLocationId);
                props.pushScreen(EDIT_LOCATION_SCREEN, {location})
            }
        },
        [props.pushScreen, props.chosenLocationId]);

    const deleteLocation = useCallback(() => {
            if (props.chosenLocationId != '') {
                props.deleteLocation(props.chosenLocationId)
            }
        },
        [props.deleteLocation, props.chosenLocationId])

    const onFilterChange = useCallback((categories: BaseItem[]) => {
        const list = categories.map(c => c as Category)
        setFilter(list)
    }, props.categories)

    const setSelectedAction = () => {
        props.updateActions('', [
            {
                icon: "pencil",
                onPress: openEditLocation,
            }, {
                icon: "delete",
                onPress: deleteLocation,
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
            if (props.chosenLocationId != '') {
                setSelectedAction();
            } else {
                setNotSelectedActions();
            }
        }
    }, [props.currentScreen, props.chosenLocationId]);

    useEffect(() => {
        props.getRegularLocation(filter, isSort)
        props.getGroupLocation(filter.length > 0 ? filter : props.categories, isSort)
    }, [filter, isSort])

    useEffect(() => {
        if (props.needUpdate) {
            props.getRegularLocation(filter, isSort)
            props.getGroupLocation(filter.length > 0 ? filter : props.categories, isSort)
        }
    }, [props.needUpdate, filter, isSort])

    const openMap = useCallback((lat: number, lng: number) => () => {
        const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        if (url) {
            Linking.openURL(url);
        }
    }, [])


    const _keyExtractor = useCallback((item: Category) => item.id, []);
    const _keyExtractorGroup = useCallback((item: GroupList) => item.category.id, []);

    const renderEmptyComponent = () => {
        return <View style={[styles.emptyContainer]}>
            <Button mode={'text'} color={'rgba(1, 87, 155,.2)'} labelStyle={{fontSize: 30}} onPress={openAddLocation}>
                Add new location
            </Button>
        </View>
    }

    return <TouchableWithoutFeedback onPress={() => props.updateChosenLocation('', '')}>
        <View style={styles.container}>
            <View style={{flexDirection: 'row-reverse', width: '92%', alignSelf: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                    <IconButton icon={'file-tree'} onPress={() => setGroup(!isGroup)}
                                color={isGroup ? Colors.white : Colors.blueGrey600}
                                style={[isGroup && {backgroundColor: Colors.blueGrey600}]}
                    />
                    <IconButton icon={'sort-alphabetical-descending-variant'} onPress={() => setIsSort(!isSort)}
                                color={isSort ? Colors.white : Colors.blueGrey600}
                                style={[{padding: 0}, isSort && {backgroundColor: Colors.blueGrey600}]}/>
                </View>
                <MultiChoose itemsToChoose={props.categories} onListChange={onFilterChange} chosenItems={filter}
                             addAction={'Filter by'} style={{flex: 1, marginEnd: 10}}/>
            </View>
            {isGroup && <FlatList
                style={styles.fullContainer}
                contentContainerStyle={[props.locationGroup.length == 0 && styles.fullContainer]}
                data={props.locationGroup}
                renderItem={_renderItemGroup}
                keyExtractor={_keyExtractorGroup}
                ListEmptyComponent={renderEmptyComponent}
            />}
            {!isGroup && <FlatList
                style={styles.fullContainer}
                contentContainerStyle={[props.locations.length == 0 && styles.fullContainer]}
                data={props.locations}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
                ListEmptyComponent={renderEmptyComponent}
            />}
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
        flex: 1
    },
})

function mapStateToProps(state: GlobalState): StateProps {
    const {categories} = state.categoriesState
    const {currentScreenName} = state.navigation
    const {locationGroup, locations, needUpdateLocation, isLoading, chosenLocationId, chosenLocationCategoryGroup} = state.locations
    const {error} = state.errors
    return {
        locations,
        locationGroup,
        needUpdate: needUpdateLocation,
        isLoading,
        currentScreen: currentScreenName,
        errorMessage: error,
        categories,
        chosenLocationId,
        chosenLocationCategoryGroup
    }
}

function mapDispatchToProps(dispatch: ThunkDispatch<GlobalState, {}, RootAction>): DispatchProps {
    return {
        updateActions: (title, rightActions, leftActions) =>
            dispatch(currentTopBar(title, rightActions, leftActions)),
        pushScreen: (name, props) => dispatch(pushScreen(name, props)),
        getRegularLocation: (filter, sort?) => dispatch(getAllLocations(filter, sort)),
        getGroupLocation: (filter, sort?) => dispatch(getAllLocationsGroup(filter, sort)),
        deleteLocation: (id) => dispatch(deleteLocation(id)),
        updateChosenLocation: (id, categoryId = '') => dispatch(locationChosenIndex(id, categoryId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen)
