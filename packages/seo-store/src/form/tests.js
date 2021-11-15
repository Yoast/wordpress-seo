import { merge } from "lodash";
import keyphrasesReducer, { keyphrasesActions } from "./slice/keyphrases";
import seoReducer, { seoActions } from "./slice/seo";

describe( "Keyphrases slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		focus: {
			id: "focus",
			keyphrase: "",
			synonyms: "",
		},
	};

	describe( "Reducer", () => {
		test( "should return the initial state", () => {
			expect( keyphrasesReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the focus keyphrase", () => {
			const { updateKeyphrase } = keyphrasesActions;

			const result = keyphrasesReducer( initialState, updateKeyphrase( { keyphrase: "test" } ) );

			expect( result ).toEqual( merge( {}, initialState, {
				focus: {
					keyphrase: "test",
				},
			} ) );
		} );

		test( "should ignore update keyphrase requests when the ID is unknown", () => {
			const { updateKeyphrase } = keyphrasesActions;

			const result = keyphrasesReducer( initialState, updateKeyphrase( { id: "non-existing", keyphrase: "test" } ) );

			expect( result ).toEqual( initialState );
		} );

		test( "should update the focus synonyms", () => {
			const { updateSynonyms } = keyphrasesActions;

			const result = keyphrasesReducer( initialState, updateSynonyms( { synonyms: "test" } ) );

			expect( result ).toEqual( merge( {}, initialState, {
				focus: {
					synonyms: "test",
				},
			} ) );
		} );

		test( "should ignore update synonyms requests when the ID is unknown", () => {
			const { updateSynonyms } = keyphrasesActions;

			const result = keyphrasesReducer( initialState, updateSynonyms( { id: "non-existing", synonyms: "test" } ) );

			expect( result ).toEqual( initialState );
		} );

		test( "should add a related keyphrase", () => {
			const { addRelatedKeyphrase } = keyphrasesActions;

			const action = addRelatedKeyphrase( { id: "a", keyphrase: "test", synonyms: "evaluation" } );
			const result = keyphrasesReducer( initialState, action );

			expect( result ).toEqual( merge( {}, initialState, {
				a: {
					id: "a",
					keyphrase: "test",
					synonyms: "evaluation",
				},
			} ) );
		} );

		test( "should add a related keyphrase with an ID", () => {
			const { addRelatedKeyphrase } = keyphrasesActions;

			const action = addRelatedKeyphrase( { id: "a" } );
			const result = keyphrasesReducer( initialState, action );

			expect( result ).toEqual( merge( {}, initialState, {
				a: {
					id: "a",
					keyphrase: "",
					synonyms: "",
				},
			} ) );
		} );

		test( "should add a related keyphrase with a keyphrase", () => {
			const { addRelatedKeyphrase } = keyphrasesActions;

			const action = addRelatedKeyphrase( { keyphrase: "test" } );
			const result = keyphrasesReducer( initialState, action );

			expect( result ).toEqual( merge( {}, initialState, {
				[ action.payload.id ]: {
					id: action.payload.id,
					keyphrase: "test",
					synonyms: "",
				},
			} ) );
		} );

		test( "should add a related keyphrase with synonyms", () => {
			const { addRelatedKeyphrase } = keyphrasesActions;

			const action = addRelatedKeyphrase( { synonyms: "test" } );
			const result = keyphrasesReducer( initialState, action );

			expect( result ).toEqual( merge( {}, initialState, {
				[ action.payload.id ]: {
					id: action.payload.id,
					keyphrase: "",
					synonyms: "test",
				},
			} ) );
		} );

		test( "should add a related keyphrase with fallbacks", () => {
			const { addRelatedKeyphrase } = keyphrasesActions;

			// eslint-disable-next-line no-undefined
			const action = addRelatedKeyphrase( { id: false, keyphrase: null, synonyms: undefined } );
			const result = keyphrasesReducer( initialState, action );

			expect( result ).toEqual( merge( {}, initialState, {
				[ action.payload.id ]: {
					id: action.payload.id,
					keyphrase: "",
					synonyms: "",
				},
			} ) );
		} );

		test( "should update a related keyphrase", () => {
			const { addRelatedKeyphrase, updateKeyphrase } = keyphrasesActions;

			const state = keyphrasesReducer( initialState, addRelatedKeyphrase( { id: "a" } ) );

			expect( state ).toEqual( merge( {}, initialState, {
				a: {
					id: "a",
					keyphrase: "",
					synonyms: "",
				},
			} ) );

			const result = keyphrasesReducer( state, updateKeyphrase( { id: "a", keyphrase: "test" } ) );

			expect( result ).toEqual( merge( {}, initialState, {
				a: {
					id: "a",
					keyphrase: "test",
					synonyms: "",
				},
			} ) );
		} );

		test( "should update a related keyphrase's synonyms", () => {
			const { addRelatedKeyphrase, updateSynonyms } = keyphrasesActions;

			const state = keyphrasesReducer( initialState, addRelatedKeyphrase( { id: "a" } ) );

			expect( state ).toEqual( merge( {}, initialState, {
				a: {
					id: "a",
					keyphrase: "",
					synonyms: "",
				},
			} ) );

			const result = keyphrasesReducer( state, updateSynonyms( { id: "a", synonyms: "test" } ) );

			expect( result ).toEqual( merge( {}, initialState, {
				a: {
					id: "a",
					keyphrase: "",
					synonyms: "test",
				},
			} ) );
		} );
	} );
} );

describe( "Seo slice", () => {
	// eslint-disable-next-line no-undefined
	const previousState = undefined;

	const initialState = {
		title: "",
		description: "",
		slug: "",
		isCornerstone: false,
	};

	describe( "Reducer", () => {
		test( "should return the initial state", () => {
			expect( seoReducer( previousState, {} ) ).toEqual( initialState );
		} );

		test( "should update the title", () => {
			const { updateSeoTitle } = seoActions;

			const result = seoReducer( initialState, updateSeoTitle( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				title: "test",
			} );
		} );

		test( "should update the description", () => {
			const { updateSeoDescription } = seoActions;

			const result = seoReducer( initialState, updateSeoDescription( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				description: "test",
			} );
		} );

		test( "should update the slug", () => {
			const { updateSlug } = seoActions;

			const result = seoReducer( initialState, updateSlug( "test" ) );

			expect( result ).toEqual( {
				...initialState,
				slug: "test",
			} );
		} );

		test( "should update the isCornerstone", () => {
			const { updateIsCornerstone } = seoActions;

			const result = seoReducer( initialState, updateIsCornerstone( false ) );

			expect( result ).toEqual( {
				...initialState,
				isCornerstone: false,
			} );
		} );
	} );
} );
