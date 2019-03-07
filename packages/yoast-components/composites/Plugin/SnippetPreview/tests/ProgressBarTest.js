import React from "react";
import renderer from "react-test-renderer";

import ProgressBar from "../components/ProgressBar";

test( "the progress bar matches the snapshot", () => {
	const component = renderer.create(
		<ProgressBar />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the progress bar with progress matches the snapshot", () => {
	const component = renderer.create(
		<ProgressBar max={ 100 } value={ 50 } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the progress bar with custom color matches the snapshot", () => {
	const component = renderer.create(
		<ProgressBar progressColor="#000" max={ 100 } value={ 50 } />
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
