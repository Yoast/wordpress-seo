import React, { useEffect } from "react";
import { Button, useToggleState } from "@yoast/ui-library";
import { Modal } from ".";
import { component } from "./docs";
import { noop } from "lodash";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	args: {
		onClose: noop,
		isOpen: false,
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
	render: ( args ) => {
		const { isOpen } = args;
		const [ open, toggleOpen, setOpen ] = useToggleState( isOpen );

		useEffect( () => {
			setOpen( isOpen );
		}, [ isOpen ] );
		return ( <>
			<Button onClick={ toggleOpen }>
				Open Modal
			</Button>
			<Modal { ...args } isOpen={ open } onClose={ toggleOpen }> Hello World! </Modal></> );
	},
};
