import { noop, times } from "lodash";
import PropTypes from "prop-types";
import React, { createRef, useCallback, useRef, useState } from "react";
import RawModal, { classNameMap } from ".";
import { StoryComponent as Button } from "../../elements/button";
import TextInput from "../../elements/text-input";
import { classNameMap as titleClassNameMap } from "../../elements/title";

TextInput.displayName = "TextInput";

const Modal = ( { isOpen: initialIsOpen, onClose: _, children, ...props } ) => {
	const [ isOpen, setIsOpen ] = useState( initialIsOpen );
	const openModal = useCallback( () => setIsOpen( true ), [] );
	const closeModal = useCallback( () => setIsOpen( false ), [] );

	return (
		<>
			<Button onClick={ openModal }>Open modal</Button>
			<RawModal { ...props } isOpen={ isOpen } onClose={ closeModal }>
				<RawModal.Panel>
					{ children }
				</RawModal.Panel>
			</RawModal>
		</>
	);
};
Modal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	children: PropTypes.node.isRequired,
};

export default {
	title: "2) Components/Modal",
	component: Modal,
	argTypes: {
		children: {
			control: "text",
			type: { required: true },
			table: { type: { summary: "node" } },
		},
		isOpen: {
			control: { disable: true },
			type: { required: true },
			table: { type: { summary: "func" } },
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
				defaultValue: { summary: "center" },
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
		size: {
			control: "select",
			description: "Prop for the `Model.Title` component.",
			type: { summary: Object.keys( titleClassNameMap.size ).join( "|" ) },
			options: Object.keys( titleClassNameMap.size ),
		},
	},
	parameters: {
		docs: {
			description: {
				component: "An uncontrolled modal component. For the purpose of this story, the `children`, `isOpen` and `onClose` are wrapped. So be aware that in the `Show code`, these are not reflected!",
			},
		},
	},
	args: {
		isOpen: false,
		onClose: noop,
		children: "Hello everyone!",
		position: "center",
	},
};

export const Factory = {
	component: Modal,
	parameters: {
		controls: { disable: false },
	},
};

export const WithPanel = Factory.component.bind( {} );
WithPanel.storyName = "With panel";
WithPanel.parameters = {
	docs: {
		description: {
			story: "Using the `Modal.Panel` component. The panel:\n- makes it so the modal closes when clicking outside of it\n- provides props to show a close button and the text inside\n- provides styling via the `.yst-modal__panel` class",
		},
	},
};
WithPanel.args = {
	children: "Text inside a panel.",
};

export const WithTitleAndDescription = Factory.component.bind( {} );
WithTitleAndDescription.storyName = "With title and description";
WithTitleAndDescription.parameters = {
	docs: {
		description: {
			story: "Using the `Modal.Title` and `Modal.Description` components will add `aria-labelledby` and `aria-describedby` to the Modal with matching IDrefs.",
		},
	},
};
WithTitleAndDescription.args = {
	children: (
		<>
			<RawModal.Title as="h2">
				Title
			</RawModal.Title>
			<RawModal.Description className="yst-mt-3 yst-text-sm yst-text-slate-600">
				Description
			</RawModal.Description>
		</>
	),
};

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget convallis nulla. Nullam et justo semper, volutpat mauris ac, sodales augue. Vestibulum vitae hendrerit tortor, vel fringilla ipsum. Ut id purus at urna tincidunt tincidunt. Vestibulum molestie ipsum quam, sit amet consectetur lorem auctor at. Cras laoreet arcu ac arcu rutrum, vitae dapibus felis lobortis. Aenean tincidunt varius lorem at ultrices. Ut dignissim eget leo at tristique. Donec interdum tempor eros, vulputate tincidunt erat venenatis ut.";

export const WithContainer = Factory.component.bind( {} );
WithContainer.storyName = "With scrolling container";
WithContainer.parameters = {
	docs: {
		description: {
			story: "Using the `Modal.Container`, which includes a `Header`, `Content` and `Footer`. The content will then be vertically scrollable if it takes up more space than the screen height.",
		},
	},
};
WithContainer.args = {
	children: (
		<RawModal.Container>
			<RawModal.Container.Header className="yst-w-full yst-text-center yst-mb-3">
				<RawModal.Title as="h3">Lorem ipsum</RawModal.Title>
			</RawModal.Container.Header>
			<RawModal.Container.Content className="yst-text-center yst-space-y-3">
				{ times( 16 ).map( i => <p key={ `paragraph-${ i }` }>{ lorem }</p> ) }
			</RawModal.Container.Content>
			<RawModal.Container.Footer className="yst-mt-3">
				<Button variant="primary" className="yst-w-full">Lorem ipsum</Button>
			</RawModal.Container.Footer>
		</RawModal.Container>
	),
};

const InitialFocusComponent = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const openModal = useCallback( () => setIsOpen( true ), [] );
	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const ref = useRef( null );

	return (
		<>
			<Button onClick={ openModal }>Open modal</Button>
			<RawModal isOpen={ isOpen } onClose={ closeModal } initialFocus={ ref }>
				<RawModal.Panel>
					<RawModal.Title>Title</RawModal.Title>
					<RawModal.Description>Description area.</RawModal.Description>
					<TextInput placeholder="This is where the focus should be." ref={ ref } />
				</RawModal.Panel>
			</RawModal>
		</>
	);
};

const centerElementRef = createRef();

export const InitialFocus = Factory.component.bind( {} );
InitialFocus.storyName = "Initial focus";
InitialFocus.parameters = { docs: { description: { story: "The `initialFocus` prop accepts ref object and once the modal is open, the focus will be applied to the element with the ref. <br>By default, the focus will go to the first focusable element in the modal." } } };
InitialFocus.args = {
	initialFocus: centerElementRef,
	children: (
		<>
			<RawModal.Title>Title</RawModal.Title>
			<RawModal.Description>Description area.</RawModal.Description>
			<TextInput placeholder="This is where the focus should be." ref={ centerElementRef } />
		</>
	),
};
