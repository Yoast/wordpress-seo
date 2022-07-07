import React from "react";
import renderer from "react-test-renderer";
import { noop } from "lodash";
import AnalysisResult from "../src/AnalysisResult.js";

test( "the AnalysisResult component matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
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
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
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
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
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
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
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
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			suppressedText={ true }
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "You're doing great!" }
			score="good"
			marksButtonStatus={ "hidden" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisResult component with a beta badge label matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisResult
			ariaLabelMarks="SEOResult"
			ariaLabelEdit="SEOResultEdit"
			bulletColor="blue"
			buttonIdMarks="Result button"
			buttonIdEdit="Result button edit"
			pressed={ true }
			hasMarksButton={ true }
			onButtonClickMarks={ noop }
			onButtonClickEdit={ noop }
			text={ "This is beta!" }
			score="good"
			marksButtonStatus={ "hidden" }
			hasBetaBadgeLabel={ true }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
