/* eslint-disable require-jsdoc */
import { useState, useCallback } from "@wordpress/element";
import { noop } from "lodash";
import { Modal } from "@yoast/ui-library";

import Welcome from "./welcome";
import About from "./about";
import Audience from "./audience";
import Schema from "./schema";
import Layout from "./layout";
import Finish from "./finish";

const stepComponents = {
	welcome: Welcome,
	about: About,
	schema: Schema,
	audience: Audience,
	layout: Layout,
	finish: Finish,
};

const WritingGuide = () => {
	const [ activeStep, setActiveStep ] = useState( "welcome" );
	const [ completedSteps, setCompletedSteps ] = useState( "welcome" );
	const ActiveStep = stepComponents[ activeStep ];

	return (
		<Modal isOpen={ true } onClose={ noop }>
			This is a modal
			<ActiveStep setActiveStep={ setActiveStep } />
		</Modal>
	);
};

export default WritingGuide;
