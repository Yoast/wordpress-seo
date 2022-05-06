import { curry, set } from "lodash";
import socialTemplateReducer, { socialTemplateActions, socialTemplateSelectors } from "../../../../src/form/slice/social/template";

describe( "a test for social template slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		title: "",
		description: "",
	};

	describe( "a test for social template reducer", () => {
		test( "should return the initial state", () => {
			expect( socialTemplateReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the social template title", () => {
			const { updateSocialTitleTemplate } = socialTemplateActions;

			const result = socialTemplateReducer( initialState, updateSocialTitleTemplate( "Title template for cats content" ) );

			expect( result ).toEqual( {
				...initialState,
				title: "Title template for cats content",
			} );
		} );

		test( "should update the social template description", () => {
			const { updateSocialDescriptionTemplate } = socialTemplateActions;

			const result = socialTemplateReducer( initialState, updateSocialDescriptionTemplate( "A collection of cats content." ) );

			expect( result ).toEqual( {
				...initialState,
				description: "A collection of cats content.",
			} );
		} );
	} );

	describe( "a test for social template selectors", () => {
		const createStoreState = curry( set )( {}, "form.social" );

		test( "should select the social template title", () => {
			const { selectSocialTitleTemplate } = socialTemplateSelectors;

			const state = {
				template: {
					title: "Title template for cats content",
				},
			};
			const result = selectSocialTitleTemplate( createStoreState( state ) );

			expect( result ).toEqual( "Title template for cats content" );
		} );

		test( "should select the social template description", () => {
			const { selectSocialDescriptionTemplate } = socialTemplateSelectors;

			const state = {
				template: {
					description: "A collection of cats content.",
				},
			};
			const result = selectSocialDescriptionTemplate( createStoreState( state ) );

			expect( result ).toEqual( "A collection of cats content." );
		} );
	} );
} );
