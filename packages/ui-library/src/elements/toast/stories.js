import { noop } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import Toast, { useToastContext } from ".";
import Button from "../../elements/button";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { description, component, close, title, useToastContext as useToastContextDocs, complexLayout } from "./docs";
import classNames from "classnames";
import { ValidationIcon } from "../validation";
import { useToggleState } from "../../hooks";

const positionClassNameMap = {
	position: {
		"bottom-center": "yst-notifications--bottom-center",
		"bottom-left": "yst-notifications--bottom-left",
		"top-center": "yst-notifications--top-center",
	},
};
const Template = ( { isVisible: initialVisible, setIsVisible: _, position, children, ...props } ) => {
	const [ isVisible, toggleToast, , openToast ] = useToggleState( initialVisible );

	return (
		<>
			<Button onClick={ toggleToast }>Toggle toast</Button>
			<aside
				className={ classNames(
					"yst-notifications",
					positionClassNameMap.position[ position ],
				) }
			>
				<Toast
					{ ...props }
					isVisible={ isVisible }
					setIsVisible={ openToast }
					onDismiss={ toggleToast }
					position={ position }
					id={ "toast" }
				>
					{ children }
				</Toast>
			</aside>
		</>
	);
};
Template.displayName = "Toast";
Template.propTypes = {
	isVisible: PropTypes.bool,
	setIsVisible: PropTypes.func,
};

export const Factory = {
	component: Template,
	parameters: {
		controls: { disable: false },
	},
};

export const withTitle = {
	name: "With title",
	args: {
		children: (
			<>
				<Toast.Title title="Cool title" />
				<p>Hello everyone!</p>
			</>
		),
	},
	parameters: {
		controls: { disable: true },
		docs: { description: { story: title } },
	},
};

export const withDescription = {
	name: "With description",
	args: {
		children: (
			<>
				<Toast.Description description={ [ "Bullet 1", "Bullet 2", "Bullet 3" ] } />
			</>
		),
	},
	parameters: {
		controls: { disable: true },
		docs: { description: { story: description } },
	},
};

export const withClose = {
	name: "With close button",
	args: {
		children: (
			<div className="yst-flex">
				<div className="yst-flex-1">
					<p>Hello everyone!</p>
				</div>
				<div>
					<Toast.Close dismissScreenReaderLabel="Dismiss" />
				</div>
			</div>
		),
	},
	parameters: {
		controls: { disable: true },
		docs: { description: { story: close } },
	},
};

const ConfirmButton = () => {
	const { handleDismiss } = useToastContext();

	return <Button size="small" onClick={ handleDismiss }>Confirm</Button>;
};

export const useToastContextHook = {
	name: "useToastContext",
	args: {
		children: (
			<div className="yst-flex">
				<div className="yst-flex-1">
					<p>Hello everyone!</p>
				</div>
				<div>
					<ConfirmButton />
				</div>
			</div>
		),
	},
	parameters: {
		controls: { disable: true },
		docs: { description: { story: useToastContextDocs } },
	},
};

const DismissButton = () => {
	const { handleDismiss } = useToastContext();
	return <Button size="small" variant="tertiary" onClick={ handleDismiss }>Dismiss</Button>;
};

export const asComplexLayout = {
	name: "Complex layout",
	args: {
		children: (
			<>
				<div className="yst-flex yst-gap-3">
					<div className="yst-flex-shrink-0">
						<ValidationIcon className="yst-w-5 yst-h-5" />
					</div>
					<div className="yst-flex-1">
						<Toast.Title title="Perform an action?" />
						<p>An optional action can be performed. Please confirm this action. Otherwise, feel free to dismiss this suggestion.</p>
					</div>
					<div>
						<Toast.Close dismissScreenReaderLabel="Dismiss" />
					</div>
				</div>
				<div className="yst-flex yst-gap-3 yst-justify-end yst-mt-3">
					<DismissButton />
					<ConfirmButton />
				</div>
			</>
		),
	},
	parameters: {
		controls: { disable: true },
		docs: { description: { story: complexLayout } },
	},
	decorators: [
		( Story ) => (
			<div className="yst-min-h-[21rem]">
				<Story />
			</div>
		),
	],
};

export default {
	title: "1) Elements/Toast",
	component: Template,
	argTypes: {
		children: {
			control: "text",
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		id: { control: "text" },
		autoDismiss: { type: "number", description: "Milliseconds for the toast to disappear." },
		isVisible: {
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "bool" } },
		},
		setIsVisible: {
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "func" } },
		},
		onDismiss: {
			control: { disable: true },
			type: { required: false },
			table: { type: { summary: "func" } },
		},

		className: {
			control: "text",
			table: {
				type: { summary: "string" },
				defaultValue: { summary: "" },
			},
		},
		position: {
			options: [ "bottom-center", "bottom-left", "top-center" ],
			type: "select",
			description: "The position of the toast.",
			table: {
				defaultValue: { summary: "bottom-left" },
			},
		},
	},
	args: {
		isVisible: true,
		setIsVisible: noop,
		id: "toast",
		children: "Hello everyone!",
		position: "bottom-left",
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => <InteractiveDocsPage stories={ [ withTitle, withDescription, withClose, useToastContextHook, asComplexLayout ] } />,
		},
	},
	decorators: [
		( Story ) => (
			<div className="yst-min-h-[12rem]">
				<Story />
			</div>
		),
	],
};
