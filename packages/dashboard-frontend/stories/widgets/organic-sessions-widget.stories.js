import { fn } from "@storybook/test";
import { ComparisonMetricsDataFormatter, OrganicSessionsWidget, RemoteDataProvider } from "../../src";
import { MockDataProvider } from "../../tests/__mocks__/data-provider";

const fetchMock = fn().mockResolvedValue( [] );

const dataProvider = new MockDataProvider();
const remoteDataProvider = new RemoteDataProvider( {}, fetchMock );
const dataFormatter = new ComparisonMetricsDataFormatter();

export default {
	title: "Widgets/Organic Sessions Widget",
	component: OrganicSessionsWidget,
	args: {
		dataProvider,
		remoteDataProvider,
		dataFormatter,
	},
};

export const Factory = {
	args: {},
};
