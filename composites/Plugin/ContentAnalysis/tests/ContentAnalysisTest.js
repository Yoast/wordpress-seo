import React from "react";
import { createComponentWithIntl } from "../../../../utils/intlProvider";
import ContentAnalysis from "../components/ContentAnalysis.js";

const problemsResults = [
	{
		text: "Your text is bad, and you should feel bad.",
		id: "1",
		rating: "bad",
		hasMarks: true,
	},
];

const goodResults = [
	{
		text: "You're doing great!",
		id: "2",
		rating: "good",
		hasMarks: false,
	},
	{
		text: "Woohoo!",
		id: "3",
		rating: "good",
		hasMarks: true,
	},
];

const improvementsResults = [
	{
		text: "I know you can do better! You can do it!",
		id: "4",
		rating: "OK",
		hasMarks: false,
	},
];

const errorsResults = [
	{
		text: "Error: Analysis not loaded",
		id: "5",
		rating: "feedback",
		hasMarks: false,
	},
];

const considerationsResults = [
	{
		text: "Maybe you should change this...",
		id: "6",
		rating: "feedback",
		hasMarks: false,
	},
];

describe( "ContentAnalysis", () => {
	it( "the ContentAnalysis component without language notice matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems and improvements matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ [] }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems, improvements and considerations matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ [] }
				goodResults={ goodResults }
				considerationsResults={ [] }
				errorsResults={ errorsResults }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems and considerations, but with improvements and good matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ [] }
				errorsResults={ errorsResults }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with specified header level matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				headingLevel={ 3 }
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with disabled buttons matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
				marksButtonStatus={ "disabled" }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with hidden buttons matches the snapshot", () => {
		const component = createComponentWithIntl(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
				marksButtonStatus={ "hidden" }
			/>
		);

		let tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
