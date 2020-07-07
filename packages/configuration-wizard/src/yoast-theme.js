/* External dependencies */
import getMuiTheme from "material-ui/styles/getMuiTheme";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

const colorPrimary = window.getComputedStyle(document.documentElement).getPropertyValue("--color-primary");

/**
 * Custom colors palette.
 */
const muiTheme = getMuiTheme( {
	palette: {
		primary1Color: colors.$color_pink_dark,
	},
	stepper: {
		iconColor: colorPrimary,
	},
} );

export default muiTheme;
