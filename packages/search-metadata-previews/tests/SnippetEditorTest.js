// import SnippetEditor from "../src/snippet-editor/SnippetEditor";
// import React from "react";
// eslint-disable-next-line import/named -- this concerns a mock
import { focus } from "@yoast/replacement-variable-editor";


describe( "SnippetEditor", () => {
	it( "closes when calling close()", () => {
		focus.mockClear();
	} );

	it( "highlights the active ReplacementVariableEditor when calling setFieldFocus", () => {
		focus.mockClear();
	} );

	it( "switches modes when changing mode switcher input", () => {

	} );

	describe( "shallowCompareData", () => {
		it( "returns false when there is no new data", () => {

		} );

		it( "returns true when one replacement variable has changed", () => {

		} );

		it( "returns true when multiple data points have changed", () => {
		} );
	} );
	describe( "mapDataToMeasurements", () => {
		it( "returns the filtered SEO title without separator and site title", () => {

		} );
		it( "returns the correct url: baseURL + slug", () => {

		} );
		it( "returns the description with multiple spaces stripped", () => {

		} );
	} );
} );
