import { render } from "../../test-utils";
import { UpsellModalContent } from "../../../src/ai-generator/components/upsell-modal-content";

describe( "UpsellModalContent", () => {
	it( "renders the component correctly for default props", () => {
		const { getByText } = render( <UpsellModalContent /> );
		expect( getByText( "Use AI to generate your titles & descriptions!" ) ).toBeInTheDocument();
		expect( getByText( "Yoast SEO Premium" ) ).toBeInTheDocument();
	} );

	it( "renders the component correctly for custom props", () => {
		const { getByText } = render( <UpsellModalContent /> );
		expect( getByText( "Custom title" ) ).toBeInTheDocument();
		expect( getByText( "Custom new to text" ) ).toBeInTheDocument();
		expect( getByText( "Custom bundle note" ) ).toBeInTheDocument();
	} );

	it( "should call setTryAi when the 'Try for free' button is clicked", () => {
		const setTryAi = jest.fn();
		const { getByText } = render( <UpsellModalContent /> );
		getByText( "Try for free" ).click();
		expect( setTryAi ).toHaveBeenCalled();
	} );

	it( "should show the alert when isLimitReached is true and the 'try for free' button is not rendered", () => {
		const { getByText, queryByText } = render( <UpsellModalContent /> );
		expect( getByText( "Oh no! Its seems like you're out of free Sparks. Keep the momentum going, unlock unlimited sparks with Yoast SEO Premium!" ) ).toBeInTheDocument();
		expect( queryByText( "Try for free" ) ).not.toBeInTheDocument();
	} );
} );
