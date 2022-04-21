/* eslint-disable no-negated-condition */
/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
/* eslint-disable require-jsdoc */
import { CheckIcon } from "@heroicons/react/outline";
import { useCallback, useReducer, useState } from "@wordpress/element";
import { Button, Modal } from "@yoast/ui-library";
import classNames from "classnames";
import { indexOf, includes } from "lodash";
import About from "./about";
import Audience from "./audience";
import Finish from "./finish";
import Layout from "./layout";
import Schema from "./schema";
import Welcome from "./welcome";

const steps = {
	welcome: {
		id: "welcome",
		title: "Let's get started.",
		description: "Let's get started.",
		component: Welcome,
	},
	about: {
		id: "about",
		title: "What is your post about?",
		description: "What is your post about?",
		component: About,
	},
	schema: {
		id: "schema",
		title: "What type of post is this?",
		description: "What type of post is this?",
		component: Schema,
	},
	audience: {
		id: "audience",
		title: "Who is this post for?",
		description: "Who is this post for?",
		component: Audience,
	},
	layout: {
		id: "layout",
		title: "Choose a layout.",
		description: "Choose a layout.",
		component: Layout,
	},
	finish: {
		id: "finish",
		title: "Start writing!",
		description: "Start writing!",
		component: Finish,
	},
};

const stepsOrder = [ "welcome", "about", "schema", "audience", "layout", "finish" ];

const dataReducer = ( state = {
	focusKeyphrase: "",
	articleType: "",
}, action ) => {
	switch ( action.type ) {
		case "setData":
			state = {
				...state,
				...action.payload,
			};
	}

	return state;
};

const WritingGuide = () => {
	const [ data, dispatch ] = useReducer( dataReducer );
	const [ isActive, setIsActive ] = useState( true );
	const [ activeStep, setActiveStep ] = useState( "welcome" );
	const [ completedSteps, setCompletedSteps ] = useState( [] );

	const activeStepIndex = indexOf( stepsOrder, activeStep );
	const ActiveStep = steps[ activeStep ].component;

	const handlePrev = useCallback( () => {
		setActiveStep( stepsOrder[ indexOf( stepsOrder, activeStep ) - 1 ] );
	}, [ setActiveStep, activeStep ] );

	const handleNext = useCallback( () => {
		setCompletedSteps( [ ...completedSteps, activeStep ] );
		setActiveStep( stepsOrder[ indexOf( stepsOrder, activeStep ) + 1 ] );
	}, [ setCompletedSteps, setActiveStep, activeStep ] );

	const handleSubmit = useCallback( () => {
		// Redux actions here
		setIsActive( false );
	}, [ setCompletedSteps, setActiveStep, activeStep ] );

	return (
		<Modal id="yst-writing-guide" isOpen={ isActive } onClose={ () => setIsActive( false ) }>
			<div className="yst-flex">
				<nav aria-label="Progress" className="yst-pr-4 yst-border-gray-300 yst-border-r">
					<ol className="yst-overflow-hidden">
						{ stepsOrder.map( ( stepKey, stepIdx ) => {
							const step = steps[ stepKey ];
							return (
								<li
									key={ step.id }
									className={ classNames( stepIdx !== steps.length - 1 ? "yst-pb-10" : "", "yst-relative" ) }
								>
									{ includes( completedSteps, step.id ) ? (
										<>
											{ stepIdx !== stepsOrder.length - 1 ? (
												<div
													className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-primary-600"
													aria-hidden="true"
												/>
											) : null }
											<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group">
												<span className="yst-h-9 yst-flex yst-items-center">
													<span
														className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-primary-600 yst-rounded-full yst-group-hover:bg-primary-800"
													>
														<CheckIcon className="yst-w-5 yst-h-5 yst-text-white" aria-hidden="true" />
													</span>
												</span>
												<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
													<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase">{ step.title }</span>
													<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
												</span>
											</a>
										</>
									) : activeStep === step.id ? (
										<>
											{ stepIdx !== stepsOrder.length - 1 ? (
												<div
													className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300"
													aria-hidden="true"
												/>
											) : null }
											<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group" aria-current="step">
												<span className="yst-h-9 yst-flex yst-items-center" aria-hidden="true">
													<span
														className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-white yst-border-2 yst-border-primary-600 yst-rounded-full"
													>
														<span className="yst-h-2.5 yst-w-2.5 yst-bg-primary-600 yst-rounded-full" />
													</span>
												</span>
												<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
													<span
														className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-primary-600"
													>{ step.title }</span>
													<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
												</span>
											</a>
										</>
									) : (
										<>
											{ stepIdx !== stepsOrder.length - 1 ? (
												<div
													className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300"
													aria-hidden="true"
												/>
											) : null }
											<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group">
												<span className="yst-h-9 yst-flex yst-items-center" aria-hidden="true">
													<span
														className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-white yst-border-2 yst-border-gray-300 yst-rounded-full yst-group-hover:border-gray-400"
													>
														<span
															className="yst-h-2.5 yst-w-2.5 yst-bg-transparent yst-rounded-full yst-group-hover:bg-gray-300"
														/>
													</span>
												</span>
												<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
													<span
														className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-gray-500"
													>{ step.title }</span>
													<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
												</span>
											</a>
										</>
									) }
								</li>
							);
						} ) }
					</ol>
				</nav>
				<div className="yst-flex yst-grow yst-flex-col yst-justify-between yst-pl-4">
					<ActiveStep data={ data } dispatch={ dispatch } />
					<footer className="yst-flex yst-justify-between">
						{ activeStepIndex < 1 ? <Button variant="secondary" onClick={ handlePrev }>Prev</Button> : <div /> }
						{ activeStepIndex < stepsOrder.length - 1 ? (
							<Button onClick={ handleNext }>Next</Button>
						) : (
							<Button onClick={ handleSubmit }>Submit</Button>
						) }
					</footer>
				</div>
			</div>
		</Modal>
	);
};

export default WritingGuide;
