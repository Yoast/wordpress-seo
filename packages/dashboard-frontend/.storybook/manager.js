import { addons } from "@storybook/manager-api";
import { startCase } from "lodash";
import theme from "./theme";

addons.setConfig( {
	theme,
	sidebar: {
		renderLabel: ( { name } ) => startCase( name ),
	},
} );
