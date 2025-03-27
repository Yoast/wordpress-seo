import React, { useState, useCallback } from "react";
import { Stepper } from ".";
import { component, customStep } from "./docs";
import { Button } from "../../index";
import { CustomStep } from "./custom-step";


export default {
	title: "2) Components/Stepper",
	component: Stepper,
	argTypes: {
		className: { control: "text" },
		currentStep: { control: "number" },
		steps: { control: "object" },
		children: { control: "text" },
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

export const Factory = {
	parameters: {
		controls: { disable: false },
	},
	render: ( { className } ) =>{
		const [ isComplete, setIsComplete ] = useState( false );
		const steps = [ "INSTALL", "ACTIVATE", "SET UP", "CONNECT" ];
		const [ currentStep, setCurrentStep ] = useState( 0 );

		const handleNext = useCallback( () => {
			if ( currentStep < steps.length - 1 ) {
				setIsComplete( false );
				setCurrentStep( currentStep + 1 );
			} else if ( currentStep === steps.length - 1 && ! isComplete ) {
				setIsComplete( true );
			} else if ( isComplete ) {
				setIsComplete( false );
				setCurrentStep( 0 );
			}
		}, [ setIsComplete, setCurrentStep, isComplete, currentStep ] );

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

export const StepsProp = {
	parameters: {
		controls: { disable: false },
	},
	render: ( { className } ) => {
		const [ isComplete, setIsComplete ] = useState( false );
		const [ currentStep, setCurrentStep ] = useState( 0 );
		const [ stepsList, setStepsList ] = useState( [
			{ children: "INSTALL", isComplete: false, isActive: true },
			{ children: "ACTIVATE", isComplete: false, isActive: false },
			{ children: "SET UP", isComplete: false, isActive: false },
			{ children: "CONNECT", isComplete: false, isActive: false },
		] );
		const handleNext = useCallback( () => {
			if ( currentStep < stepsList.length - 1 ) {
				const tempSteps = [ ...stepsList ];
				tempSteps[ currentStep ].isComplete = true;
				tempSteps[ currentStep ].isActive = false;
				tempSteps[ currentStep + 1 ].isActive = true;
				setIsComplete( false );
				setCurrentStep( currentStep + 1 );
				setStepsList( tempSteps );
			} else if ( currentStep === stepsList.length - 1 && ! isComplete ) {
				const tempSteps = [ ...stepsList ];
				tempSteps[ currentStep ].isComplete = true;
				tempSteps[ currentStep ].isActive = false;
				setIsComplete( true );
				setStepsList( tempSteps );
			} else if ( isComplete ) {
				const tempSteps = stepsList.map( ( step ) => ( {
					...step,
					isComplete: false,
					isActive: false,
				} ) );
				tempSteps[ 0 ].isActive = true;
				setIsComplete( false );
				setCurrentStep( 0 );
				setStepsList( tempSteps );
			}
		}, [ setIsComplete, setStepsList, setCurrentStep, currentStep, stepsList, isComplete ] );

		return <>
			<Stepper className={ className } currentStep={ currentStep } steps={ stepsList } />

			<Button id="yst-stepper-button-with-list" onClick={ handleNext }>
				{ currentStep < stepsList.length - 1 && "Next" }
				{ currentStep === stepsList.length - 1 && ! isComplete && "Finish" }
				{ isComplete && "Restart" }
			</Button>
		</>;
	},
};

export const WithCustomStep = {
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: customStep,
			},
		},
	},
	render: ( { className } ) =>{
		const [ isComplete, setIsComplete ] = useState( false );
		const defaultSteps = [ "INSTALL", "ACTIVATE", "SET UP" ];
		const customSteps = [ "CONNECT" ];
		const steps = [ ...defaultSteps, ...customSteps ];
		const [ currentStep, setCurrentStep ] = useState( 0 );

		const handleNext = useCallback( () => {
			if ( currentStep < steps.length - 1 ) {
				setIsComplete( false );
				setCurrentStep( currentStep + 1 );
			} else if ( currentStep === steps.length - 1 && ! isComplete ) {
				setIsComplete( true );
			} else if ( isComplete ) {
				setIsComplete( false );
				setCurrentStep( 0 );
			}
		}, [ setIsComplete, setCurrentStep, isComplete, currentStep ] );

		return <>
			<Stepper className={ className } currentStep={ currentStep }>
				{ defaultSteps.map( ( step, index ) => <Stepper.Step
					key={ step }
					isComplete={ currentStep > index || isComplete }
					isActive={ currentStep === index }
				>
					{ step }
				</Stepper.Step> ) }

				{ customSteps.map( ( step, index ) => <CustomStep
					key={ step }
					isComplete={ currentStep > index + defaultSteps.length || isComplete }
					isActive={ currentStep === index + defaultSteps.length }
				>
					{ step }
				</CustomStep> ) }

			</Stepper>

			<Button id="yst-stepper-button" onClick={ handleNext }>
				{ currentStep < steps.length - 1 && "Next" }
				{ currentStep === steps.length - 1 && ! isComplete && "Finish" }
				{ isComplete && "Restart" }
			</Button>
		</>;
	},
};
