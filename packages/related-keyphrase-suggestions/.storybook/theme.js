/* eslint-disable import/named */
import { create } from "@storybook/theming";
import tailwindConfig from "../tailwind.config";

const theme = tailwindConfig.presets[ 0 ].theme;

export default create( {
	base: "light",
	brandTitle: "Yoast related keyphrase suggestions",
	brandUrl: "https://yoast.com",
	brandImage: "https://yoast.com/app/uploads/2021/01/yoast_logo_rgb_optm.svg",

	colorPrimary: theme.extend.colors.primary[ 500 ],
	colorSecondary: theme.extend.colors.primary[ 500 ],

	// UI
	appBg: "#f4f1f4",
	appContentBg: "#ffffff",
	barSelectedColor: theme.extend.colors.primary[ 500 ],
} );
