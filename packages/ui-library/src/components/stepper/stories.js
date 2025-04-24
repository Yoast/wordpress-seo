import { CheckIcon } from "@heroicons/react/solid";
import { useArgs } from "@storybook/preview-api";
import classNames from "classnames";
import React, { useCallback, useContext } from "react";
import { Stepper } from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { Button, ProgressBar } from "../../index";
import { component, customStep, customProgressBar } from "./docs";

/**
 * Custom step component for stepper story.
 *
 * @param {JSX.Node} children The step label or children.
 * @param {number} index The index of the step.
 * @param {string} id The id of the step.
 *
 * @returns {JSX.Element} The step element.
 */
const CustomStep = ( { children, index, id } ) => {
	const { addStepRef, currentStep } = useContext( Stepper.Context );
	const isActive = index === currentStep;
	const isComplete = index < currentStep;
	return (
		<div
			id={ id }
			ref={ addStepRef }
			className={ classNames(
				"yst-step",
				isComplete && "yst-step--complete",
				isActive && "yst-step--active yst-text-green-700",
			) }
		>
			<div
				className={ classNames(
					"yst-step__circle yst-ring-green-500",
					isComplete ? "yst-bg-green-500 yst-ring-green-500" : "yst-bg-white",
				) }
			>
				{ isComplete && <CheckIcon className="yst-step__icon yst-w-4 yst-z-50" /> }
				<div
					className={ classNames(
						"yst-step__icon yst-bg-green-500 yst-w-2 yst-h-2 yst-rounded-full yst-delay-500",
						! isComplete && isActive ? "yst-opacity-100" : "yst-opacity-0",
					) }
				/>
			</div>
			<div className="yst-font-semibold yst-text-xxs yst-mt-3">{ children }</div>
		</div>
	);
};

/**
 * Decorates the story with a button to control the current step.
 * @param {import("@storybook/blocks").Story} Story The Story.
 * @returns {JSX.Element} The element.
 */
const DecorateWithStepButton = ( Story ) => {
	const [ { currentStep, ...args }, updateArgs ] = useArgs();
	const steps = args.children || args.steps;

	const handleNext = useCallback( () => {
		if ( currentStep <= steps.length - 1 ) {
			updateArgs( { currentStep: currentStep + 1 } );
		} else if ( currentStep > steps.length - 1 ) {
			updateArgs( { currentStep: 0 } );
		}
	}, [ currentStep ] );

	return <>
		<Story { ...args } currentStep={ currentStep } />

		<Button className="yst-mt-5" onClick={ handleNext }>
			{ currentStep < steps.length - 1 && "Next" }
			{ currentStep === steps.length - 1 && "Finish" }
			{ currentStep > steps.length - 1 && "Restart" }
		</Button>
	</>;
};

export const Factory = {
	args: {
		currentStep: 0,
		steps: [ {
			children: "INSTALL",
			id: "install",
		},
		{
			children: "ACTIVATE",
			id: "activate",
		},
		{
			children: "SET UP",
			id: "setup",
		},
		{
			children: "CONNECT",
			id: "connect",
		} ],
	},
	decorators: [ DecorateWithStepButton ],
};

export const StepsAsChildren = {
	args: {
		currentStep: 0,
		children: [ "INSTALL", "ACTIVATE", "SET UP", "CONNECT" ].map( ( step, index ) => (
			<Stepper.Step
				key={ step }
				index={ index }
				id={ `${ step }-with-children` }
			>
				{ step }
			</Stepper.Step>
		) ),
	},
	decorators: [ DecorateWithStepButton ],
};

export const WithCustomStep = {
	args: {
		currentStep: 0,
		children: [
			<Stepper.Step key="install" index={ 0 } id={ "install-custom" }>INSTALL</Stepper.Step>,
			<Stepper.Step key="activate" index={ 1 } id={ "activate-custom" }>ACTIVATE</Stepper.Step>,
			<Stepper.Step key="setup" index={ 2 } id={ "setup-custom" }>SET UP</Stepper.Step>,
			<CustomStep key="connect" index={ 3 } id={ "connect-custom" }>CONNECT</CustomStep>,
		],
	},
	parameters: {
		docs: {
			description: {
				story: customStep,
			},
		},
	},
	decorators: [ DecorateWithStepButton ],
};

/**
 * Custom Progress bar component for the stepper story.
 *
 * @param {Object} style The style object containing `left` and `right` positions.
 * @param {number} progress The progress percentage (0-100).
 *
 * @returns {JSX.Element} The progress bar element.
 */
const CustomProgressBar = ( { progress, style } ) => {
	return (
		<ProgressBar
			className="yst-absolute yst-top-3 yst-w-auto yst-h-0.5 yst-bg-green-400"
			style={ style }
			min={ 0 }
			max={ 100 }
			progress={ progress }
		/>
	);
};

export const WithCustomProgressBar = {
	args: {
		currentStep: 0,
		steps: [ {
			children: "INSTALL",
			id: "install-wuth-custom-progress-bar",
		},
		{
			children: "ACTIVATE",
			id: "activate-wuth-custom-progress-bar",
		},
		{
			children: "SET UP",
			id: "setup-wuth-custom-progress-bar",
		},
		{
			children: "CONNECT",
			id: "connect-wuth-custom-progress-bar",
		} ],
		CustomProgressBar,
		children: null,
	},
	parameters: {
		docs: {
			description: {
				story: customProgressBar,
			},
		},
	},
	decorators: [ DecorateWithStepButton ],
};

export default {
	title: "2) Components/Stepper",
	component: Stepper,
	parameters: {
		docs: {
			description: { component },
			page: () => <InteractiveDocsPage stories={ [ StepsAsChildren, WithCustomStep, WithCustomProgressBar ] } />,
		},
	},
	argTypes: {
		children: { control: { disable: true } },
	},
};
