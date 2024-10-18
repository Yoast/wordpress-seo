import { addons } from "@storybook/addons";
import theme from "./theme";
import { lowerCase, upperFirst } from "lodash";

addons.setConfig( {
	theme,
	sidebar: {
		renderLabel: ( { name } ) => ( upperFirst( lowerCase( name ) ) ),
	},
} );
