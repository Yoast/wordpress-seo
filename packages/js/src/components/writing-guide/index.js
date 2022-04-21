/* eslint-disable require-jsdoc */
import { useState, useCallback } from "@wordpress/element";
import { noop } from "lodash";
import { Modal } from "@yoast/ui-library";

const STEPS = {
	welcome: "welcome",
	about: "about",
	schema: "schema",
	audience: "audience",
	layout: "layout",
	finish: "finish",
};

const WritingGuide = () => {
	const [ activeStep, setIsActiveStep ] = useState( STEPS.welcome );

	return (
		<Modal isOpen={ true } onClose={ noop }>
			This is a modal
		</Modal>
	);
};

export default WritingGuide;
