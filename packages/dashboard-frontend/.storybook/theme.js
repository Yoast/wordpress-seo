import { create } from "@storybook/theming";
import colors from "tailwindcss/colors";
import tailwindConfig from "../tailwind.config";

const theme = tailwindConfig.presets[ 0 ].theme;

/** @type { import("@storybook/react").Preview } */
export default create( {
	base: "light",
	brandTitle: "Yoast dashboard frontend",
	brandUrl: "https://yoast.com",
	brandImage: "https://yoast.com/app/uploads/2021/01/yoast_logo_rgb_optm.svg",

	colorPrimary: theme.extend.colors.primary[ 500 ],
	colorSecondary: theme.extend.colors.primary[ 500 ],

	appBg: colors.slate[ "100" ],
	appContentBg: colors.neutral[ "50" ],

	barSelectedColor: theme.extend.colors.primary[ 500 ],
} );
