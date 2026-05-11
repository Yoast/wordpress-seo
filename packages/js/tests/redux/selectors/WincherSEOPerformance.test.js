import { getWincherTrackableKeyphrases } from "../../../src/redux/selectors/WincherSEOPerformance";

let windowSpy;

beforeEach( () => {
	windowSpy = jest.spyOn( global, "window", "get" );
	// Default: free site, no premium store.
	windowSpy.mockReturnValue( {
		wpseoScriptData: { metabox: { isPremium: false } },
	} );
} );

afterEach( () => {
	windowSpy.mockRestore();
} );

describe( "getWincherTrackableKeyphrases", () => {
	it( "trims, lowercases and sorts the focus keyword", () => {
		const state = { focusKeyword: "  SEO  " };

		expect( getWincherTrackableKeyphrases( state ) ).toEqual( [ "seo" ] );
	} );

	it( "filters out an empty focus keyword", () => {
		const state = { focusKeyword: "" };

		expect( getWincherTrackableKeyphrases( state ) ).toEqual( [] );
	} );

	it( "canonicalises quotes, colons and extra whitespace", () => {
		const state = { focusKeyword: '"seo":tools' };

		expect( getWincherTrackableKeyphrases( state ) ).toEqual( [ "seo tools" ] );
	} );

	it( "returns the same array reference when called twice with the same content", () => {
		const state = { focusKeyword: "reference stability" };

		const first = getWincherTrackableKeyphrases( state );
		const second = getWincherTrackableKeyphrases( state );

		expect( second ).toBe( first );
	} );

	it( "returns a new array reference when the focus keyword changes", () => {
		const stateA = { focusKeyword: "keyword alpha" };
		const stateB = { focusKeyword: "keyword beta" };

		const first = getWincherTrackableKeyphrases( stateA );
		const second = getWincherTrackableKeyphrases( stateB );

		expect( second ).not.toBe( first );
	} );

	it( "includes premium keyphrases when the premium store is available", () => {
		windowSpy.mockReturnValue( {
			wpseoScriptData: { metabox: { isPremium: true } },
			wp: {
				data: {
					select: () => ( {
						getKeywords: () => [
							{ keyword: "related keyphrase" },
							{ keyword: "another one" },
						],
					} ),
				},
			},
		} );

		const state = { focusKeyword: "seo" };

		expect( getWincherTrackableKeyphrases( state ) ).toEqual( [ "another one", "related keyphrase", "seo" ] );
	} );

	it( "ignores premium keywords whose keyword property is undefined", () => {
		windowSpy.mockReturnValue( {
			wpseoScriptData: { metabox: { isPremium: true } },
			wp: {
				data: {
					select: () => ( {
						getKeywords: () => [
							{ keyword: "valid" },
							{ keyword: undefined },
						],
					} ),
				},
			},
		} );

		const state = { focusKeyword: "seo" };

		expect( getWincherTrackableKeyphrases( state ) ).toEqual( [ "seo", "valid" ] );
	} );

	it( "deduplicates keyphrases that canonicalise to the same value", () => {
		windowSpy.mockReturnValue( {
			wpseoScriptData: { metabox: { isPremium: true } },
			wp: {
				data: {
					select: () => ( {
						getKeywords: () => [ { keyword: "SEO" } ],
					} ),
				},
			},
		} );

		const state = { focusKeyword: "seo" };

		expect( getWincherTrackableKeyphrases( state ) ).toEqual( [ "seo" ] );
	} );
} );
