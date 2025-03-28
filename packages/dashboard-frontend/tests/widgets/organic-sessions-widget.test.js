import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { ComparisonMetricsDataFormatter } from "../../src/services/comparison-metrics-data-formatter";
import { OrganicSessionsWidget } from "../../src/widgets/organic-sessions-widget";
import { render, waitFor } from "../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

describe( "OrganicSessionsWidget", () => {
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

	it( "should render with heading", async() => {
		const { getByRole } = render( <OrganicSessionsWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			expect( getByRole( "heading", { name: "Organic sessions" } ) ).toBeInTheDocument();
		} );
	} );

	it( "should render with info button with tooltip with link", async() => {
		const { getByRole, getByText } = render( <OrganicSessionsWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		// Suppress "not wrapped in act" warning due to fetch.
		// Even though the tooltip is already there, regardless of the fetch.
		await waitFor( () => {
		} );

		const tooltip = getByRole( "tooltip" );
		const tooltipMessage = getByText( "The number of organic sessions that began on your website." );
		const tooltipDataSource = getByText( "Site Kit by Google" );
		expect( tooltip ).toBeInTheDocument();
		expect( tooltipMessage ).toBeInTheDocument();
		expect( tooltipDataSource ).toBeInTheDocument();
	} );

	it( "should render without data", async() => {
		remoteDataProvider.fetchJson.mockResolvedValue( [] );
		const { getAllByText } = render( <OrganicSessionsWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			expect( getAllByText( "No data to display: Your site hasn't received any visitors yet." ) ).toHaveLength( 1 );
		} );
	} );

	it( "should render without error", async() => {
		const error = new Error( "Network Error" );
		error.status = 500;
		remoteDataProvider.fetchJson.mockRejectedValue( error );
		const { getByRole } = render( <OrganicSessionsWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			expect( getByRole( "status" ) )
				.toHaveTextContent( "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page." );
			expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "https://example.com/error-support" );
		} );
	} );
} );
