import React from "react";
import renderer from "react-test-renderer";
import AnalysisHeader from "../components/AnalysisCollapsible";

test( "the default AnalysisCollapsible matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisCollapsible title="Problems">
			<ul>
				<li> First item </li>
				<li> Second item </li>
				<li> Third item </li>
				<li> Fourth item </li>
			</ul>
		</AnalysisCollapsible>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisCollapsible in opened state matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisCollapsible title="Problems" isOpen={true}>
			<ul>
				<li> First item </li>
				<li> Second item </li>
				<li> Third item </li>
				<li> Fourth item </li>
			</ul>
		</AnalysisCollapsible>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );


