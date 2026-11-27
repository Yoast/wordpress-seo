/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import withPersistentDismiss from "./withPersistentDismiss";
import classNames from "classnames";

/**
 * @param {Object} props Component props.
 * @param {import("react").ReactNode} props.children The notification content.
 * @param {string} props.id The id.
 * @param {boolean} [props.hasIcon=true] Whether or not to show icon before title.
 * @param {*} props.title The title.
 * @param {?import("react").ElementType} [props.image=null] The image component or null if no image.
 * @param {boolean} props.isAlertDismissed Whether or not the notification is dismissed.
 * @param {Function} props.onDismissed The dismissal prop to be renamed for Notification component.
 * @param {string} [props.className=""] Additional class names.
 *
 * @returns {Component} The composed Notification component.
 */
export const PersistentDismissableNotification = ( {
	children,
	id,
	hasIcon = true,
	title,
	image: Image = null,
	isAlertDismissed,
	onDismissed,
	className = "",
} ) => {
	return isAlertDismissed ? null : (
		<div id={ id } className={ classNames( "notice-yoast yoast is-dismissible", className ) }>
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

export default withPersistentDismiss( PersistentDismissableNotification );
