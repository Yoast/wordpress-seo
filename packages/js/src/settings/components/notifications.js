/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "@wordpress/element";
import { map, get } from "lodash";
import { useDispatch } from "@wordpress/data";
import { Notifications as NotificationsUi } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import { Link } from "react-router-dom";
import { flattenObject } from "../utils";
import { useSelectSettings } from "../hooks";
import { STORE_NAME } from "../constants";

/**
 * @returns {void}
 */
const useValidationErrorsNotification = () => {
	const { submitCount, isValid, errors } = useFormikContext();
	const { addNotification, removeNotification } = useDispatch( STORE_NAME );
	const [ prevSubmitCount, setPrevSubmitCount ] = useState( 0 );
	const validationErrorsNotification = useSelectSettings( "selectNotification", [], "validation-errors" );

	useEffect( () => {
		if ( isValid && validationErrorsNotification ) {
			removeNotification( "validation-errors" );
		}
	}, [ isValid, validationErrorsNotification ] );

	useEffect( () => {
		if ( ! isValid && submitCount > prevSubmitCount ) {
			addNotification( {
				id: "validation-errors",
				variant: "error",
				size: "large",
				title: __( "Oh no! It seems your form contains invalid data. Please review the following fields:", "wordpress-seo" ),
			} );
		}
		if ( submitCount > prevSubmitCount ) {
			setPrevSubmitCount( submitCount );
		}
	}, [ submitCount, errors, isValid ] );
};

/**
 *
 * @param {string} id The id.
 * @returns {JSX.Element} The validation errors notification.
 */
const ValidationErrorsNotification = ( { id, onDismiss, ...props } ) => {
	const { errors } = useFormikContext();
	const searchIndex = useSelectSettings( "selectSearchIndex" );
	const flatErrors = useMemo( () => flattenObject( errors ), [ errors ] );

	return (
		<NotificationsUi.Notification key={ id } id={ id } onDismiss={ onDismiss } { ...props }>
			<ul className="yst-list-disc yst-mt-1 yst-ml-4 yst-space-y-2">
				{ map( flatErrors, ( error, name ) => error && (
					<li key={ name }>
						<Link to={ `${ get( searchIndex, `${ name }.route`, "404" ) }#${ get( searchIndex, `${ name }.fieldId`, "" ) }` }>
							{ `${get( searchIndex, `${ name }.routeLabel`, "" )} - ${get( searchIndex, `${ name }.fieldLabel`, "" )}` }
						</Link>
						:&nbsp;
						{ error }
					</li>
				) ) }
			</ul>
		</NotificationsUi.Notification>
	);
};

ValidationErrorsNotification.propTypes = {
	id: PropTypes.string.isRequired,
	onDismiss: PropTypes.func,
};

/**
 * The Notifications component shows general notifications in the top-middle of the window.
 * @returns {JSX.Element} The Notifications component.
 */
const Notifications = () => {
	useValidationErrorsNotification();
	const { removeNotification } = useDispatch( STORE_NAME );
	const notifications = useSelectSettings( "selectNotifications" );
	const enrichedNotifications = useMemo( () => map( notifications, notification => ( {
		...notification,
		onDismiss: removeNotification,
		autoDismiss: notification.variant === "success" ? 5000 : null,
		dismissScreenReaderLabel: __( "Dismiss", "wordpress-seo" ),
	} ) ), [ notifications ] );

	return (
		<NotificationsUi notifications={ enrichedNotifications } position="bottom-left">
			{ enrichedNotifications.map( ( notification ) => {
				if ( notification.id === "validation-errors" ) {
					return <ValidationErrorsNotification key={ notification.id } { ...notification } />;
				}
				return <NotificationsUi.Notification key={ notification.id } { ...notification } />;
			} ) }
		</NotificationsUi>
	);
};

export default Notifications;
