import { defaultsDeep } from "lodash";
import { DataProvider } from "../../src";

/**
 * Mock data provider.
 */
export class MockDataProvider extends DataProvider {
	/**
	 * Creates an instance of MockDataProvider.
	 *
	 * @param {Object} [options] The options to initialize the data provider. See {@link DataProvider}.
	 */
	constructor( options = {} ) {
		super( defaultsDeep( options, {
			contentTypes: [
				{
					name: "post",
					label: "Posts",
					taxonomy: {
						name: "category",
						label: "Categories",
						links: {
							search: "https://example.com/categories",
						},
					},
				},
				{
					name: "page",
					label: "Pages",
					taxonomy: null,
				},
				{
					name: "product",
					label: "Products",
					taxonomy: {
						name: "product_cat",
						label: "Product categories",
						links: {
							search: "https://example.com/product_cat",
						},
					},
				},
			],
			userName: "Foo",
			features: {
				indexables: true,
				seoAnalysis: true,
				readabilityAnalysis: true,
			},
			endpoints: {
				seoScores: "https://example.com/seo-scores",
				readabilityScores: "https://example.com/readability-scores",
				topPages: "https://example.com/top-pages",
				timeBasedSeoMetrics: "https://example.com/time-based-seo-metrics",
			},
			headers: {
				"X-Wp-Nonce": "123",
			},
			links: {
				dashboardLearnMore: "https://example.com/dashboard-learn-more",
				errorSupport: "https://example.com/error-support",
			},
		} ) );
	}
}

