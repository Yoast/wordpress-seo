import { applyYoastMetaFromOutline } from "../../../src/ai-content-planner/helpers/apply-yoast-meta-from-outline";

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

	it( "only writes Yoast-store meta — category is written to the post entity by the caller", () => {
		applyYoastMetaFromOutline( {
			title: "My post",
			metaDescription: "Description",
			focusKeyphrase: "keyphrase",
		} );

		expect( mockUpdateData ).toHaveBeenCalledTimes( 1 );
		expect( mockSetFocusKeyword ).toHaveBeenCalledTimes( 1 );
	} );
} );
