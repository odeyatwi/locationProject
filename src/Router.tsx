import React from "react";
import {Router, Scene, Stack} from "react-native-router-flux";
import CategoriesScreen from "./screens/Category/CategoriesScreen";


const RouterComponent: React.FunctionComponent =()=>{
    return <Router>
        <Stack key="root">
            <Scene key="login" component={CategoriesScreen} initial hideNavBar />
        </Stack>
    </Router>
}

export default RouterComponent
