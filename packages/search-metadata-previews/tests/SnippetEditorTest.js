import SnippetEditor from "../src/snippet-editor/SnippetEditor";
import React from "react";
import renderer from "react-test-renderer";
import { mount, shallow } from "enzyme";
import { MODE_DESKTOP } from "../src/snippet-preview/constants";
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
 * Renders a snapshot with changed arguments.
 *
 * @param {Object} changedArgs The changed arguments.
 *
 * @returns {void}
 */
const renderSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const tree = renderer.create( <SnippetEditor { ...args } />, { locale: "en" } )
		.toJSON();

	expect( tree ).toMatchSnapshot();
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

/**
 * Shallow render of the snippet editor component with changed arguments.
 *
 * @param {Object} changedArgs The changed arguments.
 *
 * @returns {ReactElement} The SnippetEditor component.
 */
const shallowWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	return shallow( <SnippetEditor { ...args } /> );
};


describe( "SnippetEditor", () => {
	it( "shows the editor", () => {
		renderSnapshotWithArgs( {} );
	} );

	it( "highlights a hovered field", () => {
		renderSnapshotWithArgs( { hoveredField: "title" } );
	} );

	it( "highlights a focused field", () => {
		renderSnapshotWithArgs( { activeField: "slug" } );
	} );

	it( "renders in desktop mode", () => {
		renderSnapshotWithArgs( { mode: MODE_DESKTOP } );
	} );

	it( "passes the date prop", () => {
		renderSnapshotWithArgs( { date: "date string" } );
	} );

	it( "renders the snippet editor without a close button when showCloseButton is false", () => {
		renderSnapshotWithArgs( { showCloseButton: false } );
	} );

	it( "accepts a custom data mapping function", () => {
		const mapper = jest.fn( () => {
			return {
				title: "Totally different title",
				url: "example.org/totally-different-url",
				description: "Totally different description",
			};
		} );
		const defaultMappedData = {
			title: "Test title",
			url: "example.org/test-slug",
			description: "Test description, replacement value",
		};
		const context = {
			shortenedBaseUrl: "example.org/",
		};
		const replacementVariables = [
			{
				name: "replacement_variable",
				value: "replacement value",
				description: "replacement value",
				label: "replacement value",
			},
		];

		renderSnapshotWithArgs( { mapEditorDataToPreview: mapper, replacementVariables } );

		// The mapper is called both in the constructor, as well as the render function.
		expect( mapper ).toHaveBeenCalledTimes( 2 );
		expect( mapper ).toHaveBeenCalledWith( defaultMappedData, context );
	} );

	it( "opens when calling open()", () => {
		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	it( "closes when calling close()", () => {
		focus.mockClear();
		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.update();

		editor.instance().setFieldFocus( "title" );
		expect( focus ).toHaveBeenCalledTimes( 1 );

		expect( editor ).toMatchSnapshot();

		editor.instance().close();
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	it( "highlights the hovered field when onMouseEnter() is called", () => {
		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.instance().onMouseEnter( "description" );
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	it( "removes the highlight from the hovered field on calling onMouseLeave()", () => {
		const editor = shallowWithArgs( {} );

		editor.instance().open();
		editor.instance().onMouseEnter( "description" );
		editor.update();

		editor.instance().onMouseLeave( "description" );
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	it( "highlights the active ReplacementVariableEditor when calling setFieldFocus", () => {
		focus.mockClear();

		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.instance().setFieldFocus( "title" );
		editor.instance().setFieldFocus( "description" );
		editor.update();

		expect( focus ).toHaveBeenCalledTimes( 2 );
		expect( editor ).toMatchSnapshot();
	} );

	it( "removes the highlight when calling unsetFieldFocus", () => {
		focus.mockClear();

		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.instance().setFieldFocus( "title" );
		editor.update();

		editor.instance().unsetFieldFocus();
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	it( "activates a field on onMouseUp() and opens the editor", () => {
		const editor = shallowWithArgs( {} );

		editor.instance().onMouseUp( "title" );
		editor.update();

		expect( editor ).toMatchSnapshot();
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

	it( "passes replacement variables to the title and description editor", () => {
		const editor = mountWithArgs( {
			replacementVariables: [
				{
					name: "title",
					value: "Title!!!",
					label: "Title",
					description: "Title",
				},
				{
					name: "excerpt",
					value: "Excerpt!!!",
					label: "Excerpt",
					description: "Excerpt",
				},
			],
		} );

		editor.instance().open();
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	describe( "colored progress bars", () => {
		it( "can handle scores of 3 and 9", () => {
			const editor = mountWithArgs( {
				titleLengthProgress: {
					max: 550,
					actual: 100,
					score: 3,
				},
				descriptionLengthProgress: {
					max: 650,
					actual: 330,
					score: 9,
				},
			} );

			editor.instance().open();
			editor.update();

			expect( editor ).toMatchSnapshot();
		} );

		it( "can handle a score of 6", () => {
			const editor = mountWithArgs( {
				titleLengthProgress: {
					max: 550,
					actual: 361,
					score: 6,
				},
			} );

			editor.instance().open();
			editor.update();

			expect( editor ).toMatchSnapshot();
		} );
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
