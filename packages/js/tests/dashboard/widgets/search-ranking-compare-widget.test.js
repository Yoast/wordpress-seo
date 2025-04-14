import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { ComparisonMetricsDataFormatter } from "../../../src/dashboard/services/comparison-metrics-data-formatter";
import { SearchRankingCompareWidget } from "../../../src/dashboard/widgets/search-ranking-compare-widget";
import { render, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

describe( "SearchRankingCompareWidget", () => {
	let dataProvider;
	let remoteDataProvider;
	let dataFormatter;
	beforeAll( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider = new MockRemoteDataProvider( {} );
		dataFormatter = new ComparisonMetricsDataFormatter();
	} );
	beforeEach( () => {
		remoteDataProvider.fetchJson.mockClear();
	} );

	describe.each( [
		[
			"with all data points",
			[
				{
					/* eslint-disable camelcase */
					current: {
						total_clicks: 6,
						total_impressions: 59,
						average_ctr: 0.10169491525423729,
						average_position: 36.288135593220325,
					},
					previous: {
						total_clicks: 9,
						total_impressions: 51,
						average_ctr: 0.17647058823529413,
						average_position: 34.450980392156858,
					},
					/* eslint-enable camelcase */
				},
			],
			[
				[ "Impressions", "59", "+15.69%" ],
				[ "Clicks", "6", "-33.33%" ],
				[ "Average CTR", "10.17%", "-42.37%" ],
				[ "Average position", "36.29", "+5.33%" ],
			],
		],
		[
			"without averages",
			[
				{
					/* eslint-disable camelcase */
					current: {
						total_clicks: 10,
						total_impressions: 75,
					},
					previous: {
						total_clicks: 8,
						total_impressions: 100,
					},
					/* eslint-enable camelcase */
				},
			],
			[
				[ "Impressions", "75", "-25.00%" ],
				[ "Clicks", "10", "+25.00%" ],
				[ "Average CTR", "", "" ],
				[ "Average position", "", "" ],
			],
		],
	] )( "%s", ( _, data, metricTests ) => {
		let renderResult;

		beforeAll( () => {
			remoteDataProvider.fetchJson.mockResolvedValue( data );
		} );
		beforeEach( async() => {
			renderResult = render( <SearchRankingCompareWidget
				dataProvider={ dataProvider }
				remoteDataProvider={ remoteDataProvider }
				dataFormatter={ dataFormatter }
			/> );
			await waitFor( () => {
				expect( remoteDataProvider.fetchJson ).toHaveBeenCalled();
			} );
		} );

		it( "should render 4 tooltips", async() => {
			expect( renderResult.getAllByRole( "tooltip" ) ).toHaveLength( 4 );

			// Tested here because it is not unique to each tooltip.
			expect( renderResult.getAllByText( "Data provided by:" ) ).toHaveLength( 4 );
			expect( renderResult.getAllByText( "Site Kit by Google" ) ).toHaveLength( 4 );
		} );

		test.each( [
			[ "Impressions", "The number of times your website appeared in the Google search results over the last 28 days." ],
			[ "Clicks", "The number of times users clicked on your website's link in the Google search results over the last 28 days." ],
			[ "Average CTR", "The average click-through-rate for your website in the Google search results over the last 28 days." ],
			[ "Average position", "The average position of your website in the Google search results over the last 28 days." ],
		] )( "should render the tooltip for: %s", async( __, tooltip ) => {
			expect( renderResult.getByText( tooltip ) ).toBeInTheDocument();
		} );

		test.each( metricTests )( "should render metric: %s", async( name, value, trend ) => {
			expect( renderResult.getByText( name ) ).toBeInTheDocument();
			if ( value ) {
				expect( renderResult.getByText( value ) ).toBeInTheDocument();
			}
			if ( trend ) {
				expect( renderResult.getByText( trend ) ).toBeInTheDocument();
			}
		} );
	} );

	it( "should show no data message and title without data", async() => {
		remoteDataProvider.fetchJson.mockResolvedValueOnce( [] );
		const { getByRole, getByText } = render( <SearchRankingCompareWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			expect( getByRole( "heading", { name: "Impressions, Clicks, Site CTR, Average position" } ) ).toBeInTheDocument();
		} );
		expect( getByText( "No data to display: Your site hasn't received any visitors yet." ) ).toBeInTheDocument();
	} );

	it( "should show alert message and title on error", async() => {
		const error = new Error( "Network Error" );
		error.status = 500;
		remoteDataProvider.fetchJson.mockRejectedValueOnce( error );
		const { getByRole } = render( <SearchRankingCompareWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			expect( getByRole( "heading", { name: "Impressions, Clicks, Site CTR, Average position" } ) ).toBeInTheDocument();
		} );
		expect( getByRole( "status" ) )
			.toHaveTextContent( "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page." );
		expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "https://example.com/error-support" );
	} );

	it( "should show loading state while the request is not finished", async() => {
		remoteDataProvider.fetchJson.mockImplementation( () => new Promise( () => {
		} ) );
		const { getAllByText } = render( <SearchRankingCompareWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			expect( remoteDataProvider.fetchJson ).toHaveBeenCalled();
		} );
		const loaders = getAllByText( "Dummy" );
		expect( loaders ).toHaveLength( 4 );
		expect( loaders[ 0 ].parentElement.classList ).toContain( "yst-skeleton-loader" );
	} );
} );
