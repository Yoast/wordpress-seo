import classNames from "classnames";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import withPersistentDismiss from "./withPersistentDismiss";

/**
 * @param {string} id The id.
 * @param {boolean} hasIcon Whether or not to show icon before title.
 * @param {object | string} title The title.
 * @param {JSX.Element|null} image The image or null if no image.
 * @param {boolean} isAlertDismissed Whether or not the notification is dismissed.
 * @param {Function} onDismissed The dismissal prop to be renamed for Notification component.
 * @param {boolean} inEditorIntro Whether rendered inside EditorIntro. Adds a small top margin under the logo.
 *
 * @returns {Component} The composed Notification component.
 */
/* eslint-disable-next-line complexity */
export const PersistentDismissableNotification = ( {
	children,
	id,
	hasIcon = true,
	title,
	image: Image = null,
	isAlertDismissed,
	onDismissed,
	inEditorIntro = false,
} ) => {
	return isAlertDismissed ? null : (
		<div id={ id } className={ classNames( "notice-yoast yoast is-dismissible yoast-webinar-dashboard yoast-general-page-notices", inEditorIntro && "yst-mt-3" ) }>
			<div className="notice-yoast__container">
				<div>
					<div className="notice-yoast__header">
						{ hasIcon && <span className="yoast-icon" /> }
						<h2 className="notice-yoast__header-heading yoast-notice-migrated-header">{ title }</h2>
					</div>
					<div className="notice-yoast-content">
						<p>{ children }</p>
					</div>
				</div>
				{ Image && <Image height="60" /> }
			</div>
			<button type="button" className="notice-dismiss" onClick={ onDismissed }>
				<span className="screen-reader-text">
					{
						/* translators: Hidden accessibility text. */
						__( "Dismiss this notice.", "wordpress-seo" )
					}
				</span>
			</button>
		</div>
	);
};

PersistentDismissableNotification.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string.isRequired,
	hasIcon: PropTypes.bool,
	title: PropTypes.any.isRequired,
	image: PropTypes.elementType,
	isAlertDismissed: PropTypes.bool.isRequired,
	onDismissed: PropTypes.func.isRequired,
	inEditorIntro: PropTypes.bool,
};

export default withPersistentDismiss( PersistentDismissableNotification );


