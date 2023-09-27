/**
 * @jest-environment jsdom
 */

import React from "react";
import SnippetEditor from "../src/snippet-editor/SnippetEditor";
import { render, screen, fireEvent, userEvent } from "./test-utils";

// eslint-disable-next-line import/named -- this concerns a mock
import { focus } from "@yoast/replacement-variable-editor";
import { set } from "lodash";

const defaultData = {
	title: "Test title",
	slug: "test-slug",
	description: "Test description, %%replacement_variable%%",
};

const defaultArgs = {
	baseUrl: "http://example.org/",
	siteName: "Test site name",
	data: defaultData,
	onChange: () => {},
};

describe( "SnippetEditor", () => {
	it( "closes when calling close()", () => {
		focus.mockClear();
	} );

	it( "highlights the active ReplacementVariableEditor when calling setFieldFocus", () => {
		focus.mockClear();
	} );

	it( "switches modes when changing mode switcher input", async() => {
		const user = userEvent.setup();
		render( <SnippetEditor { ...defaultArgs } /> );

		expect( screen.getByText( "Desktop result" ) ).toBeInTheDocument();
		expect( screen.getByText( "Mobile result" ) ).toBeInTheDocument();
		expect( screen.getByLabelText( "Desktop result" ) ).not.toBeChecked();
		expect( screen.getByLabelText( "Mobile result" ) ).toBeChecked();

		await user.click( screen.getByLabelText( "Desktop result" ) );
		await new Promise( resolve => setTimeout( resolve, 500 ) );

		console.log( screen.getByLabelText( "Desktop result" ) );
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
