import getMuiTheme from "material-ui/styles/getMuiTheme";
import colors from "../../../style-guide/colors.json";

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
