import { render } from "../../test-utils";
import { AiFixAssessmentsUpsell } from "../../../src/shared-admin/components/ai-fix-assessments-upsell";

describe( "AiFixAssessmentsUpsell", () => {
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
		const { container } = render( <AiFixAssessmentsUpsell { ...props } /> );
		expect( container ).toMatchSnapshot();
	} );
} );
