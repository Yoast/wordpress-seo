/**
 * Tests for the shortcode-extraction behaviour of `collectData` in
 * src/initializers/analysis.js. `collectData` is the main-thread data source the Insights panel
 * uses for its own analysis, so the shortcodes it surfaces must match what the analyze cycle is
 * told about — otherwise the Insights and assessment results can drift on shortcode-rich posts.
 */

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
	dispatch: jest.fn(),
	subscribe: jest.fn(),
	combineReducers: jest.requireActual( "@wordpress/data" ).combineReducers,
} ) );

jest.mock( "@wordpress/hooks", () => ( {
	applyFilters: ( hook, value ) => value,
	doAction: jest.fn(),
} ) );

jest.mock( "../../src/initializers/pluggable", () => ( {
	applyModifications: ( modification, value ) => value,
} ) );

import { select } from "@wordpress/data";
import { collectData } from "../../src/initializers/analysis";

const originalWpseoScriptData = window.wpseoScriptData;

describe( "collectData — shortcodes extraction", () => {
	beforeEach( () => {
		select.mockImplementation( () => ( {
			getAnalysisData: () => ( { text: "", title: "", description: "" } ),
			getEditorDataTitle: () => "",
			getIsFrontPage: () => false,
		} ) );
	} );

	afterAll( () => {
		window.wpseoScriptData = originalWpseoScriptData;
	} );

	it( "passes the wpseo_shortcode_tags array through when it is present", () => {
		window.wpseoScriptData = {
			// eslint-disable-next-line camelcase
			analysis: { plugins: { shortcodes: { wpseo_shortcode_tags: [ "gallery", "caption" ] } } },
		};

		expect( collectData().shortcodes ).toEqual( [ "gallery", "caption" ] );
	} );

	it( "falls back to an empty array when plugins.shortcodes is missing", () => {
		window.wpseoScriptData = { analysis: { plugins: {} } };

		expect( collectData().shortcodes ).toEqual( [] );
	} );

	it( "falls back to an empty array when wpseo_shortcode_tags is missing on the shortcodes object", () => {
		window.wpseoScriptData = { analysis: { plugins: { shortcodes: {} } } };

		expect( collectData().shortcodes ).toEqual( [] );
	} );

	it( "falls back to an empty array when wpseo_shortcode_tags is null", () => {
		window.wpseoScriptData = {
			// eslint-disable-next-line camelcase
			analysis: { plugins: { shortcodes: { wpseo_shortcode_tags: null } } },
		};

		expect( collectData().shortcodes ).toEqual( [] );
	} );

	it( "falls back to an empty array when wpseo_shortcode_tags is a non-array value", () => {
		window.wpseoScriptData = {
			// eslint-disable-next-line camelcase
			analysis: { plugins: { shortcodes: { wpseo_shortcode_tags: { gallery: true } } } },
		};

		expect( collectData().shortcodes ).toEqual( [] );
	} );
} );
