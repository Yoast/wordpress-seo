import SnippetEditor from "../components/SnippetEditor";
import React from "react";
import { createComponentWithIntl } from "../../../../utils/intlProvider";
import {
	mountWithIntl,
	shallowWithIntl,
} from "../../../../utils/helpers/intl-enzyme-test-helper";
import {
	MODE_DESKTOP,
} from "../../SnippetPreview/constants";
import {
	focus,
} from "../components/ReplacementVariableEditorStandalone";

jest.mock( "../components/ReplacementVariableEditorStandalone" );

const defaultData = {
	title: "Test title",
	slug: "test-slug",
	description: "Test description, %%replacement_variable%%",
};

const defaultArgs = {
	baseUrl: "http://example.org/",
	data: defaultData,
	onChange: jest.fn(),
};

const renderSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const tree = createComponentWithIntl( <SnippetEditor {...args} />, { locale: "en" } )
		.toJSON();

	expect( tree ).toMatchSnapshot();
};

const mountWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	return mountWithIntl( <SnippetEditor { ...args } /> );
};

const shallowWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	return shallowWithIntl( <SnippetEditor { ...args } /> );
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

	it( "With the close button not visible.", () => {
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

	it( "switches modes when clicking mode switcher buttons", () => {
		const onChange = jest.fn();
		const editor = mountWithArgs( { onChange } );

		// Click the mobile button.
		editor.find( "ModeSwitcher__Switcher" ).find( "button" ).at( 0 ).simulate( "click" );

		expect( onChange ).toBeCalledWith( "mode", "mobile" );

		// Click the desktop button.
		editor.find( "ModeSwitcher__Switcher" ).find( "button" ).at( 1 ).simulate( "click" );

		expect( onChange ).toBeCalledWith( "mode", "desktop" );
	} );

	it( "calls callbacks when the editors are focused or changed", () => {
		const onChange = jest.fn();
		const editor = mountWithArgs( { onChange } );

		const changedSlugEvent = {
			target: {
				value: "changedSlug",
			},
		};

		editor.instance().open();
		editor.update();

		const titleEditor = editor.find( "ReplacementVariableEditorStandalone" ).get( 0 );
		const slugEditor = editor.find( "input" ).get( 0 );
		const descriptionEditor = editor.find( "ReplacementVariableEditorStandalone" ).get( 1 );

		titleEditor.props.onFocus();
		expect( editor ).toMatchSnapshot();
		slugEditor.props.onFocus();
		expect( editor ).toMatchSnapshot();
		descriptionEditor.props.onFocus();
		expect( editor ).toMatchSnapshot();

		titleEditor.props.onChange( "changedTitle" );
		slugEditor.props.onChange( changedSlugEvent );
		descriptionEditor.props.onChange( "changedDescription" );

		expect( onChange.mock.calls ).toEqual( [
			[ "title", "changedTitle" ],
			[ "slug", "changedSlug" ],
			[ "description", "changedDescription" ],
		] );
	} );

	it( "passes replacement variables to the title and description editor", () => {
		const editor = mountWithArgs( {
			replacementVariables: [
				{
					name: "title",
					value: "Title!!!",
				},
				{
					name: "excerpt",
					value: "Excerpt!!!",
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
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
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
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
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
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
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
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
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
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
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
					},
					{
						name: "test2",
						label: "Test2",
						value: "second",
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
					},
					{
						name: "test2",
						label: "Test2",
						value: "second but now third",
					},
				],
			};

			const isDirty = editor.instance().shallowCompareData( prev, next );

			expect( isDirty ).toBe( true );
		} );
	} );
} );
