import PropTypes from "prop-types";
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
 * @param {object} props Functional Component props.
 *
 * @returns {object} The modal.
 */
const Modal = ( props ) => {
	const {
		title,
		className,
		showYoastIcon,
		additionalClassName,
		...wpModalProps
	} = props;

	const icon = showYoastIcon ? <span className="yoast-icon" /> : null;

	return (
		<WpModal
			title={ title }
			className={ `${ className } ${ additionalClassName }` }
			icon={ icon }
			{ ...wpModalProps }
		>
			{ props.children }
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

Modal.defaultProps = {
	title: "Yoast SEO",
	className: defaultModalClassName,
	showYoastIcon: true,
	children: null,
	additionalClassName: "",
};

export default Modal;
