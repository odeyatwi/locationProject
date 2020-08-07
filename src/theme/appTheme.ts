import {Colors, configureFonts, DefaultTheme} from 'react-native-paper';
import {Fonts} from "react-native-paper/lib/typescript/src/types";

const fontConfig: {default: Fonts} = {
    default: {
        regular: {
            fontFamily: 'RobotoCondensed-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'RobotoCondensed-Bold',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'RobotoCondensed-light',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'RobotoCondensed-light',
            fontWeight: 'normal',
        },
    },
};

export default {
    ...DefaultTheme,
    colors:{
        ...DefaultTheme.colors,
        primary: Colors.lightBlue900,
        accent: Colors.blue50
    },
    fonts: configureFonts(fontConfig),
};


