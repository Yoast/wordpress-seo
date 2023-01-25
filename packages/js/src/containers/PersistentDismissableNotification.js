import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import withPersistentDismiss from "./withPersistentDismiss";

/**
 * @param {string} id The id.
 * @param {boolean} hasIcon Wether or not to show icon before title.
 * @param {string} title The title.
 * @param {JSX.Element|null} image The image or null if no image.
 * @param {isAlertDismissed} boolean Wether or not the notification is dismissed.
 * @param {Function} onDismissed The dismissal prop to be renamed for Notification component.
 *
 * @returns {Component} The composed Notification component.
 */
const PersistentDismissableNotification = ( {
	children,
	id,
	hasIcon = true,
	title,
	image: Image = null,
	isAlertDismissed,
	onDismissed,
} ) => {
	return isAlertDismissed ? null : (
		<div id={ id } className="notice-yoast yoast is-dismissible">
			<div className="notice-yoast__container">
				<div>
					<div className="notice-yoast__header">
						{ hasIcon && <span className="yoast-icon" /> }
						<h2 className="notice-yoast__header-heading">{ title }</h2>
					</div>
					<p>{ children }</p>
				</div>
				{ Image && <Image height="60" /> }
			</div>
			<button className="notice-dismiss" onClick={ onDismissed }>
				<span className="screen-reader-text">{ __( "Dismiss this notice.", "wordpress-seo" ) }</span>
			</button>
		</div>
	);
};

PersistentDismissableNotification.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string.isRequired,
	hasIcon: PropTypes.bool,
	title: PropTypes.string.isRequired,
	image: PropTypes.elementType,
	isAlertDismissed: PropTypes.bool.isRequired,
	onDismissed: PropTypes.func.isRequired,
};

export default withPersistentDismiss( PersistentDismissableNotification );


