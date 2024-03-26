import { noop, times } from "lodash";
import PropTypes from "prop-types";
import React, { createRef, useCallback, useState } from "react";
import Modal, { classNameMap } from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Button from "../../elements/button";
import TextInput from "../../elements/text-input";

const Template = ( { isOpen: initialIsOpen, onClose: _, children, ...props } ) => {
	const [ isOpen, setIsOpen ] = useState( initialIsOpen );
	const openModal = useCallback( () => setIsOpen( true ), [] );
	const closeModal = useCallback( () => setIsOpen( false ), [] );

	return (
		<>
			<Button onClick={ openModal }>Open modal</Button>
			<Modal { ...props } isOpen={ isOpen } onClose={ closeModal }>
				<Modal.Panel>
					{ children }
				</Modal.Panel>
			</Modal>
		</>
	);
};
Template.displayName = "Modal";
Template.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	children: PropTypes.node.isRequired,
};

export const Factory = {
	component: Template,
	parameters: {
		controls: { disable: false },
	},
};

export const WithPanel = {
	name: "With panel",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "Using the `Modal.Panel` component. The panel:\n- makes it so the modal closes when clicking outside of it\n- provides props to show a close button and the text inside\n- provides styling via the `.yst-modal__panel` class",
			},
		},
	},
	args: {
		children: "Text inside a panel.",
	},
};

export const WithTitleAndDescription = {
	name: "With title and description",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "Using the `Modal.Title` and `Modal.Description` components will add `aria-labelledby` and `aria-describedby` to the Modal with matching IDs.",
			},
		},
	},
	args: {
		children: (
			<>
				<Modal.Title as="h2">
					Title
				</Modal.Title>
				<Modal.Description className="yst-mt-3 yst-text-sm yst-text-slate-600">
					Description
				</Modal.Description>
			</>
		),
	},
};

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget convallis nulla. Nullam et justo semper, volutpat mauris ac, sodales augue. Vestibulum vitae hendrerit tortor, vel fringilla ipsum. Ut id purus at urna tincidunt tincidunt. Vestibulum molestie ipsum quam, sit amet consectetur lorem auctor at. Cras laoreet arcu ac arcu rutrum, vitae dapibus felis lobortis. Aenean tincidunt varius lorem at ultrices. Ut dignissim eget leo at tristique. Donec interdum tempor eros, vulputate tincidunt erat venenatis ut.";

export const WithContainer = {
	name: "With scrolling container",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "Using the `Modal.Container`, which includes a `Header`, `Content` and `Footer`. The content will then be vertically scrollable if it takes up more space than the screen height.",
			},
		},
	},
	args: {
		children: (
			<Modal.Container>
				<Modal.Container.Header className="yst-w-full yst-text-center yst-mb-3">
					<Modal.Title as="h3">Lorem ipsum</Modal.Title>
				</Modal.Container.Header>
				<Modal.Container.Content className="yst-text-center yst-space-y-3">
					{ times( 16 ).map( i => <p key={ `paragraph-${ i }` }>{ LOREM }</p> ) }
				</Modal.Container.Content>
				<Modal.Container.Footer className="yst-mt-3">
					<Button variant="primary" className="yst-w-full">Lorem ipsum</Button>
				</Modal.Container.Footer>
			</Modal.Container>
		),
	},
};

const centerElementRef = createRef();

export const InitialFocus = {
	name: "Initial focus",
	parameters: {
		controls: { disable: false },
		docs: {
			description: {
				story: "The `initialFocus` prop accepts ref object and once the modal is open, the focus will be applied to the element with the ref. <br>By default, the focus will go to the first focusable element in the modal.",
			},
		},
	},
	args: {
		initialFocus: centerElementRef,
		children: (
			<>
				<Modal.Title>Title</Modal.Title>
				<Modal.Description>Description area.</Modal.Description>
				<TextInput placeholder="This is where the focus should be." ref={ centerElementRef } />
			</>
		),
	},
};

export default {
	title: "2) Components/Modal",
	component: Template,
	argTypes: {
		children: {
			control: "text",
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		isOpen: {
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "bool" } },
		},
		onClose: {
			control: { disable: true },
			type: { required: true },
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
			control: "radio",
			table: {
				type: { summary: Object.keys( classNameMap.position ).map( position => `"${ position }"` ).join( " " ) },
				defaultValue: { summary: "center" },
			},
			options: Object.keys( classNameMap.position ),
		},
		initialFocus: {
			control: { disable: true },
			table: {
				type: { summary: "ref" },
				defaultValue: { summary: null },
			},
		},
	},
	parameters: {
		docs: {
			description: {
				component: "An uncontrolled modal component. For the purpose of this story, the `children`, `isOpen` and `onClose` are wrapped. So be aware that in the `Show code`, these are not reflected!",
			},
			page: () => <InteractiveDocsPage stories={ [ WithPanel, WithTitleAndDescription, WithContainer, InitialFocus ] } />,
		},
	},
	args: {
		isOpen: false,
		onClose: noop,
		children: "Hello everyone!",
		position: "center",
	},
};
