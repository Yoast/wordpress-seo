import * as SEMrushRelatedKeyphrasesModalContent from "../../src/components/SEMrushRelatedKeyphrasesModalContent";

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
			const actual = SEMrushRelatedKeyphrasesModalContent.hasError( { status: 200 } );

			expect( actual ).toBe( false );
		} );

		it( "returns that the limit has been reached", () => {
			const actual = SEMrushRelatedKeyphrasesModalContent.hasError( { error: "An error!", status: 500 } );

			expect( actual ).toBe( true );
		} );
		it( "returns true when there is invalid_json error", () => {
			const actual = SEMrushRelatedKeyphrasesModalContent.hasError( { code: "invalid_json" } );
			expect( actual ).toBe( true );
		} );
		it( "returns true when there is fetch_error error", () => {
			const actual = SEMrushRelatedKeyphrasesModalContent.hasError( { code: "fetch_error"	} );
			expect( actual ).toBe( true );
		} );
	} );

	describe( "getUserMessage", () => {
		it( "returns the SEMrushLimitReached message when request limit is reached", () => {
			props = {
				...props,
				requestLimitReached: true,
			};

			const actual = SEMrushRelatedKeyphrasesModalContent.getUserMessage( props );

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

			const actual = SEMrushRelatedKeyphrasesModalContent.getUserMessage( props );

			expect( actual ).toEqual( "requestFailed" );
		} );

		it( "returns a message when response contains no data", () => {
			const actual = SEMrushRelatedKeyphrasesModalContent.getUserMessage( props );

			expect( actual ).toEqual( "requestEmpty" );
		} );
	} );

	describe( "hasMaximumRelatedKeyphrases", () => {
		it( "returns that maximum related keyphrases hasn't been reached when there are none", () => {
			const actual = SEMrushRelatedKeyphrasesModalContent.hasMaximumRelatedKeyphrases( [] );

			expect( actual ).toBe( false );
		} );

		it( "returns that maximum related keyphrases hasn't been reached when there is less than 4", () => {
			const actual = SEMrushRelatedKeyphrasesModalContent.hasMaximumRelatedKeyphrases( [
				{ key: "a", keyword: "yoast seo", score: 33 },
				{ key: "b", keyword: "yoast seo plugin", score: 33 },
				{ key: "c", keyword: "yoast plugin", score: 33 },
			] );

			expect( actual ).toBe( false );
		} );

		it( "returns that the limit has been reached", () => {
			const actual = SEMrushRelatedKeyphrasesModalContent.hasMaximumRelatedKeyphrases( [
				{ key: "a", keyword: "yoast seo", score: 33 },
				{ key: "b", keyword: "yoast seo plugin", score: 33 },
				{ key: "c", keyword: "yoast plugin", score: 33 },
				{ key: "d", keyword: "yoast premium plugin", score: 33 },
			] );

			expect( actual ).toBe( true );
		} );
	} );
} );
