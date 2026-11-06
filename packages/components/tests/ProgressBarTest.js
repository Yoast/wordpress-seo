import React, { act } from "react";
import renderer from "react-test-renderer";

import ProgressBar from "../src/ProgressBar";

describe( "The Progressbar component", () => {
	it( "without any props matches the snapshot", () => {
		let component;
		act( () => {
			component = renderer.create(
				<ProgressBar />
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "with progress matches the snapshot", () => {
		let component;
		act( () => {
			component = renderer.create(
				<ProgressBar max={ 100 } value={ 50 } />
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "with custom color matches the snapshot", () => {
		let component;
		act( () => {
			component = renderer.create(
				<ProgressBar progressColor="#000" max={ 100 } value={ 50 } />
			);
		} );

		const tree = component.toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
