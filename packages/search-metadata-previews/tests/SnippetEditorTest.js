import SnippetEditor from "../src/snippet-editor/SnippetEditor";
import React from "react";
import { mount } from "enzyme";
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
	return mount( <SnippetEditor { ...args } /> );
};

describe( "SnippetEditor", () => {
	it( "accepts a custom data mapping function", () => {
		const mapper = jest.fn( () => {
			return {
				title: "Totally different title",
				url: "http://example.org/totally-different-url",
				description: "Totally different description",
			};
		} );
		const defaultMappedData = {
			title: "Test title",
			url: "http://example.org/test-slug",
			description: "Test description, replacement value",
		};
		const context = {
			shortenedBaseUrl: "example.org/",
		};

		// The mapper is called both in the constructor, as well as the render function.
		expect( mapper ).toHaveBeenCalledTimes( 2 );
		expect( mapper ).toHaveBeenCalledWith( defaultMappedData, context );
	} );

	it( "closes when calling close()", () => {
		focus.mockClear();
		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.update();

		editor.instance().setFieldFocus( "title" );
		expect( focus ).toHaveBeenCalledTimes( 1 );
	} );

	it( "highlights the active ReplacementVariableEditor when calling setFieldFocus", () => {
		focus.mockClear();

		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.instance().setFieldFocus( "title" );
		editor.instance().setFieldFocus( "description" );
		editor.update();

		expect( focus ).toHaveBeenCalledTimes( 2 );
	} );

	it( "switches modes when changing mode switcher input", () => {
		const onChange = jest.fn();
		const editor = mountWithArgs( { onChange } );

		// Click the mobile button.
		editor.find( "ModeSwitcher__Switcher" ).find( "input" ).at( 0 ).simulate( "change" );

		expect( onChange ).toBeCalledWith( "mode", "mobile" );

		// Click the desktop button.
		editor.find( "ModeSwitcher__Switcher" ).find( "input" ).at( 1 ).simulate( "change" );

		expect( onChange ).toBeCalledWith( "mode", "desktop" );
	} );

	describe( "shallowCompareData", () => {
		it( "returns false when there is no new data", () => {
			const editor = mountWithArgs( {} );

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

			const isDirty = editor.instance().shallowCompareData( data, data );

			expect( isDirty ).toBe( false );
		} );

		it( "returns true when one data point has changed", () => {
			const editor = mountWithArgs( {} );

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

			const isDirty = editor.instance().shallowCompareData( prev, next );

			expect( isDirty ).toBe( true );
		} );

		it( "returns true when one replacement variable has changed", () => {
			const editor = mountWithArgs( {} );

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

			const isDirty = editor.instance().shallowCompareData( prev, next );

			expect( isDirty ).toBe( true );
		} );

		it( "returns true when multiple data points have changed", () => {
			const editor = mountWithArgs( {} );

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

			const isDirty = editor.instance().shallowCompareData( prev, next );

			expect( isDirty ).toBe( true );
		} );
	} );
} );
