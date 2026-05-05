import { applyYoastMetaFromOutline } from "../../../src/ai-content-planner/helpers/apply-post-meta-from-outline";

const mockUpdateData = jest.fn();
const mockSetFocusKeyword = jest.fn();

jest.mock( "@wordpress/data", () => ( {
	dispatch: ( storeName ) => {
		if ( storeName === "yoast-seo/editor" ) {
			return { updateData: mockUpdateData, setFocusKeyword: mockSetFocusKeyword };
		}
		return {};
	},
} ) );

describe( "applyYoastMetaFromOutline", () => {
	beforeEach( () => {
		mockUpdateData.mockClear();
		mockSetFocusKeyword.mockClear();
	} );

	it( "writes the snippet preview data to the Yoast store", () => {
		applyYoastMetaFromOutline( {
			title: "My post",
			metaDescription: "Description",
			focusKeyphrase: "keyphrase",
		} );

		expect( mockUpdateData ).toHaveBeenCalledWith( { title: "My post", description: "Description" } );
	} );

	it( "writes the focus keyphrase to the Yoast store", () => {
		applyYoastMetaFromOutline( {
			title: "My post",
			metaDescription: "Description",
			focusKeyphrase: "keyphrase",
		} );

		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( "keyphrase" );
	} );

	it( "ignores the category — it's written to the post entity by the caller", () => {
		applyYoastMetaFromOutline( {
			title: "My post",
			metaDescription: "Description",
			focusKeyphrase: "keyphrase",
			category: { name: "Tech", id: 5 },
		} );

		// No editPost / Yoast call carries the category.
		expect( mockUpdateData ).toHaveBeenCalledTimes( 1 );
		expect( mockSetFocusKeyword ).toHaveBeenCalledTimes( 1 );
	} );
} );
