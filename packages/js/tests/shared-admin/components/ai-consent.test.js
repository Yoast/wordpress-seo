import { AiConsent } from "../../../src/shared-admin/components/ai-consent";
import { fireEvent, render } from "../../test-utils";

describe( "AiConsent", () => {
	const props = {
		onGiveConsent: jest.fn(),
		learnMoreLink: "https://yoa.st/a-generator-learn-more",
		privacyPolicyLink: "https://yoa.st/ai-generator-privacy-policy",
		termsOfServiceLink: "https://yoa.st/ai-generator-terms-of-service",
		imageLink: "https://example.com/ai-consent.png",
	};

	it( "match snapshot", () => {
		const { container } = render(
			<AiConsent { ...props } />
		);
		expect( container ).toMatchSnapshot();
	} );

	it( "renders the right links", () => {
		const { getByRole } = render(
			<AiConsent { ...props } />
		);

		const learnMoreLink = getByRole( "link", { name: /learn more/i } );
		const privacyPolicyLink = getByRole( "link", { name: /privacy policy/i } );
		const termsOfServiceLink = getByRole( "link", { name: /terms of service/i } );

		expect( learnMoreLink ).toHaveAttribute( "href", props.learnMoreLinkearnMoreLink );
		expect( privacyPolicyLink ).toHaveAttribute( "href", props.privacyPolicyLinkrivacyPolicyLink );
		expect( termsOfServiceLink ).toHaveAttribute( "href", props.termsOfServiceLinkermsOfServiceLink );
	} );

	it( "renders the right image", () => {
		const { getByRole } = render(
			<AiConsent { ...props } />
		);
		const image = getByRole( "presentation" );
		expect( image ).toHaveAttribute( "src", props.imageLink );
	} );

	it( "default state is without consent", async() => {
		const { getByRole } = render(
			<AiConsent { ...props } />
		);
		const consentCheckbox = getByRole( "checkbox" );
		expect( consentCheckbox ).not.toBeChecked();
		fireEvent.change( consentCheckbox, { target: { checked: true } } );
		expect( consentCheckbox ).toBeChecked();
	} );

	it( "calls onGiveConsent when the consent is given", async() => {
		const { getByRole } = render(
			<AiConsent { ...props } />
		);

		const consentCheckbox = getByRole( "checkbox" );
		fireEvent.click( consentCheckbox );
		expect( consentCheckbox ).toBeChecked();

		const giveConsentButton = getByRole( "button", { name: /grant consent/i } );
		fireEvent.click( giveConsentButton );
		expect( props.onGiveConsent ).toHaveBeenCalled();
	} );
} );
