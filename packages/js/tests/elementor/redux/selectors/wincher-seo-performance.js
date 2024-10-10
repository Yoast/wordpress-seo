import { describe, expect, it } from "@jest/globals";
import { getWincherPermalink } from "../../../../src/elementor/redux/selectors/wincher-seo-performance";
import { getWincherPermalink as getPureWincherPermalink } from "../../../../src/redux/selectors/WincherSEOPerformance";

describe( "getWincherPermalink", () => {
	it( "exists", () => {
		expect( getWincherPermalink ).toBeTruthy();
	} );

	it( "should return the base URL plus the slug", () => {
		const state = {
			settings: {
				snippetEditor: {
					baseUrl: "https://example.com/",
				},
			},
			snippetEditor: {
				data: {
					slug: "slug",
				},
			},
		};

		expect( getWincherPermalink( state ) ).toBe( "https://example.com/slug" );
	} );

	it( "should return the same as the non-Elementor override", () => {
		const state = {
			settings: {
				snippetEditor: {
					baseUrl: "https://example.com/",
				},
			},
			snippetEditor: {
				data: {
					slug: "slug",
				},
			},
		};

		expect( getWincherPermalink( state ) ).toBe( getPureWincherPermalink( state ) );
	} );
} );
