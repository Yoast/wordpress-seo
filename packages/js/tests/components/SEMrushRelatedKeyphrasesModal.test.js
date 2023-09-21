import apiFetch from "@wordpress/api-fetch";
// import SEMrushRelatedKeyphrasesModal from "../../src/components/SEMrushRelatedKeyphrasesModal";

jest.mock( "@wordpress/api-fetch", () => {
	return {
		__esModule: true,
		"default": jest.fn( () => {
			return Promise.resolve( {
				tokens: {
					// eslint-disable-next-line camelcase
					access_token: "abcdefghijklmnopqrstuvwxyz1234567890abcd",
					// eslint-disable-next-line camelcase
					refresh_token: "abcdefghijklmnopqrstuvwxyz1234567890abcd",
					expires: 1599460963,
					// eslint-disable-next-line camelcase
					has_expired: false,
					// eslint-disable-next-line camelcase
					created_at: 1598856163,
				},
				status: 200,
			} );
		} ),
	};
} );

describe( "SEMrushRelatedKeyphrasesModal", () => {
	let props = {};

	beforeEach( () => {
		props = {
			onOpen: jest.fn(),
			onOpenWithNoKeyphrase: jest.fn(),
			onClose: jest.fn(),
			onAuthentication: jest.fn(),
			location: "metabox",
		};
	} );

	describe( "onModalOpen", () => {
		it( "successfully opens the modal when the user is logged in, " +
		    "a keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: true,
			};
		} );

		it( "returns a message when no keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "",
				isLoggedIn: true,
			};
		} );
	} );

	describe( "onModalClose", () => {
		it( "successfully calls the close method", () => {

		} );
	} );

	describe( "onLinkClick", () => {
		it( "successfully opens the popup when the user is not logged in, " +
			"a keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};
			global.open = jest.fn();
		} );

		it( "returns a message when no keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "",
				isLoggedIn: false,
			};
			global.open = jest.fn();
		} );
	} );

	describe( "listenToMessages",  () => {
		it( "successfully performs authentication and opens the modal when the user " +
			"has approved the authorization", async() => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};
		} );

		it( "doesn't perform authentication nor opens the modal when there have been problems with getting the tokens", async() => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};
			apiFetch.mockImplementation( () => {
				return Promise.resolve( {
					error: "Error returned by apiFetch",
					status: 400,
				} );
			} );
		} );

		it( "doesn't perform authentication nor opens the modal when the message has a malformed URL", async() => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};
		} );

		it( "do not open the modal when the user has denied the authorization", () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};
		} );
	} );
} );
