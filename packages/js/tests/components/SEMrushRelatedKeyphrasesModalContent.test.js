import RelatedKeyphraseModalContent, { hasError, getUserMessage, hasMaximumRelatedKeyphrases } from "../../src/components/SEMrushRelatedKeyphrasesModalContent";
import { render } from "../test-utils";
import { expect } from "@jest/globals";

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
		it( "renders the SEMrush related keyphrases modal content with results and without premium", async() => {
			props = {
				...props,
				isPremium: false,
				renderAction: null,
				requestHasData: true,
				response: succesfulResponse,
				premiumUpsellLink: "https://yoa.st/413",
			};

			const { container } = render( <RelatedKeyphraseModalContent { ...props } /> );
			expect( container ).toMatchSnapshot();
		} );

		it( "renders the SEMrush related keyphrases modal content with results and with premium", async() => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				requestHasData: true,
				response: succesfulResponse,
			};

			const { container } = render( <RelatedKeyphraseModalContent { ...props } /> );
			expect( container ).toMatchSnapshot();
		} );

		it( "renders the SEMrush related keyphrases modal content with no results alert", async() => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				requestHasData: false,
				response: {},
			};

			const { container } = render( <RelatedKeyphraseModalContent { ...props } /> );
			expect( container ).toMatchSnapshot();
		} );

		it( "renders the SEMrush related keyphrases modal content with request limit reached alert", async() => {
			props = {
				...props,
				isPremium: true,
				renderAction: jest.fn( () => <button>Add</button> ),
				requestLimitReached: true,
				response: {},
				semrushUpsellLink: "https://yoa.st/semrush-prices",
			};

			const { container } = render( <RelatedKeyphraseModalContent { ...props } /> );
			expect( container ).toMatchSnapshot();
		} );

		it( "renders the SEMrush related keyphrases modal content with request failed alert", async() => {
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

			const { container } = render( <RelatedKeyphraseModalContent { ...props } /> );
			expect( container ).toMatchSnapshot();
		} );

		it( "renders the SEMrush related keyphrases modal content with maximum related keyphrases alert", async() => {
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

			const { container } = render( <RelatedKeyphraseModalContent { ...props } /> );
			expect( container ).toMatchSnapshot();
		} );
	} );
} );
