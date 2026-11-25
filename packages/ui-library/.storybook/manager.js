import { addons } from "@storybook/manager-api";
import theme from "./theme";
import { lowerCase, upperFirst } from "lodash";

addons.setConfig( {
	theme,
	sidebar: {
		renderLabel: ( { name } ) => ( upperFirst( lowerCase( name ) ) ),
	},
} );
