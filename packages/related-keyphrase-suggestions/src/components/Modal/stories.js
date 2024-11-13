import React, { useState } from "react";
import { Modal } from ".";
import { component } from "./docs";
import { noop } from "lodash";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		onClose: noop,
		isOpen: true,
		insightsLink: "https://insights.semrush.com/",
		learnMoreLink: "https://learnmore.semrush.com/",
	},
};

export default {
	title: "1) Components/Modal",
	component: Modal,
	parameters: {
		docs: {
			description: { component },
		},
	},
	render: ( args ) => <Modal { ...args }> Hello World! </Modal>,
};
