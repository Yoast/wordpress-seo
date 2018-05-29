import {
	mapDispatchToProps,
	mapStateToProps,
} from "../../src/containers/SnippetEditor";
import { switchMode, updateData } from "../../src/redux/actions/snippetEditor";


describe( "SnippetEditor container", () => {
	it( "maps the state to the props", () => {
		const state = {
			activeKeyword: "active",
			analysis: {
				seo: {
					active: [
						{ _identifier: "metaDescriptionLength", max: 156, actual: 11, score: 6 },
						{ _identifier: "titleWidth", max: 600, actual: 400, score: 6 },
					],
				},
			},
			snippetEditor: {
				mode: "desktop",
				data: {
					title: "Title",
					slug: "slug",
					description: "Description",
				},
				replacementVariables: [
					{
						name: "variable",
						value: "Value",
					},
				],
			},
		};
		const expected = {
			mode: "desktop",
			keyword: "active",
			descriptionLengthProgress: {
				max: 156,
				actual: 11,
				score: 6,
			},
			titleLengthProgress: {
				max: 600,
				actual: 0,
				score: 1,
			},
			data: {
				title: "Title",
				slug: "slug",
				description: "Description",
			},
			replacementVariables: [
				{
					name: "variable",
					value: "Value",
				},
			],
		};

		const result = mapStateToProps( state );

		expect( result ).toEqual( expected );
	} );

	it( "maps dispatch to props", () => {
		const dispatch = jest.fn();

		const result = mapDispatchToProps( dispatch );

		result.onChange( "mode", "some-mode" );
		result.onChange( "title", "Title" );

		expect( dispatch.mock.calls ).toEqual( [
			[ switchMode( "some-mode" ) ],
			[ updateData( { title: "Title" } ) ],
		] );
	} );
} );
