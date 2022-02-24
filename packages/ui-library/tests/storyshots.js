/* eslint-disable capitalized-comments */
import path from "path";
import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";

// Some tests are allowed an increased failure threshold,
// ie. if they contain animated elements: they are obviously
// allowed to change slighty over test runs.
const failureThresholds = {
	"1-elements-button--states": 0.01,
};

initStoryshots( {
	suite: "> Image snapshot tests",
	test: imageSnapshot( {
		storybookUrl: `file://${ path.resolve( __dirname, "../storybook-static" ) }`,
		getMatchOptions: ( { context } ) => ( {
			failureThreshold: failureThresholds[ context.id ] || 0,
			failureThresholdType: "percent",
		} ),
	} ),
} );
