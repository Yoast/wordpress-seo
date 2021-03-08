import * as actions from "../../../src/redux/actions/formActions";

describe( actions.setSocialPreviewTitle,  () => {
	it( "sets a title for facebook", () => {
		const expected = {
			type: actions.SET_SOCIAL_TITLE,
			platform: "facebook",
			title: "A facebook title",
		};

		const actual = actions.setSocialPreviewTitle( "A facebook title", "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
describe( actions.setSocialPreviewDescription,  () => {
	it( "sets a description for facebook", () => {
		const expected = {
			type: actions.SET_SOCIAL_DESCRIPTION,
			platform: "facebook",
			description: "This is a great descripton for my facebook post.",
		};

		const actual = actions.setSocialPreviewDescription(
			"This is a great descripton for my facebook post.",
			"facebook"
		);

		expect( actual ).toEqual( expected );
	} );
} );
describe( actions.setSocialPreviewImage, () => {
	it( "sets an image URL for facebook", () => {
		const expected = {
			type: actions.SET_SOCIAL_IMAGE_URL,
			platform: "facebook",
			imageUrl: "https://yoast-image.png",
		};

		const actual = actions.setSocialPreviewImageUrl( "https://yoast-image.png", "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
describe( actions.setSocialPreviewType,  () => {
	it( "sets an image type for facebook", () => {
		const expected = {
			type: actions.SET_SOCIAL_IMAGE_TYPE,
			platform: "facebook",
			imageType: "square",
		};

		const actual = actions.setSocialPreviewImageType( "square", "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
describe( actions.clearSocialPreviewImage,  () => {
	it( "removes an image for facebook (or twitter)", () => {
		const expected = {
			type: actions.CLEAR_SOCIAL_IMAGE,
			platform: "facebook",
		};

		const actual = actions.clearSocialPreviewImage( "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
