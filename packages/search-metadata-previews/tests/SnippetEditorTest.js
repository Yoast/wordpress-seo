import SnippetEditor from "../src/snippet-editor/SnippetEditor";
import React from "react";
// eslint-disable-next-line import/named -- this concerns a mock
import { focus } from "@yoast/replacement-variable-editor";

const defaultData = {
	title: "Test title",
	slug: "test-slug",
	description: "Test description, %%replacement_variable%%",
};

const defaultArgs = {
	baseUrl: "http://example.org/",
	data: defaultData,
	onChange: () => {},
};

/**
 * Mounts the snippet editor component with changed arguments.
 *
 * @param {Object} changedArgs The changed arguments.
 *
 * @returns {ReactElement} The SnippetEditor component.
 */
const mountWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	return args;
};

describe( "SnippetEditor", () => {
	it( "closes when calling close()", () => {
		focus.mockClear();
	} );

	it( "highlights the active ReplacementVariableEditor when calling setFieldFocus", () => {
		focus.mockClear();
	} );

	it( "switches modes when changing mode switcher input", () => {
		const onChange = jest.fn();
	} );

	describe( "shallowCompareData", () => {
		it( "returns false when there is no new data", () => {
			const data = {
				data: {
					title: "old title",
					description: "old description",
					slug: "old slug",
				},
				replacementVariables: [
					{
						name: "test1",
						label: "Test1",
						value: "first",
						description: "First",
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
						description: "Second",
					},
				],
			};
		} );

		it( "returns true when one data point has changed", () => {
			const prev = {
				data: {
					title: "old title",
					description: "old description",
					slug: "old slug",
				},
				replacementVariables: [
					{
						name: "test1",
						label: "Test1",
						value: "first",
						description: "First",
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
						description: "Second",
					},
				],
			};
			const next = {
				data: {
					title: "new title",
					description: "old description",
					slug: "old slug",
				},
				replacementVariables: [
					{
						name: "test1",
						label: "Test1",
						value: "first",
						description: "First",
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
						description: "Second",
					},
				],
			};
		} );

		it( "returns true when one replacement variable has changed", () => {
			const prev = {
				data: {
					title: "old title",
					description: "old description",
					slug: "old slug",
				},
				replacementVariables: [
					{
						name: "test1",
						label: "Test1",
						value: "first",
						description: "First",
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
						description: "Second",
					},
				],
			};
			const next = {
				data: {
					title: "new title",
					description: "old description",
					slug: "old slug",
				},
				replacementVariables: [
					{
						name: "test1",
						label: "Test1",
						value: "first to change",
						description: "First",
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
						description: "Second",
					},
				],
			};
		} );

		it( "returns true when multiple data points have changed", () => {
			const prev = {
				data: {
					title: "old title",
					description: "old description",
					slug: "old slug",
				},
				replacementVariables: [
					{
						name: "test1",
						label: "Test1",
						value: "first",
						description: "First",
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
						description: "Second",
					},
				],
			};
			const next = {
				data: {
					title: "new title",
					description: "new description",
					slug: "old slug",
				},
				replacementVariables: [
					{
						name: "test1",
						label: "Test1",
						value: "first",
						description: "First",
					},
					{
						name: "test2",
						label: "Test2",
						value: "second but now third",
						description: "Second",
					},
				],
			};
		} );
	} );
	describe( "mapDataToMeasurements", () => {
		let editor, data;
		beforeEach( () => {
			data = {
				title: "Tortoiseshell cats %%sep%% %%sitename%%",
				description: "   The cool tortie everyone loves!   ",
				slug: "tortie-cats",
			};
		} );
		it( "returns the filtered SEO title without separator and site title", () => {

		} );
		it( "returns the correct url: baseURL + slug", () => {

		} );
		it( "returns the description with multiple spaces stripped", () => {

		} );
	} );
} );
