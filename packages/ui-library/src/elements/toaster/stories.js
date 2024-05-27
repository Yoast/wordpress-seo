import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import Toaster  from ".";
import Button from "../../elements/button";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import { description, component, close, title } from "./docs";
import classNames from "classnames";

const positionClassNameMap = {
	position: {
		"bottom-center": "yst-notifications--bottom-center",
		"bottom-left": "yst-notifications--bottom-left",
		"top-center": "yst-notifications--top-center",
	},
};
const Template = ( { isVisible: initialVisible, setIsVisible: _, position, children, ...props } ) => {
	const [ isVisible, setIsVisible ] = useState( initialVisible );
	const toggleToaster = useCallback( () => setIsVisible( ! isVisible ), [ isVisible ] );
	const openToaster = useCallback( () => setIsVisible( true ), [] );

	return (
		<>
			<Button onClick={ toggleToaster }>Toggle Toaster</Button>
			<aside
				className={ classNames(
					"yst-notifications",
					positionClassNameMap.position[ position ],
				) }
			>
				<Toaster
					{ ...props }
					isVisible={ isVisible }
					setIsVisible={ openToaster }
					onDismiss={ toggleToaster }
					position={ position }
					id={ "toaster" }
				>
					{ children }
				</Toaster>
			</aside>
		</>
	);
};
Template.displayName = "Toaster";
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
				<Toaster.Title title="Cool title" />
				<p>Hello everyone!</p>
			</>
		),
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: title } },
	},
};

export const withDescription = {
	name: "With description",
	args: {
		children: (
			<>
				<Toaster.Description description={ [ "Bullet 1", "Bullet 2", "Bullet 3" ] } />
			</>
		),
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: description } },
	},
};

export const withClose = {
	name: "With close button",
	args: {
		children: (
			<>
				<div className="yst-flex yst-flex-row-reverse">
					<Toaster.Close dismissScreenReaderLabel="Dismiss" />
				</div>
				<p>Hello everyone!</p>
			</>
		),
	},
	parameters: {
		controls: { disable: false },
		docs: { description: { story: close } },
	},
};

export default {
	title: "1) Elements/Toaster",
	component: Template,
	argTypes: {
		children: {
			control: "text",
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		id: { control: "text" },
		autoDismiss: { type: "number", description: "Milliseconds for the toaster to disappear." },
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
			description: "The position of the toaster.",
			table: {
				defaultValue: { summary: "bottom-left" },
			},
		},
	},
	args: {
		isVisible: true,
		setIsVisible: noop,
		id: "toaster",
		children: "Hello everyone!",
		position: "bottom-left",
	},
	parameters: {
		docs: {
			description: {
				component,
			},
			page: () => <InteractiveDocsPage stories={ [ withClose, withDescription, withTitle ] } />,
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
