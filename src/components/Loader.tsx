import React, {FunctionComponent} from "react";
import {StyleSheet, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";

interface Props{
    color?:string,
    isVisible: boolean
}

const Loader: FunctionComponent<Props> = (props) => {
    if(props.isVisible){
        return <View style={styles.container}>
            <ActivityIndicator size={'large'} color={props.color} animating={true}/>
        </View>
    }
    return <View/>
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Loader


