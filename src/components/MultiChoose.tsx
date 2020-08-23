import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import {FlatList, Keyboard, ListRenderItemInfo, StyleSheet, View, ViewProps} from "react-native";
import {Button, Chip, Dialog, Portal, Checkbox, Colors} from "react-native-paper";
import appTheme from "../theme/appTheme";

type ID = string | number

export interface BaseItem {
    id: ID;
    name: string;
}

interface Props extends ViewProps {
    itemsToChoose: BaseItem[];
    onListChange: (items: BaseItem[]) => void;
    chosenItems: BaseItem[];
    addAction: string;
}

const MultiChoose: FunctionComponent<Props> = (props)=> {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalIds, setModalIds] = useState<ID[]>(props.chosenItems.map(i => i.id));

    const removeItem = useCallback((id: ID) => () => {
        const itemIndex = props.chosenItems.findIndex(i => i.id == id);
        if (itemIndex > -1) {
            const newList = [...props.chosenItems];
            newList.splice(itemIndex, 1);
            props.onListChange(newList);
        }
    }, [props.chosenItems, props.onListChange]);

    const hideDialog = useCallback(() => {
        setModalVisible(false);
    }, []);

    const showDialog = useCallback(() => {
        Keyboard.dismiss();
        setModalVisible(true);
    }, []);

    const saveFromModal = useCallback(() => {
        const chosen = props.itemsToChoose.filter(i => modalIds.includes(i.id));
        hideDialog();
        props.onListChange(chosen);
    }, [props.itemsToChoose, props.onListChange, modalIds])

    const addIdFromModal = useCallback((id: ID) => () => {
        modalIds.push(id);
        setModalIds([...modalIds]);
    }, [modalIds]);

    const removeIdFromModal = useCallback((id: ID) => () => {
        const index = modalIds.findIndex(i => i == id);
        if (index > -1) {
            const newList = [...modalIds];
            newList.splice(index, 1);
            setModalIds(newList);
        }
    }, [modalIds]);

    useEffect(()=>{
        setModalIds(props.chosenItems.map(i=>i.id));
    },[props.chosenItems]);

    const renderItem = (item: ListRenderItemInfo<BaseItem>) => {
        const checked = modalIds.includes(item.item.id);
        const onPress = checked ? removeIdFromModal(item.item.id) : addIdFromModal(item.item.id);
        const status = checked ? 'checked' : 'unchecked';
        return <Checkbox.Item status={status} label={item.item.name} onPress={onPress} color={appTheme.colors.primary} uncheckedColor={appTheme.colors.primary}/>
    }

    return <>
        <View style={[style.container, props.style]}>
            <Chip icon={'plus'} onPress={showDialog} theme={{colors:{text: Colors.white}}} style={{backgroundColor:appTheme.colors.primary,marginTop:'2%',marginEnd:'2%'}}>{props.addAction}</Chip>
            {props.chosenItems.map(item => <Chip key={item.id} theme={{colors:{text: Colors.white}}} onClose={removeItem(item.id)} style={{backgroundColor: Colors.lightBlueA700,marginTop:'2%',marginEnd:'2%'}}>{item.name}</Chip>)}
        </View>
        <Portal>
            <Dialog visible={modalVisible} onDismiss={hideDialog}>
                <Dialog.ScrollArea>
                    <FlatList data={props.itemsToChoose} renderItem={renderItem}
                              keyExtractor={item => item.id.toString()}/>
                </Dialog.ScrollArea>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>Cancel</Button>
                    <Button onPress={saveFromModal}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    </>
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: "wrap",
        width: '80%',
    }
})

export default MultiChoose