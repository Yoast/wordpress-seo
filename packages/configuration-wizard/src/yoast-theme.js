/* External dependencies */
import getMuiTheme from "material-ui/styles/getMuiTheme";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/**
 * Custom colors palette.
 */
const muiTheme = getMuiTheme( {
	palette: {
		primary1Color: colors.$color_pink_dark,
	},
	stepper: {
		iconColor: colors.$color_green_medium,
	},
} );

export default muiTheme;
