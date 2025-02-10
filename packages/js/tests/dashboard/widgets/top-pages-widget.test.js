import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { forEach } from "lodash";
import { SCORE_META } from "../../../src/dashboard/scores/score-meta";
import { DataFormatter } from "../../../src/dashboard/services/data-formatter";
import { createTopPageFormatter, TopPagesWidget } from "../../../src/dashboard/widgets/top-pages-widget";
import { render, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

const data = [
	{ subject: "https://example.com/page-1", clicks: 100, impressions: 1000, ctr: 10, position: 1, seoScore: "ok" },
	{ subject: "https://example.com/page-2", clicks: 101, impressions: 1001, ctr: 11, position: 2, seoScore: "good" },
	{ subject: "https://example.com/page-3", clicks: 102, impressions: 1002, ctr: 12, position: 3, seoScore: "bad" },
	{ subject: "https://example.com/page-4", clicks: 103, impressions: 1003, ctr: 13, position: 4, seoScore: "notAnalyzed", links: { edit: "https://example.com/page-4/edit" } },
];

describe( "TopPagesWidget", () => {
	const data = [
		{ subject: "https://example.com/page-1", clicks: 100, impressions: 1000, ctr: 10, position: 1, seoScore: "ok" },
		{ subject: "https://example.com/page-2", clicks: 101, impressions: 1001, ctr: 11, position: 2, seoScore: "good" },
		{ subject: "https://example.com/page-3", clicks: 102, impressions: 1002, ctr: 12, position: 3, seoScore: "bad" },
		{ subject: "https://example.com/page-4", clicks: 103, impressions: 1003, ctr: 13, position: 4, seoScore: "notAnalyzed" },
	];
	let dataProvider;
	let remoteDataProvider;
	let dataFormatter;
	let formatter;
	let formattedData;

	beforeAll( () => {
		dataProvider = new MockDataProvider();
		remoteDataProvider = new MockRemoteDataProvider( {} );
		dataFormatter = new DataFormatter();
		formatter = createTopPageFormatter( dataFormatter );
		formattedData = formatter( data );
	} );

	beforeEach( () => {
		remoteDataProvider.fetchJson.mockClear();
	} );

	it( "should render the TopPagesWidget component", async() => {
		remoteDataProvider.fetchJson.mockResolvedValue( data );
		const { getByRole, getByText, getAllByRole } = render( <TopPagesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		// Verify the title is present.
		await waitFor( () => {
			expect( getByRole( "heading", { name: "Top 5 most popular content" } ) ).toBeInTheDocument();
		} );

		// Verify the table is present.
		expect( getByRole( "table" ) ).toBeInTheDocument();
		// Verify rows are present.
		forEach( formattedData, ( { subject, clicks, impressions, ctr, position, seoScore } ) => {
			expect( getByText( subject ) ).toBeInTheDocument();
			expect( getByText( clicks ) ).toBeInTheDocument();
			expect( getByText( impressions ) ).toBeInTheDocument();
			expect( getByText( ctr ) ).toBeInTheDocument();
			expect( getByText( position ) ).toBeInTheDocument();
			expect( getByText( SCORE_META[ seoScore ].label ) ).toBeInTheDocument();
		} );

		const editButtons = getAllByRole( "link", { name: "Edit" } );
		expect( editButtons ).toHaveLength( 4 );

		// Check last edit button.
		const lastEditButton = editButtons[ 3 ];
		expect( lastEditButton ).toHaveAttribute( "href", "https://example.com/page-4/edit" );
		expect( lastEditButton ).toHaveAttribute( "aria-disabled", "false" );

		const firstEditButton = editButtons[ 0 ];
		expect( firstEditButton ).not.toHaveAttribute( "href" );
		expect( firstEditButton ).toHaveAttribute( "disabled" );
		expect( firstEditButton ).toHaveAttribute( "aria-disabled", "true" );
	} );

	it( "should render the TopPagesWidget component without data", async() => {
		remoteDataProvider.fetchJson.mockResolvedValue( [] );
		const { getByText } = render( <TopPagesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		// Verify no data message is present.
		await waitFor( () => {
			expect( getByText( "No data to display: Your site hasn't received any visitors yet." ) ).toBeInTheDocument();
		} );
	} );

	it( "should render the TopPagesWidget component with an error", async() => {
		const message = "An error occurred.";
		remoteDataProvider.fetchJson.mockRejectedValue( new Error( message ) );
		const { getByText } = render( <TopPagesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		await waitFor( () => {
			expect( getByText( message ) ).toBeInTheDocument();
		} );
	} );

	it( "should render the TopPagesWidget component with a pending state", async() => {
		// Never resolving promise to ensure it keeps loading.
		remoteDataProvider.fetchJson.mockImplementation( () => new Promise( () => {
		} ) );
		const { getByRole, container } = render( <TopPagesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
			limit={ 1 }
		/> );

		// Verify the skeleton loader is present.
		await waitFor( () => {
			expect( getByRole( "table" ) ).toBeInTheDocument();
		} );

		// Expect limit (1) row with 7 columns = 7 skeleton loaders.
		expect( container.getElementsByClassName( "yst-skeleton-loader" ).length ).toBe( 7 );
	} );
} );
