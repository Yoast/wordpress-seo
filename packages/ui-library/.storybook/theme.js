import { create } from "@storybook/theming";
import theme from "../src/theme";

export default create( {
	base: "light",
	brandTitle: "Yoast Storybook",
	brandUrl: "https://yoast.com",
	brandImage: "https://yoast.com/app/uploads/2021/01/yoast_logo_rgb_optm.svg",

	colorPrimary: theme.colors.primary[ 500 ],
	colorSecondary: theme.colors.primary[ 500 ],

	// UI
	appBg: "#f4f1f4",
	appContentBg: "#ffffff",
	// appBorderColor: "grey",
	// appBorderRadius: 4,

	// Typography
	// fontBase: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif",
	// fontCode: "monospace",

	// Text colors
	// textColor: "black",
	// textInverseColor: "rgba(255,255,255,0.9)",

	// Toolbar default and active colors
	// barTextColor: "silver",
	barSelectedColor: theme.colors.primary[ 500 ],
	// barBg: "hotpink",

	// Form colors
	// inputBg: "white",
	// inputBorder: "silver",
	// inputTextColor: "black",
	// inputBorderRadius: 4,
} );