import { OrganicSessionsWidget } from "../../../src/dashboard/widgets/organic-sessions-widget";
import { render, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";
import { DataFormatter } from "../../../src/dashboard/services/data-formatter";
import { expect } from "@jest/globals";

describe( "OrganicSessionsWidget", () => {
	let dataProvider;
	let remoteDataProvider;
	let dataFormatter;
	beforeAll( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider = new MockRemoteDataProvider( {} );
		dataFormatter = new DataFormatter();
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
		const { getByRole, getByText, debug } = render( <OrganicSessionsWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			const tooltip = getByRole( "tooltip" );
			const tooltipMessage = getByText( "The number of organic sessions on your website." );
			const link = getByRole("link");
			// console.log( tooltipMessage );
			debug( link );
			expect( tooltip ).toBeInTheDocument();
			expect( tooltipMessage ).toBeInTheDocument();
			// expect( getByText( "The number of organic sessions on your website." ) ).toBeInTheDocument();

			// const link = getByRole( "link", { name: "Learn more" } );
			// expect( link ).toBeInTheDocument();
			// expect( link ).toHaveAttribute( "href", "https://example.com/organic-sessions-learn-more" );
			// expect( link ).toHaveAttribute( "rel", "noopener" );
			// expect( link ).toHaveAttribute( "target", "_blank" );

			// const svg = link.querySelector( "svg" );
			// expect( svg ).toBeInTheDocument();
			// expect( svg ).toHaveAttribute( "aria-hidden", "true" );
			// expect( svg ).toHaveAttribute( "class", "yst-w-4 yst-h-4 rtl:yst-rotate-180" );
		} );
	} );
	it( "should render without data", async() => {
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
	test.skip( "should render with data", async() => {
		const dailyData = [ {
			date: "20250130",
			sessions: 0,
		},
		{
			date: "20250131",
			sessions: 0,
		},
		{
			date: "20250201",
			sessions: 0,
		},
		{
			date: "20250202",
			sessions: 0,
		},
		{
			date: "20250203",
			sessions: 0,
		},
		{
			date: "20250204",
			sessions: 0,
		},
		{
			date: "20250205",
			sessions: 0,
		},
		{
			date: "20250206",
			sessions: 0,
		},
		{
			date: "20250207",
			sessions: 2,
		},
		{
			date: "20250208",
			sessions: 0,
		},
		{
			date: "20250209",
			sessions: 1,
		},
		{
			date: "20250210",
			sessions: 1,
		},
		{
			date: "20250211",
			sessions: 0,
		},
		{
			date: "20250212",
			sessions: 0,
		},
		{
			date: "20250213",
			sessions: 0,
		},
		{
			date: "20250214",
			sessions: 1,
		},
		{
			date: "20250215",
			sessions: 0,
		},
		{
			date: "20250216",
			sessions: 0,
		},
		{
			date: "20250217",
			sessions: 1,
		},
		{
			date: "20250218",
			sessions: 1,
		},
		{
			date: "20250219",
			sessions: 1,
		},
		{
			date: "20250220",
			sessions: 2,
		},
		{
			date: "20250221",
			sessions: 0,
		},
		{
			date: "20250222",
			sessions: 0,
		},
		{
			date: "20250223",
			sessions: 0,
		},
		{
			date: "20250224",
			sessions: 0,
		},
		{
			date: "20250225",
			sessions: 1,
		},
		{
			date: "20250226",
			sessions: 0,
		},
		];
		const changeData = [ { current: { sessions: 11 }, previous: { sessions: 3 } } ];
		remoteDataProvider.fetchJson.mockResolvedValueOnce( dailyData ).mockResolvedValueOnce( changeData );
		const { getByText, debug } = render( <OrganicSessionsWidget

			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );
		await waitFor( () => {
			debug();
			// expect( getByText( "100" ) ).toBeInTheDocument();
		} );
	} );
} );
