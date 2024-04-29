import {
	CLEAR_SOCIAL_IMAGE,
	clearSocialPreviewImage,
	SET_SOCIAL_DESCRIPTION,
	SET_SOCIAL_IMAGE_TYPE,
	SET_SOCIAL_IMAGE_URL,
	SET_SOCIAL_TITLE,
	setSocialPreviewDescription,
	setSocialPreviewImage,
	setSocialPreviewImageType,
	setSocialPreviewImageUrl,
	setSocialPreviewTitle,
} from "../../../src/redux/actions/formActions";

describe( setSocialPreviewTitle, () => {
	it( "sets a title for facebook", () => {
		const expected = {
			type: SET_SOCIAL_TITLE,
			platform: "facebook",
			title: "A facebook title",
		};

		const actual = setSocialPreviewTitle( "A facebook title", "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
describe( setSocialPreviewDescription, () => {
	it( "sets a description for facebook", () => {
		const expected = {
			type: SET_SOCIAL_DESCRIPTION,
			platform: "facebook",
			description: "This is a great descripton for my facebook post.",
		};

		const actual = setSocialPreviewDescription(
			"This is a great descripton for my facebook post.",
			"facebook",
		);

		expect( actual ).toEqual( expected );
	} );
} );
describe( setSocialPreviewImage, () => {
	it( "sets an image URL for facebook", () => {
		const expected = {
			type: SET_SOCIAL_IMAGE_URL,
			platform: "facebook",
			imageUrl: "https://yoast-image.png",
		};

		const actual = setSocialPreviewImageUrl( "https://yoast-image.png", "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
describe( setSocialPreviewImageType, () => {
	it( "sets an image type for facebook", () => {
		const expected = {
			type: SET_SOCIAL_IMAGE_TYPE,
			platform: "facebook",
			imageType: "square",
		};

		const actual = setSocialPreviewImageType( "square", "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
describe( clearSocialPreviewImage, () => {
	it( "removes an image for facebook (or twitter)", () => {
		const expected = {
			type: CLEAR_SOCIAL_IMAGE,
			platform: "facebook",
		};

		const actual = clearSocialPreviewImage( "facebook" );

		expect( actual ).toEqual( expected );
	} );
} );
