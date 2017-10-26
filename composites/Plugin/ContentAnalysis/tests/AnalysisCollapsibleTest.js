import React from "react";
import renderer from "react-test-renderer";
import AnalysisCollapsible from "../components/AnalysisCollapsible";

test( "the default AnalysisCollapsible matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisCollapsible title="Problems">
			<li> First item </li>
			<li> Second item </li>
			<li> Third item </li>
			<li> Fourth item </li>
		</AnalysisCollapsible>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisCollapsible with a heading matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisCollapsible title="Problems" hasHeading={ true }>
			<li> First item </li>
			<li> Second item </li>
			<li> Third item </li>
			<li> Fourth item </li>
		</AnalysisCollapsible>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisCollapsible in opened state matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisCollapsible title="Problems" initialIsOpen={ true }>
			<li> First item </li>
			<li> Second item </li>
			<li> Third item </li>
			<li> Fourth item </li>
		</AnalysisCollapsible>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );


