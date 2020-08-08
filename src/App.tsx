import React from 'react';
import {
    SafeAreaView,
    StatusBar,
} from 'react-native';
import {Provider} from "react-redux";
import store from "./redux"
import { Provider as PaperProvider} from 'react-native-paper';
import RouterComponent from "./Router";
import appTheme from "./theme/appTheme";
import MyAppBar from "./components/AppBar";

const App = () => {
    return (
        <>
            <StatusBar barStyle="dark-content"/>
            <Provider store={store}>
                <PaperProvider theme={appTheme}>
                    <SafeAreaView style={{flex: 1}}>
                        <MyAppBar/>
                        <RouterComponent/>
                    </SafeAreaView>
                </PaperProvider>
            </Provider>
        </>
    );
};

export default App;
