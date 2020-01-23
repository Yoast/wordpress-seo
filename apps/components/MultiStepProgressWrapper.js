import React from "react";
import styled from "styled-components";

const Container = styled.div`
	background-color: white;
`;

import {
	MultiStepProgress,
} from "@yoast/components";

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
	{
		status: "running",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		id: "running-2",
	},
];

const MultiStepProgressWrapper = () => {
	return (
		<Container>
			<MultiStepProgress steps={ steps } />
		</Container>
	);
};

export default MultiStepProgressWrapper;
