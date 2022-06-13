import { Fragment, useCallback, useState } from "@wordpress/element";
import { noop } from "lodash";
import { PropTypes } from "prop-types";
import RawModal from ".";
import Button from "../../elements/button";

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
	title: "2. Components/Modal",
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
				"\t<Modal.Description className=\"yst-mt-3 yst-text-sm yst-text-gray-500\">\n" +
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
				<RawModal.Description className="yst-mt-3 yst-text-sm yst-text-gray-500">
					Description
				</RawModal.Description>
			</Fragment>
		),
	},
};
