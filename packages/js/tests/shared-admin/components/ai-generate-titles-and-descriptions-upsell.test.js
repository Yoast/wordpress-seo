import { render } from "../../test-utils";
import { AiGenerateTitlesAndDescriptionsUpsell } from "../../../src/shared-admin/components/ai-generate-titles-and-descriptions-upsell";

describe( "AiGenerateTitlesAndDescriptionsUpsell", () => {
	const props = {
		learnMoreLink: "https://example.com/learn-more",
		thumbnail: {
			src: "thumbnail.jpg",
			width: "100",
			height: "100",
		},
		wistiaEmbedPermission: {
			value: true,
			status: "granted",
			set: jest.fn(),
		},
		upsellLink: "https://example.com/upsell",
		upsellLabel: "Test Upsell Label",
	};

	it( "renders the component correctly for default props", () => {
		const { getByText } = render( <AiGenerateTitlesAndDescriptionsUpsell { ...props } /> );
		expect( getByText( "Use AI to generate your titles & descriptions!" ) ).toBeInTheDocument();
		expect( getByText( "Yoast SEO Premium" ) ).toBeInTheDocument();
	} );

	it( "renders the component correctly for custom props", () => {
		const { getByText } = render( <AiGenerateTitlesAndDescriptionsUpsell
			{ ...props }
			title="Custom title"
			newToText="Custom new to text"
			bundleNote="Custom bundle note"
			isProductCopy={ true }
		/> );
		expect( getByText( "Custom title" ) ).toBeInTheDocument();
		expect( getByText( "Custom new to text" ) ).toBeInTheDocument();
		expect( getByText( "Custom bundle note" ) ).toBeInTheDocument();
	} );

	it( "should call hideUpsell when the 'Try for free' button is clicked", () => {
		const hideUpsell = jest.fn();
		const { getByText } = render( <AiGenerateTitlesAndDescriptionsUpsell { ...props } hideUpsell={ hideUpsell } /> );
		getByText( "Try for free" ).click();
		expect( hideUpsell ).toHaveBeenCalled();
	} );

	it( "should show the alert when isLimitReached is true and the 'try for free' button is not rendered", () => {
		const { getByText, queryByText } = render( <AiGenerateTitlesAndDescriptionsUpsell { ...props } isLimitReached={ true } /> );
		expect( getByText( "Oh no! Its seems like you're out of free Sparks. Keep the momentum going, unlock unlimited sparks with Yoast SEO Premium!" ) ).toBeInTheDocument();
		expect( queryByText( "Try for free" ) ).not.toBeInTheDocument();
	} );
} );
