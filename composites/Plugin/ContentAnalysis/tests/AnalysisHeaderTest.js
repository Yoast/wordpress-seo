import React from "react";
import renderer from "react-test-renderer";
import AnalysisHeader from "../components/AnalysisHeader";

test( "the default AnalysisHeader matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisHeader title="Problems">
			<ul>
				<li> First item </li>
				<li> Second item </li>
				<li> Third item </li>
				<li> Fourth item </li>
			</ul>
		</AnalysisHeader>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the AnalysisHeader in opened state matches the snapshot", () => {
	const component = renderer.create(
		<AnalysisHeader title="Problems" isOpen={true}>
			<ul>
				<li> First item </li>
				<li> Second item </li>
				<li> Third item </li>
				<li> Fourth item </li>
			</ul>
		</AnalysisHeader>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );


