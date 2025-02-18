import { beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { forEach } from "lodash";
import { SCORE_META } from "../../../src/dashboard/scores/score-meta";
import { DataFormatter } from "../../../src/dashboard/services/data-formatter";
import { createTopPageFormatter, TopPagesWidget } from "../../../src/dashboard/widgets/top-pages-widget";
import { render, waitFor } from "../../test-utils";
import { MockDataProvider } from "../__mocks__/data-provider";
import { MockRemoteDataProvider } from "../__mocks__/remote-data-provider";

describe( "TopPagesWidget", () => {
	const data = [
		{ subject: "https://example.com/page-1", clicks: 100, impressions: 1000, ctr: 10, position: 1, seoScore: "ok", links: { edit: "https://example.com/page-1/edit" } },
		{ subject: "https://example.com/page-2", clicks: 101, impressions: 1001, ctr: 11, position: 2, seoScore: "good", links: { edit: "https://example.com/page-2/edit" } },
		{ subject: "https://example.com/page-3", clicks: 102, impressions: 1002, ctr: 12, position: 3, seoScore: "bad", links: { edit: "https://example.com/page-3/edit" } },
		{ subject: "https://example.com/page-4", clicks: 103, impressions: 1003, ctr: 13, position: 4, seoScore: "notAnalyzed", links: { edit: "https://example.com/page-4/edit" } },
		{ subject: "https://example.com/page-5", clicks: 104, impressions: 1004, ctr: 14, position: 5 },
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
		const editButtons = getAllByRole( "link", { name: "Edit" } );
		expect( editButtons ).toHaveLength( 5 );
		// Verify rows are present.
		forEach( formattedData, ( { subject, clicks, impressions, ctr, position, seoScore, links }, index ) => {
			expect( getByText( subject ) ).toBeInTheDocument();
			expect( getByText( clicks ) ).toBeInTheDocument();
			expect( getByText( impressions ) ).toBeInTheDocument();
			expect( getByText( ctr ) ).toBeInTheDocument();
			expect( getByText( position ) ).toBeInTheDocument();
			if ( links?.edit ) {
				expect( getByText( SCORE_META[ seoScore ].label ) ).toBeInTheDocument();
				expect( editButtons[ index ] ).toHaveAttribute( "href", links.edit );
				expect( editButtons[ index ] ).toHaveAttribute( "aria-disabled", "false" );
			} else {
				expect( getByText( "Not editable" ) ).toBeInTheDocument();
				expect( editButtons[ index ] ).not.toHaveAttribute( "href" );
				expect( editButtons[ index ] ).toHaveAttribute( "disabled" );
				expect( editButtons[ index ] ).toHaveAttribute( "aria-disabled", "true" );
			}
		} );
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

	it( "when the data provider has indexables disabled, should render the TopPagesWidget component with disabled tooltip", async() => {
		remoteDataProvider.fetchJson.mockResolvedValue( data );
		dataProvider = new MockDataProvider( {
			features: {
				indexables: false,
				seoAnalysis: true,
			},
		} );
		const { getAllByText } = render( <TopPagesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		// Verify the disabled score message is present.
		await waitFor( () => {
			const tooltip = getAllByText( "We can’t analyze your content, because you’re in a non-production environment." );
			const screenReaderLabels = getAllByText( "Indexables are disabled" );
			expect( tooltip ).toHaveLength( 5 );
			expect( screenReaderLabels ).toHaveLength( 5 );
		} );
	} );
	it( "when the data provider has SEO analysis disabled, should render the TopPagesWidget component with disabled tooltip", async() => {
		remoteDataProvider.fetchJson.mockResolvedValue( data );
		dataProvider = new MockDataProvider( {
			features: {
				indexables: true,
				seoAnalysis: false,
			},
		} );
		const { getAllByText } = render( <TopPagesWidget
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			dataFormatter={ dataFormatter }
		/> );

		// Verify the disabled score message is present.
		await waitFor( () => {
			const tooltip = getAllByText( "We can’t provide SEO scores, because the SEO analysis is disabled for your site." );
			const screenReaderLabels = getAllByText( "SEO analysis is disabled" );
			expect( tooltip ).toHaveLength( 5 );
			expect( screenReaderLabels ).toHaveLength( 5 );
		} );
	} );
} );
