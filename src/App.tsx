import React from 'react';
import {
    SafeAreaView,
    StatusBar,
} from 'react-native';
import {Provider} from "react-redux";
import store from "./redux"
import {Appbar, Provider as PaperProvider } from 'react-native-paper';
import RouterComponent from "./Router";
import appTheme from "./theme/appTheme";

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <Provider store={store}>
                <PaperProvider theme={appTheme}>
                <SafeAreaView style={{flex:1}}>
                <Appbar>
                    <Appbar.Action
                        icon="archive"
                        onPress={() => console.log('Pressed archive')}
                    />
                    <Appbar.Action icon="mail" onPress={() => console.log('Pressed mail')} />
                    <Appbar.Action icon="label" onPress={() => console.log('Pressed label')} />
                    <Appbar.Action
                        icon="delete"
                        onPress={() => console.log('Pressed delete')}
                    />
                </Appbar>
                <RouterComponent/>
                </SafeAreaView>
                </PaperProvider>
            </Provider>
        </>
    );
};

export default App;
