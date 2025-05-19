import { useSelect } from "@wordpress/data";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { STORE_NAME_AI } from "../constants";
import { Button, Notifications } from "@yoast/ui-library";

/**
 * The notification component when the user has reached the limit of the AI.
 *
 * @param {string} className The class name.
 * @param {string} size The size of the notification.
 * @returns {JSX.Element} The element.
 */
export const SparksLimitNotification = ( { className = "", size = "" } ) => {
	const counts = useSelect( ( select ) => select( STORE_NAME_AI ).selectUsageCount(), [] );
	const limit = useSelect( ( select ) => select( STORE_NAME_AI ).selectUsageCountLimit(), [] );
	const [ showNotification, setShowNotification ] = useState( false );

	useEffect( () => {
		setShowNotification( counts === limit );
	}, [ counts, limit ] );

	const handleDismiss = useCallback( () => {
		setShowNotification( false );
	}, [] );

	return showNotification &&
		<Notifications.Notification
			id="ai-sparks-limit"
			variant="info"
			size={ size }
			dismissScreenReaderLabel={ __( "Got it!", "wordpress-seo" ) }
			title={ sprintf(
				/* translators: %s is the number of the sparks allowed. */
				_n(
					"You've used %s spark this month.",
					"You've used %s sparks this month.",
					limit,
					"wordpress-seo-premium"
				),
				limit
			) }
			className={ className }
		>
			<p>
				{ __( "As long as this is a beta feature, you get unlimited sparks.", "wordpress-seo" ) }
			</p>
			<div className="yst-mt-3 yst--me-8 yst-justify-end yst-flex">
				<Button type="button" variant="primary" size="small" onClick={ handleDismiss }>
					{ __( "Got it!", "wordpress-seo" ) }
				</Button>
			</div>
		</Notifications.Notification>;
};

SparksLimitNotification.propTypes = {
	className: PropTypes.string,
	size: PropTypes.string,
};
