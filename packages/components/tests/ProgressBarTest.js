import React from "react";
import { render } from "@testing-library/react";

import ProgressBar from "../src/ProgressBar";

describe( "The Progressbar component", () => {
	it( "without any props matches the snapshot", () => {
		const { container } = render(
			<ProgressBar />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "with progress matches the snapshot", () => {
		const { container } = render(
			<ProgressBar max={ 100 } value={ 50 } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );

	it( "with custom color matches the snapshot", () => {
		const { container } = render(
			<ProgressBar progressColor="#000" max={ 100 } value={ 50 } />
		);

		expect( container.firstChild ).toMatchSnapshot();
	} );
} );
