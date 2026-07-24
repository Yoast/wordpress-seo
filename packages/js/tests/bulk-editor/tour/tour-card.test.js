import { fireEvent, render, screen } from "../../test-utils";
import { TourCard } from "../../../src/bulk-editor/components/tour/tour-card";

const baseProps = {
	id: "tour-step",
	title: "Select your content type",
	content: "This will refine the content.",
	currentStep: 1,
	totalSteps: 4,
	isLastStep: false,
	onNext: jest.fn(),
	onSkip: jest.fn(),
};

describe( "TourCard", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( "renders the title, content and step progress", () => {
		render( <TourCard { ...baseProps } /> );

		expect( screen.getByRole( "heading", { name: "Select your content type" } ) ).toBeInTheDocument();
		expect( screen.getByText( "This will refine the content." ) ).toBeInTheDocument();
		expect( screen.getByText( "1 / 4" ) ).toBeInTheDocument();
	} );

	it( "calls onNext when the Next button is clicked", () => {
		render( <TourCard { ...baseProps } /> );

		fireEvent.click( screen.getByRole( "button", { name: /Next/ } ) );

		expect( baseProps.onNext ).toHaveBeenCalledTimes( 1 );
	} );

	it( "omits the Back button on the first step and shows it with onBack", () => {
		const { rerender } = render( <TourCard { ...baseProps } /> );
		expect( screen.queryByRole( "button", { name: "Back" } ) ).not.toBeInTheDocument();

		const onBack = jest.fn();
		rerender( <TourCard { ...baseProps } currentStep={ 2 } onBack={ onBack } /> );
		fireEvent.click( screen.getByRole( "button", { name: "Back" } ) );

		expect( onBack ).toHaveBeenCalledTimes( 1 );
	} );

	it( "shows the finish label on the last step instead of Next", () => {
		render( <TourCard { ...baseProps } currentStep={ 4 } isLastStep={ true } /> );

		expect( screen.getByRole( "button", { name: "Got it!" } ) ).toBeInTheDocument();
		expect( screen.queryByRole( "button", { name: /Next/ } ) ).not.toBeInTheDocument();
	} );

	it( "ends the tour via onSkip when the close button is clicked", () => {
		render( <TourCard { ...baseProps } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Close the tour" } ) );

		expect( baseProps.onSkip ).toHaveBeenCalledTimes( 1 );
	} );
} );
