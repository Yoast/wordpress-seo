import React, { useState, useCallback } from "react";
import Stepper from ".";
import { component } from "./docs";
import Button from "../button/index";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	render: ( args ) =>{
		const [ currentStep, setCurrentStep ] = useState( 1 );
		const [ isComplete, setIsComplete ] = useState( false );

		const handleNext = useCallback( () => {
			setCurrentStep( ( prevStep ) => {
				if ( isComplete ) {
					setIsComplete( false );
					return 1;
				}
				if ( prevStep === args.steps.length ) {
					setIsComplete( true );
					return prevStep;
				}
				return prevStep + 1;
			} );
		}, [ setIsComplete, setCurrentStep, isComplete ] );

		return <>
			<Stepper { ...args } currentStep={ currentStep } isComplete={ isComplete } />

			<Button id="yst-stepper-button" onClick={ handleNext }>
				{ currentStep < args.steps.length && "Next" }
				{ currentStep === args.steps.length && ! isComplete && "Finish" }
				{ isComplete && "Restart" }
			</Button>
		</>;
	},
};

export default {
	title: "1) Elements/Stepper",
	component: Stepper,
	argTypes: {
		steps: { control: false },
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
	args: {
		steps: [ "INSTALL", "ACTIVATE", "SET UP", "CONNECT" ],
		className: "yst-mb-5",
	},
};
