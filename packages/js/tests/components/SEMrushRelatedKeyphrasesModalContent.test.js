import RelatedKeyphraseModalContent, { hasError, getUserMessage, hasMaximumRelatedKeyphrases } from "../../src/components/SEMrushRelatedKeyphrasesModalContent";
import { render } from "../test-utils";

const succesfulResponse = {
	results: {
		columnNames: [ "Keyword", "Search Volume", "Trends", "Keyword Difficulty Index", "Intent" ],
		rows: [
			[
				"speed test",
				"13600000",
				"0.44,1.00,0.44,0.44,0.44,0.24,0.24,0.36,0.44,0.44,0.44,0.44",
				"9",
				"0",
			],
			[
				"internet speed test",
				"7480000",
				"0.82,0.0",
				"50",
				"0,2",
			],
			[
				"automated test",
				"1500000",
				"0.20,0.24,0.24,0.16,0.36,0.29,0.66,0.81,0.36,0.36,0.20,0.16",
				"90",
				"3",
			],
			[
				"test",
				"1500000",
				"0.36,0.19,0.29,0.16,0.16,0.16,0.16,0.29,0.16,0.19,0.16,0.19",
				"30",
				"0,2,3,1",
			],
			[
				"wifi speed test",
				"823000",
				"1.00,0.44,0.44,0.44,0.54,0.44,0.44,0.54,0.54,0.54,0.54,0.54",
				"15",
				"0,2",
			],
			[
				"typing test",
				"550000",
				"0.55,0.55,0.55,0.45,0.36,0.55,0.55,0.55,0.45,0.36,0.36,0.55",
				"95",
				"0,3",
			],
			[
				"accesability test",
				"301000",
				"0.36,0.44,0.44,0.44,0.44,0.54,0.44,0.54,0.36,0.44,0.44,0.29",
				"80",
				"0",
			],
			[
				"seo test",
				"301000",
				"0.66,0.54,0.54,0.54,0.66,0.54,0.66,0.66,0.54,0.44,0.44,0.54",
				"86",
				"3",
			],
			[
				"related keyphrase test",
				"246000",
				"0.66,0.66,0.54,0.81,1.00,0.81,0.81,0.81,0.66,0.54,0.54,0.54",
				"60",
				"1,3",
			],
			[
				"storybook tests",
				"246000",
				"0.81,0.54,0.44,0.54,0.44,0.13,0.20,0.04,0.06,0.07,0.20,0.29",
				"72",
				"1",
			],
		],
	},
	status: 200,
};

jest.mock( "@wordpress/api-fetch", () => {
	return {
		__esModule: true,
		"default": jest.fn( () => {
			return Promise.resolve( succesfulResponse );
		} ),
	};
} );

