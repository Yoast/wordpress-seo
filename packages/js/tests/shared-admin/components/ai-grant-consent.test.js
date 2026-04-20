import { useDispatch, useSelect } from "@wordpress/data";
import { AiGrantConsent } from "../../../src/shared-admin/components/ai-grant-consent";
import { fireEvent, render, waitFor } from "../../test-utils";

jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	useSelect: jest.fn(),
} ) );

const LINK_STORE = "link-store";
const CONSENT_STORE = "consent-store";

const DEFAULT_LINKS = {
	termsOfService: "https://yoa.st/ai-generator-terms-of-service",
	privacyPolicy: "https://yoa.st/ai-generator-privacy-policy",
	learnMore: "https://yoa.st/ai-generator-learn-more",
};

describe( "AiGrantConsent", () => {
	let selectLinkMock;
	let selectImageLinkMock;
	let selectEndpointMock;
	let storeAiGeneratorConsentMock;
	let onConsentGrantedMock;

	// Builds a `select( storeName )` mock. The link-store serves link/image selectors
	// while the consent-store serves the consent endpoint selector.
	const buildSelectFn = () => ( storeName ) => {
		if ( storeName === LINK_STORE ) {
			return {
				selectLink: selectLinkMock,
				selectImageLink: selectImageLinkMock,
			};
		}
		if ( storeName === CONSENT_STORE ) {
			return {
				selectAiGeneratorConsentEndpoint: selectEndpointMock,
			};
		}
		return {};
	};

	beforeEach( () => {
		// Each link URL is echoed back as "resolved:<url>" so tests can assert the exact URL passed in.
		selectLinkMock = jest.fn( ( url ) => `resolved:${ url }` );
		selectImageLinkMock = jest.fn( ( name ) => `image:${ name }` );
		selectEndpointMock = jest.fn( () => "https://example.test/consent-endpoint" );
		storeAiGeneratorConsentMock = jest.fn().mockResolvedValue( undefined );
		onConsentGrantedMock = jest.fn();

		useSelect.mockImplementation( ( selector ) => selector( buildSelectFn() ) );
		useDispatch.mockReturnValue( { storeAiGeneratorConsent: storeAiGeneratorConsentMock } );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "uses the default link URLs when the links prop is omitted", () => {
		render(
			<AiGrantConsent
				storeName={ CONSENT_STORE }
				linkStoreName={ LINK_STORE }
				onConsentGranted={ onConsentGrantedMock }
			/>
		);

		expect( selectLinkMock ).toHaveBeenCalledWith( DEFAULT_LINKS.termsOfService );
		expect( selectLinkMock ).toHaveBeenCalledWith( DEFAULT_LINKS.privacyPolicy );
		expect( selectLinkMock ).toHaveBeenCalledWith( DEFAULT_LINKS.learnMore );
		expect( selectImageLinkMock ).toHaveBeenCalledWith( "ai-consent.png" );
	} );

	it( "applies link overrides passed via the links prop", () => {
		const overriddenTos = "https://example.test/custom-tos";
		render(
			<AiGrantConsent
				storeName={ CONSENT_STORE }
				linkStoreName={ LINK_STORE }
				onConsentGranted={ onConsentGrantedMock }
				links={ { termsOfService: overriddenTos } }
			/>
		);

		expect( selectLinkMock ).toHaveBeenCalledWith( overriddenTos );
		expect( selectLinkMock ).toHaveBeenCalledWith( DEFAULT_LINKS.privacyPolicy );
		expect( selectLinkMock ).toHaveBeenCalledWith( DEFAULT_LINKS.learnMore );
	} );

	it( "reads links from linkStoreName and the endpoint from storeName", () => {
		render(
			<AiGrantConsent
				storeName={ CONSENT_STORE }
				linkStoreName={ LINK_STORE }
				onConsentGranted={ onConsentGrantedMock }
			/>
		);

		expect( selectLinkMock ).toHaveBeenCalled();
		expect( selectImageLinkMock ).toHaveBeenCalled();
		expect( selectEndpointMock ).toHaveBeenCalled();
		expect( useDispatch ).toHaveBeenCalledWith( CONSENT_STORE );
	} );

	it( "dispatches storeAiGeneratorConsent with the endpoint and then calls onConsentGranted", async() => {
		const { getByRole } = render(
			<AiGrantConsent
				storeName={ CONSENT_STORE }
				linkStoreName={ LINK_STORE }
				onConsentGranted={ onConsentGrantedMock }
			/>
		);

		fireEvent.click( getByRole( "checkbox" ) );
		fireEvent.click( getByRole( "button", { name: /grant consent/i } ) );

		await waitFor( () => {
			expect( storeAiGeneratorConsentMock ).toHaveBeenCalledWith( true, "https://example.test/consent-endpoint" );
			expect( onConsentGrantedMock ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	it( "passes the resolved link and image URLs down to AiConsent", () => {
		const { getByRole } = render(
			<AiGrantConsent
				storeName={ CONSENT_STORE }
				linkStoreName={ LINK_STORE }
				onConsentGranted={ onConsentGrantedMock }
			/>
		);

		expect( getByRole( "link", { name: /terms of service/i } ) )
			.toHaveAttribute( "href", `resolved:${ DEFAULT_LINKS.termsOfService }` );
		expect( getByRole( "link", { name: /privacy policy/i } ) )
			.toHaveAttribute( "href", `resolved:${ DEFAULT_LINKS.privacyPolicy }` );
		expect( getByRole( "link", { name: /learn more/i } ) )
			.toHaveAttribute( "href", `resolved:${ DEFAULT_LINKS.learnMore }` );
		expect( getByRole( "presentation" ) ).toHaveAttribute( "src", "image:ai-consent.png" );
	} );
} );
