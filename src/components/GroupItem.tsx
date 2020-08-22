import React, {FunctionComponent} from "react";
import {Card, Colors, IconButton, List} from "react-native-paper";
import {StyleSheet} from "react-native";

interface Props {
    title: string;
}

interface ItemProps {
    title: string;
    isSelected: boolean;
    onPress: () => void;
    onPressRight: () => void;
    isLast: boolean
}

const GroupItem: FunctionComponent<Props> = (props) => {
    return <Card style={[styles.card]}
    >
        <Card.Title title={props.title}/>
        <Card.Content>{props.children}</Card.Content>
    </Card>

}

export const Item: FunctionComponent<ItemProps> = (props) => {
    return <List.Item
        title={props.title}
        onPress={props.onPress}
        style={[!props.isLast && {borderBottomColor: Colors.blueGrey600, borderBottomWidth: 1},props.isSelected && { backgroundColor: Colors.blueGrey600}]}
        titleStyle={[props.isSelected && {color: Colors.white}]}
        right={(iconProps) =>
            <IconButton {...iconProps}
                        onPress={props.onPressRight} icon={'map-marker'}
                        color={props.isSelected ? Colors.blueGrey600 : Colors.black}
                        style={[props.isSelected && {backgroundColor: Colors.white}]}/>}
    />
}

const styles = StyleSheet.create({
    card: {
        width: '95%',
        alignSelf: 'center',
        marginVertical: 10,
    },
    divider : {
        height: 1,
        width:'90%',
        alignSelf: 'center',
        backgroundColor: 'grey'
    }
})
export default GroupItem
