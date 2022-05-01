import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";

/*
 * Some tests are allowed an increased failure threshold,
 * i.e. if they contain animated elements: they are obviously
 * allowed to change slightly over test runs.
 */
const failureThresholds = {
	"1-elements-button--states": 0.01,
};

const beforeScreenshot = async ( page ) => {
	console.log( "Setting viewport to 1366 x 768px" );
	return page.setViewport( { width: 1366, height: 768 } );
};

initStoryshots( {
	suite: "> Image snapshot tests",
	test: imageSnapshot( {
		storybookUrl: `file://${ path.resolve( __dirname, "../storybook-static" ) }`,
		getMatchOptions: ( { context } ) => ( {
			beforeScreenshot,
			failureThreshold: failureThresholds[ context.id ] || 0,
			failureThresholdType: "percent",
		} ),
	} ),
} );
