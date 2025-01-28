import React, { useState, useCallback } from "react";
import { Stepper } from ".";
import { component } from "./docs";
import { Button } from "../../index";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	render: ( args ) =>{
		const [ currentStep, setCurrentStep ] = useState( 1 );
		const [ isComplete, setIsComplete ] = useState( false );
		const steps = [ "INSTALL", "ACTIVATE", "SET UP", "CONNECT" ];

		const handleNext = useCallback( () => {
			setCurrentStep( ( prevStep ) => {
				if ( isComplete ) {
					setIsComplete( false );
					return 1;
				}
				if ( prevStep === steps.length ) {
					setIsComplete( true );
					return prevStep;
				}
				return prevStep + 1;
			} );
		}, [ setIsComplete, setCurrentStep, isComplete ] );

		return <>
			<Stepper { ...args } numberOfSteps={ steps.length } currentStep={ currentStep }>
				{ steps.map( ( step, index ) => <Stepper.Step
					key={ step }
					label={ step }
					isComplete={ isComplete }
					isActive={ currentStep === index + 1 }
					isStepComplete={ currentStep > index + 1 || isComplete }
				/> ) }

			</Stepper>

			<Button id="yst-stepper-button" onClick={ handleNext }>
				{ currentStep < steps.length && "Next" }
				{ currentStep === steps.length && ! isComplete && "Finish" }
				{ isComplete && "Restart" }
			</Button>
		</>;
	},
};

export default {
	title: "2) Components/Stepper",
	component: Stepper,
	argTypes: {
		className: { control: false },
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
	args: {
		className: "yst-mb-5",
	},
};
