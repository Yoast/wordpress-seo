import React, { useState, useCallback } from "react";
import { useArgs } from "@storybook/preview-api";
import { Stepper } from ".";
import { component } from "./docs";
import { Button } from "../../index";

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	render: ( args ) =>{
		const [ isComplete, setIsComplete ] = useState( false );
		const steps = [ "INSTALL", "ACTIVATE", "SET UP", "CONNECT" ];
		const [ { numberOfSteps, className, currentStep }, updateArgs ] = useArgs();

		const handleNext = useCallback( () => {
			if ( currentStep < steps.length ) {
				setIsComplete( false );
				updateArgs( { currentStep: currentStep + 1 } );
			} else if ( currentStep === steps.length && ! isComplete ) {
				setIsComplete( true );
			} else if ( isComplete ) {
				setIsComplete( false );
				updateArgs( { currentStep: 1 } );
			}
		}, [ setIsComplete, updateArgs, isComplete, currentStep ] );

		return <>
			<Stepper className={ className } numberOfSteps={ numberOfSteps } currentStep={ currentStep }>
				{ steps.map( ( step, index ) => <Stepper.Step
					key={ step }
					label={ step }
					isComplete={ currentStep > index + 1 || isComplete }
					isActive={ currentStep === index + 1 }
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
		className: { control: "text" },
		numberOfSteps: { control: "number" },
		currentStep: { control: "number" },
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
	args: {
		className: "yst-mb-5",
		numberOfSteps: 4,
		currentStep: 1,
	},
};
