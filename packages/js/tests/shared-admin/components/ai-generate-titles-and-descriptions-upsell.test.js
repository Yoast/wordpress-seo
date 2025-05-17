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
		const { container } = render( <AiGenerateTitlesAndDescriptionsUpsell { ...props } /> );
		expect( container ).toMatchSnapshot();
	} );

	it( "renders the component correctly for custom props", () => {
		const { container } = render( <AiGenerateTitlesAndDescriptionsUpsell
			{ ...props }
			title="Custom title"
			newToText="Custon new to text"
			bundleNote="Custom bundle note"
			isProductCopy={ true }
		/> );
		expect( container ).toMatchSnapshot();
	} );
} );
