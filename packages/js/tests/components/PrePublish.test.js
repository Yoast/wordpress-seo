import { shallow } from "enzyme";

import PrePublish from "../../src/components/PrePublish";

describe( "The PrePublish component", () => {
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

		const checklist = shallow( <PrePublish checklist={ checks } onClick={ onClick } /> );

		const introductionText = checklist.find( "p" );
		expect( introductionText.text() ).toEqual( "We've analyzed your post. There is still room for improvement!" );
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

		const checklist = shallow( <PrePublish checklist={ checks } onClick={ onClick } /> );

		const introductionText = checklist.find( "p" );
		expect( introductionText.text() ).toEqual( "We've analyzed your post. Everything looks good. Well done!" );
	} );
} );
