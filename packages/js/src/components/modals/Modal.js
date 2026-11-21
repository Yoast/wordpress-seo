/* eslint-disable complexity */
import { Modal as WpModal } from "@wordpress/components";

/**
 * Default className for our Modal.
 */
export const defaultModalClassName = "yoast yoast-gutenberg-modal";

/**
 * A modal based on the Gutenberg modal that adds a Yoast icon and yoast classes by default.
 *
 * Accepts all props that the Gutenberg modal accepts.
 *
 * @param {Object} props Component props. Additional props are passed to the Gutenberg modal.
 * @param {React.ReactNode} [props.title="Yoast SEO"] The modal title. A node allows a help link next to it; pair that with
 *                                            `contentLabel` so the accessible name stays the title text alone.
 * @param {string} [props.className=defaultModalClassName] The modal className.
 * @param {boolean} [props.showYoastIcon=true] Whether to show the Yoast icon.
 * @param {React.ReactNode} [props.children=null] The modal content.
 * @param {string} [props.additionalClassName=""] Additional className for the modal.
 *
 * @returns {JSX.Element} The modal.
 */
const Modal = ( {
	title = "Yoast SEO",
	className = defaultModalClassName,
	showYoastIcon = true,
	children = null,
	additionalClassName = "",
	...props
} ) => {
	const icon = showYoastIcon ? <span className="yoast-icon" /> : null;

	return (
		<WpModal
			title={ title }
			className={ `${ className } ${ additionalClassName }` }
			icon={ icon }
			{ ...props }
		>
			{ children }
		</WpModal>
	);
};

export default Modal;
