/* eslint-disable import/no-unresolved --
 * The tests are currently disabled and these packages are not installed.
 * We'll resolve this when fixing and re-enabling the tests.
 */
import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import path from "path";

initStoryshots( {
	suite: "> Image snapshot tests",
	test: imageSnapshot( {
		storybookUrl: `file://${ path.resolve( __dirname, "../storybook-static" ) }`,
		getMatchOptions: () => ( {
			failureThreshold: 1,
			failureThresholdType: "percent",
		} ),
	} ),
} );
