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
} from "../components/ReplacementVariableEditor";

jest.mock( "../components/ReplacementVariableEditor" );

const defaultData = {
	title: "Test title",
	slug: "test-slug",
	description: "Test description, %%replacement_variable%%",
};

const defaultArgs = {
	baseUrl: "https://example.org/",
	data: defaultData,
	onChange: () => {},
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
	it( "shows and editor", () => {
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
			url: "example.org/test-slug",
			description: "Test description, replacement value",
		};
		const replacementVariables = [
			{
				name: "replacement_variable",
				value: "replacement value",
			},
		];

		renderSnapshotWithArgs( { mapDataToPreview: mapper, replacementVariables } );

		// The mapper is called both in the constructor, as well as the render function.
		expect( mapper ).toHaveBeenCalledTimes( 2 );
		expect( mapper ).toHaveBeenCalledWith( defaultMappedData, defaultData );
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

	it( "highlights the hovered field when onMouseOver() is called", () => {
		const editor = mountWithArgs( {} );

		editor.instance().open();
		editor.instance().onMouseOver( "description" );
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	it( "removes the highlight from the hovered field on calling onMouseLeave()", () => {
		const editor = shallowWithArgs( {} );

		editor.instance().open();
		editor.instance().onMouseOver( "description" );
		editor.update();

		editor.instance().onMouseLeave( "description" );
		editor.update();

		expect( editor ).toMatchSnapshot();
	} );

	it( "doesn't remove the highlight if the wrong field is left", () => {
		const editor = shallowWithArgs( {} );

		editor.instance().open();
		editor.instance().onMouseOver( "description" );
		editor.update();

		editor.instance().onMouseLeave( "title" );
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

	it( "activates a field on onClick() and opens the editor", () => {
		const editor = shallowWithArgs( {} );

		editor.instance().onClick( "title" );
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

		const titleEditor = editor.find( "ReplacementVariableEditor" ).get( 0 );
		const slugEditor = editor.find( "input" ).get( 0 );
		const descriptionEditor = editor.find( "ReplacementVariableEditor" ).get( 1 );

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
} );
