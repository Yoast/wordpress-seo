import React from "react";
import renderer from "react-test-renderer";

import IconAIFixesButton from "../src/IconAIFixesButton";

test( "the unpressed IconAIFixesButton matches the snapshot", () => {
	const component = renderer.create(
		<IconAIFixesButton
			name="group1"
			id="keyphraseDensityAIFixes"
			ariaLabel="Fix with AI"
			pressed={ false }
			disabled={ true }
			onClick={ () => {} }
			className={ "yoast-tooltip yoast-tooltip-w" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the pressed IconAIFixesButton matches the snapshot", () => {
	const component = renderer.create(
		<IconAIFixesButton
			name="group1"
			id="keyphraseInIntroductionAIFixes"
			ariaLabel="Fix with AI"
			pressed={ true }
			disabled={ false }
			onClick={ () => {} }
			className={ "yoast-tooltip yoast-tooltip-w" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

