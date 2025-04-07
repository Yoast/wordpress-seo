import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { forEach } from "lodash";
import { PlainMetricsDataFormatter } from "../../../src/dashboard/services/plain-metrics-data-formatter";
import { createTopQueriesFormatter, TopQueriesWidget } from "../../../src/dashboard/widgets/top-queries-widget";
import { render, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

describe( "TopQueriesWidget", () => {
	const data = [
		{ subject: "Cats", clicks: 100, impressions: 1000, ctr: 10, position: 1 },
		{ subject: "Dogs", clicks: 101, impressions: 1001, ctr: 11, position: 2 },
		{ subject: "Eagles", clicks: 102, impressions: 1002, ctr: 12, position: 3 },
		{ subject: "Fish", clicks: 103, impressions: 1003, ctr: 13, position: 4 },
		{ subject: "Gerbils", clicks: 104, impressions: 1004, ctr: 14, position: 5 },
	];
	let dataProvider;
	let remoteDataProvider;
	let dataFormatter;
	let formatter;
	let formattedData;

	beforeAll( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider = new MockRemoteDataProvider( {} );
		dataFormatter = new PlainMetricsDataFormatter();
		formatter = createTopQueriesFormatter( dataFormatter );
		formattedData = formatter( data );
	} );

	beforeEach( () => {
		remoteDataProvider.fetchJson.mockClear();
	} );

	it( "should render the component", async() => {
		remoteDataProvider.fetchJson.mockResolvedValue( data );
		const { getByRole, getByText } = render( <TopQueriesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		// Verify the title is present.
		await waitFor( () => {
			expect( getByRole( "heading", { name: "Top 5 search queries" } ) ).toBeInTheDocument();
		} );

		// Verify the table is present.
		expect( getByRole( "table" ) ).toBeInTheDocument();
		// Verify rows are present.
		forEach( formattedData, ( { subject, clicks, impressions, ctr, position } ) => {
			expect( getByText( subject ) ).toBeInTheDocument();
			expect( getByText( clicks ) ).toBeInTheDocument();
			expect( getByText( impressions ) ).toBeInTheDocument();
			expect( getByText( ctr ) ).toBeInTheDocument();
			expect( getByText( position ) ).toBeInTheDocument();
		} );
	} );

	it( "should render the component without data", async() => {
		remoteDataProvider.fetchJson.mockResolvedValue( [] );
		const { getByText } = render( <TopQueriesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		// Verify no data message is present.
		await waitFor( () => {
			expect( getByText( "No data to display: Your site hasn't received any visitors yet." ) ).toBeInTheDocument();
		} );
	} );

	it.each( [
		{
			status: 408,
			name: "Unauthorized",
			message: "The request timed out. Try refreshing the page. If the problem persists, please check our Support page.",
		},
		{
			status: 400,
			name: "TimeoutError",
			message: "The request timed out. Try refreshing the page. If the problem persists, please check our Support page.",
		},
		{
			status: 403,
			name: "Forbidden",
			message: "You don’t have permission to access this resource. Please contact your admin for access. In case you need further help, please check our Support page.",
		},
		{
			status: 500,
			name: "Bad Request",
			message: "Something went wrong. Try refreshing the page. If the problem persists, please check our Support page.",
		},
	] )( "should render the message for an error with status $status and error name $name.", async( { status, name, message } ) => {
		const error = new Error( name );
		error.status = status;
		error.name = name;
		remoteDataProvider.fetchJson.mockRejectedValue( error );
		const { getByRole } = render( <TopQueriesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		await waitFor( () => {
			expect( getByRole( "status" ) )
				.toHaveTextContent( message );
			expect( getByRole( "link", { name: "Support page" } ) ).toHaveAttribute( "href", "https://example.com/error-support" );
		} );
	} );

	it( "should render the component with a pending state", async() => {
		// Never resolving promise to ensure it keeps loading.
		remoteDataProvider.fetchJson.mockImplementation( () => new Promise( () => {
		} ) );
		const { getByRole, container } = render( <TopQueriesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
			limit={ 1 }
		/> );

		// Verify the skeleton loader is present.
		await waitFor( () => {
			expect( getByRole( "table" ) ).toBeInTheDocument();
		} );

		// Expect limit (1) row with 5 columns = 5 skeleton loaders.
		expect( container.getElementsByClassName( "yst-skeleton-loader" ).length ).toBe( 5 );
	} );
} );
