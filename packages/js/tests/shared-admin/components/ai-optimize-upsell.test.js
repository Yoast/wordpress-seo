import { render } from "../../test-utils";
import { AIOptimizeUpsell } from "../../../src/shared-admin/components";

describe( "AiOptimizeUpsell", () => {
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

	it( "renders the component correctly", () => {
		const { container } = render( <AIOptimizeUpsell { ...props } /> );
		expect( container ).toMatchSnapshot();
	} );
} );
