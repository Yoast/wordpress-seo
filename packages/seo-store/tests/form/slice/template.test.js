import { curry, set } from "lodash-es";
import templateReducer, { templateActions, templateSelectors } from "../../../src/form/slice/template";

describe( "a test for twitter slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		description: "",
		title: "",
		titleNoFallback: "",
	};

	describe( "a test for templates reducer", () => {
		test( "should return the initial state", () => {
			expect( templateReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the title", () => {
			const { updateTitleTemplate } = templateActions;

			const result = templateReducer( initialState, updateTitleTemplate( "Catfluencer on the internet" ) );

			expect( result ).toEqual( {
				...initialState,
				title: "Catfluencer on the internet",
			} );
		} );

		test( "should update the description", () => {
			const { updateDescriptionTemplate } = templateActions;

			const result = templateReducer( initialState, updateDescriptionTemplate( "How to be a purr-fect catfluencer on the internet." ) );

			expect( result ).toEqual( {
				...initialState,
				description: "How to be a purr-fect catfluencer on the internet.",
			} );
		} );

		test( "should update the title template no fallback", () => {
			const { updateTitleTemplateNoFallback } = templateActions;

			const result = templateReducer( initialState, updateTitleTemplateNoFallback( "A title template" ) );

			expect( result ).toEqual( {
				...initialState,
				titleNoFallback: "A title template",
			} );
		} );
	} );

	describe( "a test for templates selectors", () => {
		const createStoreState = curry( set )( {}, "form" );

		test( "should select the title template", () => {
			const { selectTitleTemplate } = templateSelectors;

			const state = {
				template: {
					title: "Excelling in catfluencer role on the internet",
				},
			};
			const result = selectTitleTemplate( createStoreState( state ) );

			expect( result ).toEqual( "Excelling in catfluencer role on the internet" );
		} );

		test( "should select the title no fallback template", () => {
			const { selectTitleTemplateNoFallback } = templateSelectors;

			const state = {
				template: {
					titleNoFallback: "A title template",
				},
			};
			const result = selectTitleTemplateNoFallback( createStoreState( state ) );

			expect( result ).toEqual( "A title template" );
		} );

		test( "should select the description template", () => {
			const { selectDescriptionTemplate } = templateSelectors;

			const state = {
				template: {
					description: "What it means to be a catfluencer and what treats should we present to our cats so they can excel in being one.",
				},
			};
			const result = selectDescriptionTemplate( createStoreState( state ) );

			expect( result ).toEqual( "What it means to be a catfluencer and what treats should we present to our cats so they can excel in being one." );
		} );

		test( "should select the templates data", () => {
			const { selectSeoTemplates } = templateSelectors;

			const state = {
				template: {
					titleNoFallback: "Catfluencer on the internet",
					description: "How to be a purr-fect catfluencer on the internet.",
					title: "Excelling in catfluencer role on the internet",
				},
			};
			const result = selectSeoTemplates( createStoreState( state ) );

			expect( result ).toEqual( {
				titleNoFallback: "Catfluencer on the internet",
				description: "How to be a purr-fect catfluencer on the internet.",
				title: "Excelling in catfluencer role on the internet",
			} );
		} );
	} );
} );
