/* eslint-disable no-negated-condition */
/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
/* eslint-disable require-jsdoc */
import { useState, useCallback, useReducer } from "@wordpress/element";
import { noop, indexOf, includes } from "lodash";
import { Modal, Button } from "@yoast/ui-library";
import classNames from "classnames";
import { CheckIcon } from "@heroicons/react/outline";

import Welcome from "./welcome";
import About from "./about";
import Audience from "./audience";
import Schema from "./schema";
import Layout from "./layout";
import Finish from "./finish";

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

const stepIdsOrder = [ "welcome", "about", "schema", "audience", "layout", "finish" ];

const dataReducer = ( state = {}, action ) => {
	switch ( action ) {
		case "setData":
			state.data = {
				...state.data,
				...action.payload,
			};
	}

	return state;
};

const WritingGuide = () => {
	const [ data, dispatch ] = useReducer( dataReducer );
	const [ activeStepId, setActiveStepId ] = useState( "welcome" );
	const [ completedStepIds, setCompletedStepIds ] = useState( [] );

	const ActiveStep = steps[ activeStepId ].component;

	const handlePrev = useCallback( () => {
		setActiveStepId( stepIdsOrder[ indexOf( stepIdsOrder, activeStepId ) - 1 ] );
	}, [ setActiveStepId ] );

	const handleNext = useCallback( () => {
		setCompletedStepIds( [ ...completedStepIds, activeStepId ] );
		setActiveStepId( stepIdsOrder[ indexOf( stepIdsOrder, activeStepId ) + 1 ] );
	}, [ setCompletedStepIds, setActiveStepId ] );

	return (
		<Modal isOpen={ true } onClose={ noop }>
			<nav aria-label="Progress" className="">
				<ol className="yst-overflow-hidden">
					{ stepIdsOrder.map( ( step, stepIdx ) => (
						<li key={ step.id } className={ classNames( stepIdx !== steps.length - 1 ? "yst-pb-10" : "", "yst-relative" ) }>
							{ includes( completedStepIds, step.id ) ? (
								<>
									{ stepIdx !== steps.length - 1 ? (
										<div className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-indigo-600" aria-hidden="true" />
									) : null }
									<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group">
										<span className="yst-h-9 yst-flex yst-items-center">
											<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-indigo-600 yst-rounded-full yst-group-hover:bg-indigo-800">
												<CheckIcon className="yst-w-5 yst-h-5 yst-text-white" aria-hidden="true" />
											</span>
										</span>
										<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
											<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase">{ step.title }</span>
											<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
										</span>
									</a>
								</>
							) : activeStepId === step.id ? (
								<>
									{ stepIdx !== steps.length - 1 ? (
										<div className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300" aria-hidden="true" />
									) : null }
									<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group" aria-current="step">
										<span className="yst-h-9 yst-flex yst-items-center" aria-hidden="true">
											<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-white yst-border-2 yst-border-indigo-600 yst-rounded-full">
												<span className="yst-h-2.5 yst-w-2.5 yst-bg-indigo-600 yst-rounded-full" />
											</span>
										</span>
										<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
											<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-indigo-600">{ step.title }</span>
											<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
										</span>
									</a>
								</>
							) : (
								<>
									{ stepIdx !== steps.length - 1 ? (
										<div className="yst--ml-px yst-absolute yst-mt-0.5 yst-top-4 yst-left-4 yst-w-0.5 yst-h-full yst-bg-gray-300" aria-hidden="true" />
									) : null }
									<a href={ step.href } className="yst-relative yst-flex yst-items-start yst-group">
										<span className="yst-h-9 yst-flex yst-items-center" aria-hidden="true">
											<span className="yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-bg-white yst-border-2 yst-border-gray-300 yst-rounded-full yst-group-hover:border-gray-400">
												<span className="yst-h-2.5 yst-w-2.5 yst-bg-transparent yst-rounded-full yst-group-hover:bg-gray-300" />
											</span>
										</span>
										<span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col">
											<span className="yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase yst-text-gray-500">{ step.title }</span>
											<span className="yst-text-sm yst-text-gray-500">{ step.description }</span>
										</span>
									</a>
								</>
							) }
						</li>
					) ) }
				</ol>
			</nav>
			<ActiveStep data={ data } dispatch={ dispatch } />
			<footer>
				<Button variant="secondary" onClick={ handlePrev }>Prev</Button>
				<Button onClick={ handleNext }>Next</Button>
			</footer>

		</Modal>
	);
};

export default WritingGuide;
