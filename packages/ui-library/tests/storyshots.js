// eslint-disable-next-line import/no-unresolved
import initStoryshots from "@storybook/addon-storyshots";
// eslint-disable-next-line import/no-unresolved
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
