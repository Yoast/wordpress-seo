// External dependencies.
import PropTypes from "prop-types";
import { Modal } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";

// Yoast dependencies.
import { makeOutboundLink } from "@yoast/helpers";

/**
 * The WorkoutUpsell component.
 *
 * @param {object} props The props object.
 *
 * @returns {object} The WorkoutUpsell component.
 */
const WorkoutUpsell = ( props ) => {
	const {
		title,
		upsellLink,
		addOn,
		additionalClassNames,
		onRequestClose,
		...wpModalProps
	} = props;

	const Link = makeOutboundLink();

	return (
		<Modal
			title={ title }
			className={ additionalClassNames }
			onRequestClose={ onRequestClose }
			{ ...wpModalProps }
		>
			<div className="yoast-content-container">
				<div className="yoast-modal-content">
					{ props.children }
				</div>
			</div>
			<div className="yoast-notice-container">
				<hr />
				<div className="yoast-button-container">
					<Link href={ upsellLink } className="yoast-button-upsell">
						{
							sprintf(
								/* translators: %s : Expands to the add-on name. */
								__( "Buy %s", "wordpress-seo" ),
								addOn
							)
						}
					</Link>
				</div>
			</div>
		</Modal>
	);
};

WorkoutUpsell.propTypes = {
	title: PropTypes.string.isRequired,
	upsellLink: PropTypes.string.isRequired,
	addOn: PropTypes.string.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	additionalClassNames: PropTypes.string,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
};

WorkoutUpsell.defaultProps = {
	additionalClassNames: "",
	children: null,
};

export default WorkoutUpsell;
