import getMuiTheme from "material-ui/styles/getMuiTheme";
import { colors } from "yoast-components";

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
