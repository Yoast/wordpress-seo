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
		const [ { className, currentStep }, updateArgs ] = useArgs();

		const handleNext = useCallback( () => {
			if ( currentStep < steps.length - 1 ) {
				setIsComplete( false );
				updateArgs( { currentStep: currentStep + 1 } );
			} else if ( currentStep === steps.length - 1 && ! isComplete ) {
				setIsComplete( true );
			} else if ( isComplete ) {
				setIsComplete( false );
				updateArgs( { currentStep: 0 } );
			}
		}, [ setIsComplete, updateArgs, isComplete, currentStep ] );

		return <>
			<Stepper className={ className } currentStep={ currentStep }>
				{ steps.map( ( step, index ) => <Stepper.Step
					key={ step }
					isComplete={ currentStep > index || isComplete }
					isActive={ currentStep === index }
				>
					{ step }
				</Stepper.Step> ) }

			</Stepper>

			<Button id="yst-stepper-button" onClick={ handleNext }>
				{ currentStep < steps.length - 1 && "Next" }
				{ currentStep === steps.length - 1 && ! isComplete && "Finish" }
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
		currentStep: { control: "number" },
	},
	parameters: {
		docs: {
			description: { component },
		},
	},
	args: {
		className: "yst-mb-5",
		currentStep: 0,
	},
};
