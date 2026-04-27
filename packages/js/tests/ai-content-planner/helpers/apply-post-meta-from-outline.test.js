import { applyPostMetaFromOutline } from "../../../src/ai-content-planner/helpers/apply-post-meta-from-outline";

const mockEditPost = jest.fn();
const mockUpdateData = jest.fn();
const mockSetFocusKeyword = jest.fn();

jest.mock( "@wordpress/data", () => ( {
	dispatch: ( storeName ) => {
		if ( storeName === "core/editor" ) {
			return { editPost: mockEditPost };
		}
		if ( storeName === "yoast-seo/editor" ) {
			return { updateData: mockUpdateData, setFocusKeyword: mockSetFocusKeyword };
		}
		return {};
	},
} ) );

describe( "applyPostMetaFromOutline", () => {
	beforeEach( () => {
		mockEditPost.mockClear();
		mockUpdateData.mockClear();
		mockSetFocusKeyword.mockClear();
	} );

	const baseOutline = {
		title: "My post",
		metaDescription: "Description",
		focusKeyphrase: "keyphrase",
	};

	it( "sets the post category when a valid category is provided", () => {
		applyPostMetaFromOutline( { ...baseOutline, category: { name: "Tech", id: 5 } } );

		expect( mockEditPost ).toHaveBeenCalledWith( { title: "My post" } );
		expect( mockEditPost ).toHaveBeenCalledWith( { categories: [ 5 ] } );
	} );

	it( "does not set the post category for the empty-category sentinel", () => {
		applyPostMetaFromOutline( { ...baseOutline, category: { name: "", id: -1 } } );

		expect( mockEditPost ).toHaveBeenCalledWith( { title: "My post" } );
		expect( mockEditPost ).not.toHaveBeenCalledWith( { categories: [ -1 ] } );
	} );

	it( "does not set the post category when category is missing", () => {
		applyPostMetaFromOutline( { ...baseOutline } );

		expect( mockEditPost ).toHaveBeenCalledWith( { title: "My post" } );
		expect( mockEditPost ).toHaveBeenCalledTimes( 1 );
	} );
} );
