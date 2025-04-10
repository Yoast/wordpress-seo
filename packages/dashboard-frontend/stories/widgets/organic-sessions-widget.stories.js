import { ComparisonMetricsDataFormatter, OrganicSessionsWidget } from "../../src";
import { createRemoteDataProvider } from "./organic-sessions-widget/create-remote-data-provider";
import description from "./organic-sessions-widget/description.md";
import { getCompareData } from "./organic-sessions-widget/get-compare-data";
import { getDailyData } from "./organic-sessions-widget/get-daily-data";

export default {
	title: "Widgets/Organic Sessions widget",
	component: OrganicSessionsWidget,
	parameters: { docs: { description: { component: description } } },
	args: {
		dataProvider: {
			getLink: () => "https://example.com/error-support",
			getEndpoint: () => "https://example.com/time-based-seo-metrics",
		},
		remoteDataProvider: createRemoteDataProvider( getCompareData( 10, 9 ), getDailyData() ),
		dataFormatter: new ComparisonMetricsDataFormatter(),
	},
};

export const Factory = {
	tags: [ "!autodocs" ],
};

export const WithoutData = {
	args: {
		remoteDataProvider: createRemoteDataProvider( [], [] ),
	},
};

export const WithError = {
	args: {
		remoteDataProvider: createRemoteDataProvider( "Error", "Error" ),
	},
};

export const Loading = {
	args: {
		remoteDataProvider: {
			fetchJson: () => new Promise( () => {
				// Never resolve.
			} ),
		},
	},
};

export const WithoutCompareData = {
	args: {
		remoteDataProvider: createRemoteDataProvider( [], getDailyData() ),
	},
};

export const WithoutDailyData = {
	args: {
		remoteDataProvider: createRemoteDataProvider( getCompareData(), [] ),
	},
};

export const WithCompareError = {
	args: {
		remoteDataProvider: createRemoteDataProvider( "Error", getDailyData() ),
	},
};

export const WithDailyError = {
	args: {
		remoteDataProvider: createRemoteDataProvider( getCompareData(), "Error" ),
	},
};