describe( "SEMrushRelatedKeyphrasesModalContent", () => {
	let props = {};

	beforeEach( () => {
		props = {
			response: {},
			countryCode: "us",
			relatedKeyphrases: [],
			keyphrase: "yoast seo",
			isSuccess: true,
			isPending: false,
			requestHasData: false,
			requestLimitReached: false,
			setCountry: jest.fn(),
			newRequest: jest.fn(),
			renderAction: jest.fn(),
			setRequestFailed: jest.fn(),
			setNoResultsFound: jest.fn(),
			setRequestSucceeded: jest.fn(),
			setRequestLimitReached: jest.fn(),
		};
	} );

	describe( "hasError", () => {
		it( "returns that the response has no error property", () => {
			const actual = hasError( { status: 200 } );

			expect( actual ).toBe( false );
		} );

		it( "returns that the limit has been reached", () => {
			const actual = hasError( { error: "An error!", status: 500 } );

			expect( actual ).toBe( true );
		} );
		it( "returns true when there is invalid_json error", () => {
			const actual = hasError( { code: "invalid_json" } );
			expect( actual ).toBe( true );
		} );
		it( "returns true when there is fetch_error error", () => {
			const actual = hasError( { code: "fetch_error"	} );
			expect( actual ).toBe( true );
		} );
	} );

	describe( "getUserMessage", () => {
		it( "returns the SEMrushLimitReached message when request limit is reached", () => {
			props = {
				...props,
				requestLimitReached: true,
			};

			const actual = getUserMessage( props );

			expect( actual ).toEqual( "requestLimitReached" );
		} );

		it( "returns the SEMrushRequestFailed message when request fails", () => {
			props = {
				...props,
				isSuccess: false,
				response: {
					error: "An error!",
					status: 500,
				},
			};

			const actual = getUserMessage( props );

			expect( actual ).toEqual( "requestFailed" );
		} );

		it( "returns a message when response contains no data", () => {
			const actual = getUserMessage( props );

			expect( actual ).toEqual( "requestEmpty" );
		} );
	} );

	describe( "hasMaximumRelatedKeyphrases", () => {
		it( "returns that maximum related keyphrases hasn't been reached when there are none", () => {
			const actual = hasMaximumRelatedKeyphrases( [] );

			expect( actual ).toBe( false );
		} );

		it( "returns that maximum related keyphrases hasn't been reached when there is less than 4", () => {
			const actual = hasMaximumRelatedKeyphrases( [
				{ key: "a", keyword: "yoast seo", score: 33 },
				{ key: "b", keyword: "yoast seo plugin", score: 33 },
				{ key: "c", keyword: "yoast plugin", score: 33 },
			] );

			expect( actual ).toBe( false );
		} );

		it( "returns that the limit has been reached", () => {
			const actual = hasMaximumRelatedKeyphrases( [
				{ key: "a", keyword: "yoast seo", score: 33 },
				{ key: "b", keyword: "yoast seo plugin", score: 33 },
				{ key: "c", keyword: "yoast plugin", score: 33 },
				{ key: "d", keyword: "yoast premium plugin", score: 33 },
			] );

			expect( actual ).toBe( true );
		} );
	} );

	describe( "RelatedKeyphraseModalContent", () => {
		it( "renders the anchor tag with the right premium upsell link", async() => {
			props = {
				...props,
				isPremium: false,
				renderAction: null,
				requestHasData: true,
				response: succesfulResponse,
				premiumUpsellLink: "https://yoa.st/413",
			};

			const { getByRole } = render( <RelatedKeyphraseModalContent { ...props } /> );
			const link = getByRole( "link", { name: /Explore Yoast SEO Premium!/i } );
			expect( link ).toHaveAttribute( "href", "https://yoa.st/413" );
		} );

		it( "renders the no results alert", async() => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				requestHasData: false,
				response: {},
			};

			const { queryByText } = render( <RelatedKeyphraseModalContent { ...props } /> );
			const alert = queryByText( "Sorry, there's no data available for that keyphrase/country combination." );
			expect( alert ).toBeInTheDocument();
		} );

		it( "renders the request limit reached alert with the right link", async() => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				requestLimitReached: true,
				response: {},
				semrushUpsellLink: "https://yoa.st/semrush-prices",
			};

			const { getByRole } = render( <RelatedKeyphraseModalContent { ...props } /> );
			const link = getByRole( "link", { name: /Upgrade your Semrush plan/i } );
			expect( link ).toHaveAttribute( "href", "https://yoa.st/semrush-prices" );
		} );

		it( "renders the request failed alert", async() => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				isSuccess: false,
				response: {
					error: "An error!",
					status: 500,
				},
			};

			const { queryByText } = render( <RelatedKeyphraseModalContent { ...props } /> );
			const alert = queryByText( "We've encountered a problem trying to get related keyphrases. Please try again later." );
			expect( alert ).toBeInTheDocument();
		} );

		it( "renders the maximum related keyphrases alert", async() => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				relatedKeyphrases: [
					{ key: "a", keyword: "yoast seo", score: 33 },
					{ key: "b", keyword: "yoast seo plugin", score: 33 },
					{ key: "c", keyword: "yoast plugin", score: 33 },
					{ key: "d", keyword: "yoast premium plugin", score: 33 },
				],
				requestHasData: true,
			};

			const { queryByText } = render( <RelatedKeyphraseModalContent { ...props } /> );
			const alert = queryByText( "You've reached the maximum amount of 4 related keyphrases. You can change or remove related keyphrases in the Yoast SEO metabox or sidebar." );
			expect( alert ).toBeInTheDocument();
		} );
	} );

	describe( "RelatedKeyphraseModalContent table content", () => {
		let renderResult;
		let rowsWithId;

		beforeEach( () => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				requestHasData: true,
				response: succesfulResponse,
			};
			renderResult = render( <RelatedKeyphraseModalContent { ...props } /> );
			const { getAllByRole } = renderResult;
			const rows = getAllByRole( "row" );
			// The results rows accepts an id while the header row and hidden table row do not.
			rowsWithId = rows.filter( row => row.hasAttribute( "id" ) );
		} );

		it( "should render the results and with add button when premium is active", async() => {
			const { getAllByRole } = renderResult;
			const buttons = getAllByRole( "button", { name: /Add/i } );
			expect( buttons ).toHaveLength( 10 );
		} );

		it( "should render the 10 rows for the results", () => {
			expect( rowsWithId ).toHaveLength( 10 );
		} );

		it( "should render the keyphrases", () => {
			const expectedKeyphrases = succesfulResponse.results.rows.map( row => row[ 0 ] );
			expectedKeyphrases.forEach( ( keyphrase, index ) => {
				expect( rowsWithId[ index ] ).toHaveTextContent( keyphrase );
			} );
		} );

		it( "should render the search volume", () => {
			const searchVolumeFormat = new Intl.NumberFormat( "en", { notation: "compact", compactDisplay: "short" } );
			const expectedSearchVolumes = succesfulResponse.results.rows.map( row => row[ 1 ] );
			expectedSearchVolumes.forEach( ( searchVolume, index ) => {
				const volume = searchVolumeFormat.format( searchVolume );
				expect( rowsWithId[ index ] ).toHaveTextContent( volume );
			} );
		} );

		it( "should render the intent badges", () => {
			const variantsIntents = {
				i: {
					title: "Informational",
					description: "The user wants to find an answer to a specific question.",
				},
				n: {
					title: "Navigational",
					description: "The user wants to find a specific page or site.",
				},
				c: {
					title: "Commercial",
					description: "The user wants to investigate brands or services.",
				},
				t: {
					title: "Transactional",
					description: "The user wants to complete an action (conversion).",
				},
			};
			const expectedIntents = succesfulResponse.results.rows.map( row => row[ 4 ] );
			expectedIntents.forEach( ( intentList, index ) => {
				const intents = intentList.split( "," ).map( ( value ) => [ "i", "n", "t", "c" ][ Number( value ) ] );

				intents.forEach( ( intent ) => {
					expect( rowsWithId[ index ] ).toHaveTextContent( intent );
					// Check the tooltip content.
					expect( rowsWithId[ index ] ).toHaveTextContent( variantsIntents[ intent ].title );
					expect( rowsWithId[ index ] ).toHaveTextContent( variantsIntents[ intent ].description );
				} );
			} );
		} );

		it( "should render the keyword difficulty index", () => {
			const difficultyIndex = [
				{
					min: 0,
					max: 14,
					name: "very-easy",
					tooltip: {
						title: "Very easy",
						description: "Your chance to start ranking new pages.",
					},
				},
				{
					min: 15,
					max: 29,
					name: "easy",
					tooltip: {
						title: "Easy",
						description: "You will need quality content focused on the keyword’s intent.",
					},
				},
				{
					min: 30,
					max: 49,
					name: "possible",
					tooltip: {
						title: "Possible",
						description: "You will need well-structured and unique content.",
					},
				},
				{
					min: 50,
					max: 69,
					name: "difficult",
					tooltip: {
						title: "Difficult",
						description: "You will need lots of ref. domains and optimized content.",
					},
				},
				{
					min: 70,
					max: 84,
					name: "hard",
					tooltip: {
						title: "Hard",
						description: "You will need lots of high-quality ref. domains and optimized content.",
					},
				},
				{
					min: 85,
					max: 100,
					name: "very-hard",
					tooltip: {
						title: "Very hard",
						description: "It will take a lot of on-page SEO, link building, and content promotion efforts.",
					},
				},
			];
			const expectedKeywordDifficultyIndexes = succesfulResponse.results.rows.map( row => row[ 3 ] );
			expectedKeywordDifficultyIndexes.forEach( ( keywordDifficultyIndex, index ) => {
				expect( rowsWithId[ index ] ).toHaveTextContent( keywordDifficultyIndex );
				// Check the tooltip content.
				const variantDifficultyIndex = difficultyIndex.find( variant =>
					keywordDifficultyIndex >= variant.min && keywordDifficultyIndex <= variant.max );
				expect( rowsWithId[ index ] ).toHaveTextContent( variantDifficultyIndex.tooltip.title );
				expect( rowsWithId[ index ] ).toHaveTextContent( variantDifficultyIndex.tooltip.description );
			} );
		} );

		it( "should render the trends svgs", () => {
			const { container } = renderResult;
			const trendGraphs = container.querySelectorAll( 'svg[height="24"][width="66"]' );
			expect( trendGraphs ).toHaveLength( 10 );
			expect( trendGraphs ).toMatchSnapshot();
		} );
	} );
} );
