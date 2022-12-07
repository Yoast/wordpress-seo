import { Fragment, useCallback, useState, useRef } from "@wordpress/element";
import { noop } from "lodash";
import PropTypes from "prop-types";
import RawModal from ".";
import { Button, TextInput } from "../../index";

const Modal = ( { isOpen: initialIsOpen, onClose: _, children, ...props } ) => {
	const [ isOpen, setIsOpen ] = useState( initialIsOpen );
	const openModal = useCallback( () => setIsOpen( true ), [] );
	const closeModal = useCallback( () => setIsOpen( false ), [] );

	return (
		<Fragment>
			<Button onClick={ openModal }>Open modal</Button>
			<RawModal { ...props } isOpen={ isOpen } onClose={ closeModal }>{ children }</RawModal>
		</Fragment>
	);
};

Modal.propTypes = {
	children: PropTypes.node.isRequired,
	hasCloseButton: PropTypes.bool,
	closeButtonScreenReaderText: PropTypes.string,
};

Modal.defaultProps = {
	hasCloseButton: true,
	closeButtonScreenReaderText: "Close",
};

export default {
	title: "2) Components/Modal",
	component: Modal,
	argTypes: {
		children: { control: "text" },
		isOpen: { control: { disable: true } },
		onClose: { control: { disable: true } },
		hasCloseButton: { control: "boolean" },
		closeButtonScreenReaderText: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "An uncontrolled modal component. For the purpose of this story, the `isOpen` and `onClose` are wrapped.",
			},
		},
	},
	args: {
		isOpen: false,
		onClose: noop,
		children: "Hello everyone!",
		hasCloseButton: true,
		closeButtonScreenReaderText: "Close",
	},
};

export const Factory = {
	component: Modal,
	parameters: {
		controls: { disable: false },
	},
};

export const WithTitleAndDescription = {
	component: Factory.component.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: "Using the `Modal.Title` and `Modal.Description` components.",
			},
			transformSource: () => (
				"<Modal\n" +
				"\tonClose={() => {}}\n" +
				">\n" +
				"\t<Modal.Title as=\"h2\">\n" +
				"\t\tTitle\n" +
				"\t</Modal.Title>\n" +
				"\t<Modal.Description className=\"yst-mt-3 yst-text-sm yst-text-slate-600\">\n" +
				"\t\tDescription\n" +
				"\t</Modal.Description>\n" +
				"</Modal>\n"
			),
		},
	},
	args: {
		children: (
			<Fragment>
				<RawModal.Title as="h2">
					Title
				</RawModal.Title>
				<RawModal.Description className="yst-mt-3 yst-text-sm yst-text-slate-600">
					Description
				</RawModal.Description>
			</Fragment>
		),
	},
};

const InitialFocusComponent = () => {
	const [ isOpen, setIsOpen ] = useState( false );
	const openModal = useCallback( () => setIsOpen( true ), [] );
	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const centerElementRef = useRef( null );

	return (
		<Fragment>
			<Button onClick={ openModal }>Open modal</Button>
			<RawModal isOpen={ isOpen } onClose={ closeModal } initialFocus={ centerElementRef }>

				<RawModal.Title>Title</RawModal.Title>
				<RawModal.Description>Description area.</RawModal.Description>
				<TextInput placeholder="This is where the focus should be." ref={ centerElementRef } />
			</RawModal>
		</Fragment>
	);
};

export const InitialFocus = () => <InitialFocusComponent />;

InitialFocus.parameters = { docs: { description: { story: "The `initialFocus` prop accepts ref object and once the modal is open, the focus will be applied to the element with the ref. <br>By default, the focus will go to the first focusable element in the modal." } } };
