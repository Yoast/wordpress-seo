import { shallow } from "enzyme";
import AnalysisChecklist from "../../src/components/AnalysisChecklist";

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

		const checklist = shallow( <AnalysisChecklist checklist={ checks } onClick={ onClick } /> );

		const checklistItems = checklist.find( "AnalysisCheck" );
		expect( checklistItems ).toHaveLength( 3 );

		const buttons = checklist.find( "Button" );
		expect( buttons ).toHaveLength( 1 );
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

		const checklist = shallow( <AnalysisChecklist checklist={ checks } onClick={ onClick } /> );

		const checklistItems = checklist.find( "AnalysisCheck" );
		expect( checklistItems ).toHaveLength( 2 );
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

		const checklist = shallow( <AnalysisChecklist checklist={ checks } onClick={ onClick } shouldShowIntro={ true } /> );

		checklist.find( "Button" ).simulate( "click" );

		expect( onClick ).toHaveBeenCalled();
	} );
} );
