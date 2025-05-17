import { addons } from "@storybook/manager-api";
import { lowerCase, upperFirst } from "lodash";
import theme from "./theme";

addons.setConfig( {
	theme,
	sidebar: {
		renderLabel: ( { name } ) => ( upperFirst( lowerCase( name ) ) ),
	},
} );
