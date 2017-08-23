import React from "react";
import renderer from "react-test-renderer";
import AnalysisCollapsible from "../components/AnalysisCollapsible";

test( "the default AnalysisCollapsible matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisCollapsible headerId="AnalysisProblems" title="Problems" isOpen={ false } onOpen={ () => 5 }>
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
		<AnalysisCollapsible headerId="AnalysisProblems" title="Problems" isOpen={ true } onOpen={ () => 5 }>
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


