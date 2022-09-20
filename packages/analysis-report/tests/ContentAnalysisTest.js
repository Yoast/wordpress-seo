import React from "react";
import renderer from "react-test-renderer";
import ContentAnalysis from "../src/ContentAnalysis.js";

const problemsResults = [
	{
		text: "Your text is bad, and you should feel bad.",
		id: "1",
		rating: "bad",
		hasMarks: true,
		hasJumps: true,
		editFieldName: "some field",
	},
];

const goodResults = [
	{
		text: "You're doing great!",
		id: "2",
		rating: "good",
		hasMarks: false,
		hasJumps: false,
		editFieldName: "",
	},
	{
		text: "Woohoo!",
		id: "3",
		rating: "good",
		hasMarks: true,
		hasJumps: false,
		editFieldName: "",
	},
];

const improvementsResults = [
	{
		text: "I know you can do better! You can do it!",
		id: "4",
		rating: "OK",
		hasMarks: false,
		hasJumps: false,
		editFieldName: "",
	},
];

const errorsResults = [
	{
		text: "Error: Analysis not loaded",
		id: "5",
		rating: "feedback",
		hasMarks: false,
		hasJumps: false,
		editFieldName: "",
	},
];

const considerationsResults = [
	{
		text: "Maybe you should change this...",
		id: "6",
		rating: "feedback",
		hasMarks: false,
		hasJumps: false,
		editFieldName: "",
	},
];

const upsellResults = [
	{
		text: "Improve your analysis!",
		id: "7",
		rating: "upsell",
		hasMarks: false,
		hasJumps: false,
		editFieldName: "",
	},
];

describe( "ContentAnalysis", () => {
	it( "the ContentAnalysis component without language notice matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems and improvements matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ [] }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems, improvements and considerations matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ [] }
				goodResults={ goodResults }
				considerationsResults={ [] }
				errorsResults={ errorsResults }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component without problems and considerations, but with improvements and good matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ [] }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ [] }
				errorsResults={ errorsResults }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with specified header level matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				headingLevel={ 3 }
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with disabled buttons matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
				marksButtonStatus={ "disabled" }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with hidden buttons matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
				marksButtonStatus={ "hidden" }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with upsell results matches the snapshot", () => {
		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				upsellResults={ upsellResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "the ContentAnalysis component with custom result category labels matches the snapshot", () => {
		const resultCategoryLabels = {
			considerations: "Some considerations",
			goodResults: "Well done!",
		};

		const component = renderer.create(
			<ContentAnalysis
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				goodResults={ goodResults }
				considerationsResults={ considerationsResults }
				errorsResults={ errorsResults }
				resultCategoryLabels={ resultCategoryLabels }
			/>
		);

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
