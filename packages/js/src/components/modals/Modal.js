/* eslint-disable complexity */
import { Modal as WpModal } from "@wordpress/components";
import PropTypes from "prop-types";

/**
 * Default className for our Modal.
 */
export const defaultModalClassName = "yoast yoast-gutenberg-modal";

/**
 * A modal based on the Gutenberg modal that adds a Yoast icon and yoast classes by default.
 *
 * Accepts all props that the Gutenberg modal accepts.
 *
 * @param {string} [title="Yoast SEO"] The modal title.
 * @param {string} [className=defaultModalClassName] The modal className.
 * @param {boolean} [showYoastIcon=true] Whether to show the Yoast icon.
 * @param {React.ReactNode} [children=null] The modal content.
 * @param {string} [additionalClassName=""] Additional className for the modal.
 * @param {...Object} [props] Additional props passed to the Gutenberg modal.
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

Modal.propTypes = {
	title: PropTypes.string,
	className: PropTypes.string,
	showYoastIcon: PropTypes.bool,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	additionalClassName: PropTypes.string,
};

export default Modal;
