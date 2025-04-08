import { ComparisonMetricsDataFormatter, OrganicSessionsWidget } from "../../src";
import compareData from "./organic-sessions-widget/compare.json";
import dailyData from "./organic-sessions-widget/daily.json";
import defaultDoc from "./organic-sessions-widget/default.md";

const WIDGET = {
	compare: "organicSessionsCompare",
	daily: "organicSessionsDaily",
};
const DATA = {
	compare: compareData,
	daily: dailyData,
};

const dataProvider = {
	getLink: () => "https://example.com/error-support",
	getEndpoint: () => "https://example.com/time-based-seo-metrics",
};
const remoteDataProvider = {
	fetchJson: ( _, params ) => {
		if ( params.options.widget === WIDGET.compare ) {
			return Promise.resolve( DATA.compare );
		}
		return Promise.resolve( DATA.daily );
	},
};
const dataFormatter = new ComparisonMetricsDataFormatter();

export default {
	title: "Widgets/Organic Sessions widget",
	component: OrganicSessionsWidget,
	parameters: {
		docs: {
			description: {
				component: defaultDoc,
			},
			story: {
				autoplay: true,
			},
		},
	},
	args: {
		dataProvider,
		remoteDataProvider,
		dataFormatter,
	},
};

export const Factory = {
	tags: [ "!autodocs" ],
};

export const WithoutData = {
	title: "Without data",
	args: {
		remoteDataProvider: {
			fetchJson: () => Promise.resolve( [] ),
		},
	},
};

export const WithError = {
	title: "With error",
	args: {
		remoteDataProvider: {
			fetchJson: () => Promise.reject( new Error( "Error" ) ),
		},
	},
};

export const Loading = {
	title: "Loading",
	args: {
		remoteDataProvider: {
			fetchJson: () => new Promise( () => {
				// Never resolve.
			} ),
		},
	},
};

export const WithoutCompareData = {
	title: "Without compare data",
	args: {
		remoteDataProvider: {
			fetchJson: ( _, params ) => {
				if ( params.options.widget === WIDGET.compare ) {
					return Promise.resolve( [] );
				}
				return Promise.resolve( DATA.daily );
			},
		},
	},
};

export const WithoutDailyData = {
	title: "Without daily data",
	args: {
		remoteDataProvider: {
			fetchJson: ( _, params ) => {
				if ( params.options.widget === WIDGET.daily ) {
					return Promise.resolve( [] );
				}
				return Promise.resolve( DATA.compare );
			},
		},
	},
};

export const WithCompareError = {
	title: "With compare error",
	args: {
		remoteDataProvider: {
			fetchJson: ( _, params ) => {
				if ( params.options.widget === WIDGET.compare ) {
					return Promise.reject( new Error( "Error" ) );
				}
				return Promise.resolve( DATA.daily );
			},
		},
	},
};

export const WithDailyError = {
	title: "With daily error",
	args: {
		remoteDataProvider: {
			fetchJson: ( _, params ) => {
				if ( params.options.widget === WIDGET.daily ) {
					return Promise.reject( new Error( "Error" ) );
				}
				return Promise.resolve( DATA.compare );
			},
		},
	},
};
