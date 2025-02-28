import { OrganicSessionsWidget } from "../../../src/dashboard/widgets/organic-sessions-widget";
import { render, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";
import { DataFormatter } from "../../../src/dashboard/services/data-formatter";
import { expect, test } from "@jest/globals";

describe( "OrganicSessionsWidget", () => {
	let dataProvider;
	let remoteDataProvider;
	let dataFormatter;
	beforeAll( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider = new MockRemoteDataProvider( {} );
		dataFormatter = new DataFormatter();
	} );
	beforeEach( () => {
		remoteDataProvider.fetchJson.mockClear();
	} );
	test( "should render with heading", async() => {
		const { getByRole } = render( <OrganicSessionsWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			expect( getByRole( "heading", { name: "Organic sessions" } ) ).toBeInTheDocument();
		} );
	} );
	test( "should render with info button with tooltip with link", () => {
		const { getByRole, getByText } = render( <OrganicSessionsWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		const tooltip = getByRole( "tooltip" );
		const tooltipMessage = getByText( "The number of organic sessions on your website." );
		expect( tooltip ).toBeInTheDocument();
		expect( tooltipMessage ).toBeInTheDocument();

		const link = getByText( "Learn more" );
		expect( link ).toBeInTheDocument();
		expect( link ).toHaveAttribute( "href", "https://example.com/organic-sessions-learn-more" );
		expect( link ).toHaveAttribute( "rel", "noopener" );
		expect( link ).toHaveAttribute( "target", "_blank" );
	} );
	test( "should render without data", async() => {
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

	test( "should render without error", async() => {
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
