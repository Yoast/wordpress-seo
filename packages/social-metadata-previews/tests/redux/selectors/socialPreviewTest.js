import selectorsFactory from "../../../src/redux/selectors/socialPreview";

const selectors = selectorsFactory( "socialPreviews" );

const state = {
	socialPreviews: {
		facebook: {
			title: "Facebook Title",
			description: "Facebook Description",
			errors: [],
			imageUrl: "http://facebook-image.png",
			imageId: "",
			imageType: "square",
		},
		twitter: {
			title: "Twitter Title",
			description: "Twitter Description",
			errors: [],
			imageUrl: "http://twitter-image.png",
			imageId: "",
			imageType: "large",
		},
	},
};

/** FACEBOOK */
describe( selectors.getFacebookTitle, () => {
	it( "selects the facebook title from the state", () => {
		const actual = selectors.getFacebookTitle( state );

		const expected = "Facebook Title";

		expect( actual ).toEqual( expected );
	} );
} );

describe( selectors.getFacebookDescription, () => {
	it( "selects the facebook description from the state", () => {
		const actual = selectors.getFacebookDescription( state );

		const expected = "Facebook Description";

		expect( actual ).toEqual( expected );
	} );
} );

describe( selectors.getFacebookImageUrl, () => {
	it( "selects the facebook image URL from the state", () => {
		const actual = selectors.getFacebookImageUrl( state );

		const expected = "http://facebook-image.png";

		expect( actual ).toEqual( expected );
	} );
} );

describe( selectors.getFacebookImageType, () => {
	it( "selects the facebook image Type from the state", () => {
		const actual = selectors.getFacebookImageType( state );

		const expected = "square";

		expect( actual ).toEqual( expected );
	} );
} );


/** TWITTER */

describe( selectors.getTwitterTitle, () => {
	it( "selects the twitter title from the state", () => {
		const actual = selectors.getTwitterTitle( state );

		const expected = "Twitter Title";

		expect( actual ).toEqual( expected );
	} );
} );

describe( selectors.getTwitterDescription, () => {
	it( "selects the twitter description from the state", () => {
		const actual = selectors.getTwitterDescription( state );

		const expected = "Twitter Description";

		expect( actual ).toEqual( expected );
	} );
} );

describe( selectors.getTwitterImageUrl, () => {
	it( "selects the twitter image URL from the state", () => {
		const actual = selectors.getTwitterImageUrl( state );

		const expected = "http://twitter-image.png";

		expect( actual ).toEqual( expected );
	} );
} );

describe( selectors.getTwitterImageType, () => {
	it( "selects the twitter image Type from the state", () => {
		const actual = selectors.getTwitterImageType( state );

		const expected = "large";

		expect( actual ).toEqual( expected );
	} );
} );
