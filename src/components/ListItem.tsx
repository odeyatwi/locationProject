import React, {FunctionComponent} from "react";
import {Card, Avatar, Colors, IconButton} from "react-native-paper";
import {StyleSheet} from "react-native";
import appTheme from "../theme/appTheme";

interface Props {
    onPress: () => void;
    isSelected: boolean;
    title: string;
    right?: string;
    rightPress?: () => void;
}

const ListItem: FunctionComponent<Props> = (props) => {
    return <Card style={[styles.card, props.isSelected && {backgroundColor: Colors.blueGrey600}]}
                 onPress={props.onPress}
    >
        <Card.Title
            title={props.title}
            titleStyle={[props.isSelected && {color: Colors.white}]}
            left={(iconProps) =>
                <Avatar.Text {...iconProps} label={props.title.substr(0, 2).toUpperCase()}
                             color={props.isSelected ? Colors.blueGrey600 : Colors.white}
                             style={[props.isSelected && {backgroundColor: Colors.white}]}/>
            }
            right={props.right ? (iconProps) =>
                <IconButton {...iconProps}
                            onPress={props.rightPress} icon={props.right!}
                            color={props.isSelected ? Colors.blueGrey600 : appTheme.colors.primary}
                            style={[props.isSelected && {backgroundColor: Colors.white}]}
                /> : undefined}
        />
    </Card>

}

const styles = StyleSheet.create({
    card: {
        width: '95%',
        alignSelf: 'center',
        marginVertical: 10,
    }
})

export default ListItem
