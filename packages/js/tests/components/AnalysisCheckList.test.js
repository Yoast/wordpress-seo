import AnalysisChecklist from "../../src/components/AnalysisChecklist";
import { fireEvent, render, screen } from "../test-utils";

describe( "The AnalysisChecklist component", () => {
	it( "renders a checklist with a button when not all checks are good", () => {
		const checks = [
			{
				label: "Readability analysis:",
				score: "good",
				scoreValue: "Good",
			},
			{
				label: "SEO analysis:",
				score: "bad",
				scoreValue: "Needs improvement",
			},
			{
				label: "Schema analysis:",
				score: "good",
				scoreValue: "Good",
			},
		];
		const onClick = jest.fn();

		render( <AnalysisChecklist checklist={ checks } onClick={ onClick } /> );

		const checklistItems = document.querySelectorAll( ".yoast-analysis-check" );
		expect( checklistItems ).toHaveLength( 3 );

		const button = screen.getByRole( "button" );
		expect( button ).toBeInTheDocument();
		expect( button ).toHaveTextContent( "Improve your post with Yoast SEO" );
	} );

	it( "renders a checklist without a button when every check is good", () => {
		const checks = [
			{
				label: "Readability analysis:",
				score: "good",
				scoreValue: "Good",
			},
			{
				label: "SEO analysis:",
				score: "good",
				scoreValue: "Needs improvement",
			},
		];
		const onClick = jest.fn();

		render( <AnalysisChecklist checklist={ checks } onClick={ onClick } /> );

		const checklistItems = document.querySelectorAll( ".yoast-analysis-check" );
		expect( checklistItems ).toHaveLength( 2 );

		expect( screen.queryByRole( "button" ) ).not.toBeInTheDocument();
	} );

	it( "calls the onClick handler when the button is clicked", () => {
		const checks = [
			{
				label: "Readability analysis:",
				score: "good",
				scoreValue: "Good",
			},
			{
				label: "SEO analysis:",
				score: "bad",
				scoreValue: "Needs improvement",
			},
		];
		const onClick = jest.fn();

		render( <AnalysisChecklist checklist={ checks } onClick={ onClick } /> );
		fireEvent.click( screen.getByRole( "button" ) );

		expect( onClick ).toHaveBeenCalled();
	} );
} );
