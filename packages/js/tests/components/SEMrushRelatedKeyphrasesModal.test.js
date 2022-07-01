import { shallow, mount } from "enzyme";
import SEMrushRelatedKeyphrasesModal from "../../src/components/SEMrushRelatedKeyphrasesModal";
import apiFetch from "../__mocks__/@wordpress/api-fetch";

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

			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const button = component.find( "#yoast-get-related-keyphrases-metabox" );

			button.simulate( "click" );

			expect( props.onOpen ).toHaveBeenCalled();
		} );

		it( "returns a message when no keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "",
				isLoggedIn: true,
			};

			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const button = component.find( "#yoast-get-related-keyphrases-metabox" );

			button.simulate( "click" );

			expect( props.onOpenWithNoKeyphrase ).toHaveBeenCalled();
		} );
	} );

	describe( "onModalClose", () => {
		it( "successfully calls the close method", () => {
			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			component.instance().onModalClose( { type: "not-blur" } );

			expect( props.onClose ).toHaveBeenCalled();
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

			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const button = component.find( "#yoast-get-related-keyphrases-metabox" );

			button.simulate(
				"click",
				{
					preventDefault: () => {},
					target: {
						href: button.href,
					},
				}
			);

			expect( global.open	).toHaveBeenCalled();
			expect( props.onOpenWithNoKeyphrase ).not.toHaveBeenCalled();
		} );

		it( "returns a message when no keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			props = {
				...props,
				keyphrase: "",
				isLoggedIn: false,
			};
			global.open = jest.fn();

			const component = shallow( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const button = component.find( "#yoast-get-related-keyphrases-metabox" );

			button.simulate(
				"click",
				{
					preventDefault: () => {},
					target: {
						href: button.href,
					},
				}
			);

			expect( props.onOpenWithNoKeyphrase ).toHaveBeenCalled();
			expect( global.open	).not.toHaveBeenCalled();
		} );
	} );

	describe( "listenToMessages",  () => {
		it( "successfully performs authentication and opens the modal when the user " +
			"has approved the authorization", async () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};

			const component = mount( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const instance = component.instance();
			instance.popup = { close: () => {} };

			await instance.listenToMessages( {
				origin: "https://oauth.semrush.com",
				source: instance.popup,
				data: {
					type: "semrush:oauth:success",
					url: "https://oauth.semrush.com/oauth2/yoast/success?code=abcdefghijklmnopqrstuvwxyz1234567890abcd",
				},
			} );

			expect( props.onAuthentication ).toHaveBeenCalledWith( true );
			expect( props.onOpen ).toHaveBeenCalled();
		} );

		it( "doesn't perform authentication nor opens the modal when there have been problems with getting the tokens", async () => {
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

			const component = mount( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const instance = component.instance();
			instance.popup = { close: () => {} };
			console.error = jest.fn();

			await instance.listenToMessages( {
				origin: "https://oauth.semrush.com",
				source: instance.popup,
				data: {
					type: "semrush:oauth:success",
					url: "https://oauth.semrush.com/oauth2/yoast/success?code=abcdefghijklmnopqrstuvwxyz1234567890abcd",
				},
			} );

			expect( props.onAuthentication ).not.toHaveBeenCalled();
			expect( props.onOpen ).not.toHaveBeenCalled();
		} );

		it( "doesn't perform authentication nor opens the modal when the message has a malformed URL", async () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};

			const component = mount( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const instance = component.instance();
			instance.popup = { close: () => {} };
			console.error = jest.fn();

			await instance.listenToMessages( {
				origin: "https://oauth.semrush.com",
				source: instance.popup,
				data: {
					type: "semrush:oauth:success",
					url: "",
				},
			} );

			expect( props.onAuthentication ).not.toHaveBeenCalled();
			expect( props.onOpen ).not.toHaveBeenCalled();
		} );

		it( "do not open the modal when the user has denied the authorization", () => {
			props = {
				...props,
				keyphrase: "yoast seo",
				isLoggedIn: false,
			};

			const component = mount( <SEMrushRelatedKeyphrasesModal { ...props } /> );
			const instance = component.instance();
			instance.popup = { close: () => {} };

			instance.listenToMessages( {
				origin: "https://oauth.semrush.com",
				source: instance.popup,
				data: {
					type: "semrush:oauth:denied",
					url: "https://oauth.semrush.com/oauth2/yoast/success?code=abcdefghijklmnopqrstuvwxyz1234567890abcd",
				},
			} );

			expect( props.onAuthentication ).toHaveBeenCalledWith( false );
			expect( props.onOpenWithNoKeyphrase ).not.toHaveBeenCalled();
			expect( props.onOpen ).not.toHaveBeenCalled();
		} );
	} );
} );
