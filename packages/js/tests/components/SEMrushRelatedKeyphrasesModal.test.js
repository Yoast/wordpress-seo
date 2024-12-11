import apiFetch from "@wordpress/api-fetch";
import SEMrushRelatedKeyphrasesModal from "../../src/components/SEMrushRelatedKeyphrasesModal";
import { fireEvent, render, screen, waitFor } from "../test-utils";

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
			newRequest: jest.fn(),
		};
	} );

	describe( "onModalOpen", () => {
		it( "successfully opens the modal when the user is logged in, " +
			"a keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="yoast seo" isLoggedIn={ true } /> );

			const openModalButton = screen.getByRole( "button" );
			expect( openModalButton ).toHaveTextContent( "Get related keyphrases" );
			fireEvent.click( openModalButton );

			expect( props.onOpen ).toHaveBeenCalledWith( props.location );
		} );

		it( "returns a message when no keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="" isLoggedIn={ true } /> );

			const openModalButton = screen.getByRole( "button" );
			expect( openModalButton ).toHaveTextContent( "Get related keyphrases" );
			fireEvent.click( openModalButton );

			expect( props.onOpenWithNoKeyphrase ).toHaveBeenCalled();
		} );
	} );

	describe( "onLinkClick", () => {
		it( "successfully opens the popup when the user is not logged in, " +
			"a keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			global.open = jest.fn();

			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="yoast seo" isLoggedIn={ false } /> );

			fireEvent.click( screen.getByRole( "link" ) );

			expect( global.open ).toHaveBeenCalled();
			expect( props.onOpenWithNoKeyphrase ).not.toHaveBeenCalled();
		} );

		it( "returns a message when no keyphrase is present and the 'Get related keyphrases' button is clicked", () => {
			global.open = jest.fn();

			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="" isLoggedIn={ false } /> );

			fireEvent.click( screen.getByRole( "link" ) );

			expect( props.onOpenWithNoKeyphrase ).toHaveBeenCalled();
			expect( global.open ).not.toHaveBeenCalled();
		} );
	} );

	describe( "listenToMessages", () => {
		it( "successfully performs authentication and opens the modal when the user has approved the authorization", async() => {
			const popup = {
				focus: jest.fn(),
				close: jest.fn(),
			};
			global.open = jest.fn().mockReturnValue( popup );

			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="yoast seo" isLoggedIn={ false } /> );

			fireEvent.click( screen.getByRole( "link" ) );
			fireEvent( global, new MessageEvent( "message", {
				origin: "https://oauth.semrush.com",
				source: popup,
				data: {
					type: "semrush:oauth:success",
					url: "https://oauth.semrush.com/oauth2/yoast/success?code=abcdefghijklmnopqrstuvwxyz1234567890abcd",
				},
			} ) );

			await waitFor( () => {
				expect( props.onAuthentication ).toHaveBeenCalled();
			}, { timeout: 1000 } );

			expect( props.onAuthentication ).toHaveBeenCalledWith( true );
			expect( props.onOpen ).toHaveBeenCalled();
		} );

		it( "doesn't perform authentication nor opens the modal when there have been problems with getting the tokens", async() => {
			apiFetch.mockImplementation( () => Promise.resolve( {
				error: "Error returned by apiFetch",
				status: 400,
			} ) );
			console.error = jest.fn();
			const popup = {
				focus: jest.fn(),
				close: jest.fn(),
			};
			global.open = jest.fn().mockReturnValue( popup );

			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="yoast seo" isLoggedIn={ false } /> );

			fireEvent.click( screen.getByRole( "link" ) );
			fireEvent( global, new MessageEvent( "message", {
				origin: "https://oauth.semrush.com",
				source: popup,
				data: {
					type: "semrush:oauth:success",
					url: "https://oauth.semrush.com/oauth2/yoast/success?code=abcdefghijklmnopqrstuvwxyz1234567890abcd",
				},
			} ) );

			await waitFor( () => {
				expect( console.error ).toHaveBeenCalledWith( "Error returned by apiFetch" );
			}, { timeout: 1000 } );

			expect( props.onAuthentication ).not.toHaveBeenCalled();
			expect( props.onOpen ).not.toHaveBeenCalled();
		} );

		it( "doesn't perform authentication nor opens the modal when the message has a malformed URL", async() => {
			console.error = jest.fn();
			const popup = {
				focus: jest.fn(),
				close: jest.fn(),
			};
			global.open = jest.fn().mockReturnValue( popup );

			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="yoast seo" isLoggedIn={ false } /> );

			fireEvent.click( screen.getByRole( "link" ) );
			fireEvent( global, new MessageEvent( "message", {
				origin: "https://oauth.semrush.com",
				source: popup,
				data: {
					type: "semrush:oauth:success",
					url: "",
				},
			} ) );

			await waitFor( () => {
				expect( console.error ).toHaveBeenCalledWith( "Invalid URL: " );
			}, { timeout: 1000 } );

			expect( props.onAuthentication ).not.toHaveBeenCalled();
			expect( props.onOpen ).not.toHaveBeenCalled();
		} );

		it( "do not open the modal when the user has denied the authorization", async() => {
			console.error = jest.fn();
			const popup = {
				focus: jest.fn(),
				close: jest.fn(),
			};
			global.open = jest.fn().mockReturnValue( popup );

			render( <SEMrushRelatedKeyphrasesModal { ...props } keyphrase="yoast seo" isLoggedIn={ false } /> );

			fireEvent.click( screen.getByRole( "link" ) );
			fireEvent( global, new MessageEvent( "message", {
				origin: "https://oauth.semrush.com",
				source: popup,
				data: {
					type: "semrush:oauth:denied",
					url: "https://oauth.semrush.com/oauth2/yoast/success?code=abcdefghijklmnopqrstuvwxyz1234567890abcd",
				},
			} ) );

			await waitFor( () => {
				expect( props.onAuthentication ).toHaveBeenCalled();
			}, { timeout: 1000 } );

			expect( props.onAuthentication ).toHaveBeenCalledWith( false );
			expect( props.onOpenWithNoKeyphrase ).not.toHaveBeenCalled();
			expect( props.onOpen ).not.toHaveBeenCalled();
		} );
	} );
} );
