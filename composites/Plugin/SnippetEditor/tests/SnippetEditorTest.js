import SnippetEditor from "../components/SnippetEditor";
import React from "react";
import { createComponentWithIntl } from "../../../../utils/intlProvider";
import { mountWithIntl } from "../../../../utils/helpers/intl-enzyme-test-helper";
import {
	MODE_DESKTOP,
} from "../../SnippetPreview/components/SnippetPreview";

jest.mock( "../components/ReplacementVariableEditor" );

const defaultData = {
	title: "Test title",
	slug: "test-slug",
	description: "Test description, %%replacement_variable%%",
};

const defaultArgs = {
	baseUrl: "https://example.org/",
	data: defaultData,
};


const renderSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const tree = createComponentWithIntl( <SnippetEditor {...args} /> )
		.toJSON();

	expect( tree ).toMatchSnapshot();
};

const mountSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const editor = mountWithIntl( <SnippetEditor { ...args } /> );

	editor.instance().open();
	editor.update();

	expect( editor ).toMatchSnapshot();
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

		expect( mapper ).toHaveBeenCalledTimes( 1 );
		expect( mapper ).toHaveBeenCalledWith( defaultMappedData, defaultData );
	} );

	it( "opens when calling open()", () => {
		mountSnapshotWithArgs( {} );
	} );

	it( "passes replacement variables to the title and description editor", () => {
		mountSnapshotWithArgs( {
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
	} );

	it( "shows the assessments as a colored progress bars", () => {
		mountSnapshotWithArgs( {
			titleLengthAssessment: {
				max: 550,
				actual: 100,
				score: 3,
			},
			descriptionLengthAssessment: {
				max: 650,
				actual: 330,
				score: 9,
			},
		} );
	} );
} );
