import React from "react";
import renderer from "react-test-renderer";
import AnalysisResult from "../src/AnalysisResult.js";

test( "the AnalysisResult component matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabel="SEOResult"
			bulletColor="blue"
			buttonId="Result button"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClick={ () => {} }
			text={ "You're doing great!" }
			score="good"
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with html in the text matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabel="SEOResult"
			bulletColor="blue"
			buttonId="Result button"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClick={ () => {} }
			text={ "You're doing <b>great!</b>" }
			score="good"
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with disabled buttons matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabel="SEOResult"
			bulletColor="blue"
			buttonId="Result button"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClick={ () => {} }
			text={ "You're doing great!" }
			score="good"
			marksButtonStatus={ "disabled" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with hidden buttons matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabel="SEOResult"
			bulletColor="blue"
			buttonId="Result button"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClick={ () => {} }
			text={ "You're doing great!" }
			score="good"
			marksButtonStatus={ "hidden" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with suppressed text matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabel="SEOResult"
			bulletColor="blue"
			suppressedText={ true }
			buttonId="Result button"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClick={ () => {} }
			text={ "You're doing great!" }
			score="good"
			marksButtonStatus={ "hidden" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
