import React from "react";

import {
	MultiStepProgress,
} from "@yoast/components";

const steps = [
	{
		status: "finished",
		text: "This task has finished.",
	},
	{
		status: "failed",
		text: "This task has failed.",
	},
	{
		status: "running",
		text: "This task is running.",
	},
	{
		status: "pending",
		text: "This task is pending.",
	},
];

const MultiStepProgressWrapper = () => {
	return <MultiStepProgress steps={ steps } />;
};

export default MultiStepProgressWrapper;
