import React from "react";
import renderer from "react-test-renderer";

import MultiStepProgress from "../src/MultiStepProgress";

describe( "MultiStepProgress", () => {
	test( "the MultiStepProgress matches the snapshot", () => {
		const steps = [
			{
				status: "finished",
				text: "This task has finished.",
				id: "finished",
			},
			{
				status: "failed",
				text: "This task has failed.",
				id: "failed",
			},
			{
				status: "running",
				text: "This task is running.",
				id: "running",
			},
			{
				status: "pending",
				text: "This task is pending.",
				id: "pending",
			},
		];

		const tree = renderer.create(
			<MultiStepProgress steps={ steps } />
		).toJSON();

		expect( tree ).toMatchSnapshot();
	} );
} );
