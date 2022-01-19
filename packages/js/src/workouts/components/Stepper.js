import { CheckIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import { Fragment, useCallback, useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height";

/**
 * The StepButtons component.
 *
 * @param {Object}   props               The props object.
 * @param {number}   props.stepIdx       The index of the current step.
 * @param {number}   props.lastIndex     The index of the last step.
 * @param {function} props.setActiveStep A function to set a new active step.
 * @param {function} props.saveStep      A function to save the current step.
 * @param {function} props.finishStepper A function to finish the last step (entire stepper).
 *
 * @returns {WPElement} The StepButtons component.
 */
function StepButtons({ stepIdx, lastIndex, handlePrimaryClick, goBack }) {
	return <Fragment>
		<button
			onClick={handlePrimaryClick}
			className="yst-button--primary"
		>
			{stepIdx < lastIndex
				? __("Save and continue", "wordpress-seo")
				: __("Finish this workout", "wordpress-seo")}
		</button>
		{stepIdx > 0 && <button
			onClick={goBack}
			className="yst-button--secondary yst-ml-3"
		>
			{__("Go back", "wordpress-seo")}
		</button>
		}
	</Fragment>;
}

StepButtons.propTypes = {
	stepIdx: PropTypes.number.isRequired,
	lastIndex: PropTypes.number.isRequired,
	setActiveStep: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
};

StepButtons.defaultProps = {
	saveStep: () => { },
	finishStepper: () => { },
};

const classnames = {
	complete: {
		line: "yst-top-4",
		bullet: {
			border: "yst-bg-primary-500 yst-group-hover:bg-primary-700",
			content: "",
		},
		name: "",
	},
	current: {
		line: "yst-top-8",
		bullet: {
			border: "yst-bg-white yst-border-2 yst-border-primary-500",
			content: "yst-bg-primary-500",
		},
		name: "yst-text-primary-500",
	},
	upcoming: {
		line: "yst-top-4",
		bullet: {
			border: "yst-bg-white yst-border-2 yst-border-gray-300 yst-group-hover:border-gray-400",
			content: "yst-bg-transparent yst-group-hover:bg-gray-300",
		},
		name: "yst-text-gray-500",
	},
};

/**
 * The (Tailwind) Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
// eslint-disable-next-line complexity, require-jsdoc
function TailwindStep({ step, stepIdx, lastStepIdx, setActiveStep, saveStep, finishStepper }) {
	const [isShowing, setIsShowing] = useState(step.status === "current");
	const [contentHeight, setContentHeight] = useState(isShowing ? "auto" : 0);

	const heightAnimationDuration = 500;
	const enterAnimationDelay = 500;

	useEffect(() => setIsShowing(step.status === "current"), [step]);

	const handlePrimaryClick = useCallback(
		() => {
			const currentStep = stepIdx;
			const nextStep = stepIdx + 1;
			if (currentStep === lastStepIdx) {
				finishStepper();
			} else {
				saveStep(currentStep);
				setActiveStep(nextStep);
			}
		},
		[setActiveStep, saveStep, finishStepper, stepIdx, lastStepIdx]
	);

	const goBack = useCallback(() => {
		setActiveStep(stepIdx - 1);
	}, [stepIdx, setActiveStep]);

	return (
		<Fragment>
			{ /* Line. */}
			{(stepIdx !== lastStepIdx) &&
			<Fragment>
				<div
					className={"yst--ml-px yst-absolute yst-mt-0.5 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300 " + classnames[step.status].line}
					aria-hidden="true"
				/>
				{/*
				<Transition
					show={step.status === "complete" && stepIdx < activeIndex}
					className={"yst--ml-px yst-absolute yst-mt-0.5 yst-left-4 yst-w-0.5 yst-h-full yst-bg-primary-500 " + classnames[step.status].line}
					enter="transition-all duration-300"
					enterFrom="bottom-full"
					enterTo="-bottom-6"
					entered="-bottom-6"
					leave="transition-all duration-300"
					leaveFrom="-bottom-6"
					leaveTo="bottom-full"
				/>
				*/}
			</Fragment>}

			<div className="yst-relative yst-flex yst-items-start yst-group" aria-current={step.status === "current" ? "step" : null}>
				{ /* Bullet. */}
				<span className="yst-h-9 yst-flex yst-items-center" aria-hidden={step.status === "current" ? "true" : null}>
					{ /* eslint-disable-next-line max-len */}
					<span
						className={"yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-rounded-full " +
							classnames[step.status].bullet.border}
					>
						{(step.status === "complete")
							? <CheckIcon className="yst-w-5 yst-h-5 yst-text-white" aria-hidden="true" />
							: <span className={"yst-h-2.5 yst-w-2.5 yst-rounded-full " + classnames[step.status].bullet.content} />
						}
					</span>
				</span>
				{ /* Name and description. */}
				<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
					<span className={"yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase " + classnames[step.status].name}>
						{step.name}
					</span>
					{step.description && <span className="yst-text-sm yst-text-gray-500">{step.description}</span>}
				</span>
			</div>
			{ /* Child component and buttons. */}

			<Transition
				className=""
				show={isShowing}
				unmount={false}
				beforeEnter={() => setTimeout(() => setContentHeight("auto"), enterAnimationDelay)}
				enter={`yst-transition-opacity yst-ease-linear yst-duration-[${heightAnimationDuration}ms] yst-delay-[${enterAnimationDelay}ms]`}
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				beforeLeave={() => setContentHeight(0)}
				leave={`yst-transition-opacity yst-ease-linear yst-duration-[${heightAnimationDuration}ms]`}
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
			>
				<AnimateHeight
					id={`content-${stepIdx}`}
					height={contentHeight}
					duration={heightAnimationDuration}
				>
					<div className="yst-ml-12 yst-mb-8 yst-mt-4">
						{step.component}
						<StepButtons
							stepIdx={stepIdx}
							lastIndex={lastStepIdx}
							handlePrimaryClick={handlePrimaryClick}
							goBack={goBack}
						/>
					</div>
				</AnimateHeight>
			</Transition>

		</Fragment>
	);
}

TailwindStep.propTypes = {
	step: PropTypes.objectOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		component: PropTypes.element.isRequired,
		status: PropTypes.oneOf(["complete", "current", "upcoming"]).isRequired,
	})).isRequired,
	stepIdx: PropTypes.number.isRequired,
	lastStepIdx: PropTypes.number.isRequired,
	setActiveStep: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
};

TailwindStep.defaultProps = {
	saveStep: () => { },
	finishStepper: () => { },
};

/**
 * The Tailwind Stepper component.
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Stepper component.
 */
export default function Stepper({ steps, setActiveStep, saveStep, finishStepper }) {
	return (
		<ol className="yst-overflow-hidden">
			{steps.map((step, stepIdx) => (
				<li key={step.name} className={(stepIdx === steps.length - 1 ? "" : "yst-pb-10") + " yst-relative"}>
					<TailwindStep
						step={step}
						stepIdx={stepIdx}
						lastStepIdx={steps.length - 1}
						setActiveStep={setActiveStep}
						saveStep={saveStep}
						finishStepper={finishStepper}
					/>
				</li>
			))}
		</ol>
	);
}

Stepper.propTypes = {
	steps: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		component: PropTypes.element.isRequired,
		status: PropTypes.oneOf(["complete", "current", "upcoming"]).isRequired,
	})).isRequired,
	setActiveStep: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
};

Stepper.defaultProps = {
	saveStep: () => { },
	finishStepper: () => { },
};