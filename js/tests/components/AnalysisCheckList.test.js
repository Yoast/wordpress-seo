import { shallow } from "enzyme";
import AnalysisChecklist from "../../src/components/AnalysisChecklist";

describe( "The AnalysisChecklist component", () => {
	it( "renders a checklist with an introduction text indicating that there is room for improvement when not all checks are good", () => {
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

		const checklist = shallow( <AnalysisChecklist checklist={ checks } onClick={ onClick } shouldShowIntro={ true } /> );

		const introductionText = checklist.find( "p" );

		expect( introductionText.text() ).toEqual( "We've analyzed your post. There is still room for improvement!" );

		const checklistItems = checklist.find( "AnalysisCheck" );

		expect( checklistItems ).toHaveLength( 3 );
	} );

	it( "renders a checklist with an introduction text indicating that there everything is OK when all checks are good", () => {
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

		const checklist = shallow( <AnalysisChecklist checklist={ checks } onClick={ onClick } shouldShowIntro={ true } /> );

		const introductionText = checklist.find( "p" );

		expect( introductionText.text() ).toEqual( "We've analyzed your post. Everything looks good. Well done!" );

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
