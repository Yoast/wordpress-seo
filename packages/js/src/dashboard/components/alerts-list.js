import { Fragment, useContext, useCallback, useState } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { Button, Notifications } from "@yoast/ui-library";
import { EyeOffIcon, EyeIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { TOGGLE_ALERT_VISIBILITY } from "../constants";
import { AlertsContext } from "../contexts/alerts-context";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";

/**
 * The alert item object.
 *
 * @param {string} id The alert id.
 * @param {string} nonce The alert nonce.
 * @param {boolean} dismissed Whether the alert is dismissed or not.
 * @param {string} message The alert message.
 *
 * @returns {JSX.Element} The alert item component.
 */
const AlertItem = ( { id, nonce, dismissed, message  } ) => {
	const { bulletClass = "", type = "" } = useContext( AlertsContext );
	const { toggleAlertStatus } = useDispatch( "@yoast/dashboard" );
	const Eye = dismissed ? EyeOffIcon : EyeIcon;
	const [ toggleError, setToggleError ] = useState( false );

	const onToggleErrorDismiss = useCallback( () => {
		setToggleError( false );
	}, [ setToggleError ] );

	const toggleAlert = useCallback( async() => {
		const status = await toggleAlertStatus( id, nonce, dismissed );
		setToggleError( status.type === `${ TOGGLE_ALERT_VISIBILITY }/${ ASYNC_ACTION_NAMES.error }` );
	}, [ id, nonce, dismissed, toggleAlertStatus, setToggleError ] );

	return <Fragment>
		<li key={ id } className="yst-border-b yst-border-slate-200 last:yst-border-b-0 yst-py-6 first:yst-pt-0 last:yst-pb-0">
			<div className="yst-flex yst-justify-between yst-gap-5 yst-items-start">
				<div className={ classNames( "yst-mt-1",  dismissed && "yst-opacity-50" ) }>
					<svg width="11" height="11" className={ bulletClass }>
						<circle cx="5.5" cy="5.5" r="5.5" />
					</svg>
				</div>
				<div
					className={ classNames(
						"yst-text-sm yst-text-slate-600 yst-grow",
						dismissed && "yst-opacity-50" ) }
					dangerouslySetInnerHTML={ { __html: message } }
				/>


				<Button variant="secondary" size="small" className="yst-self-center yst-h-8" onClick={ toggleAlert }>
					<Eye className="yst-w-4 yst-h-4 yst-text-neutral-700" />
				</Button>
			</div>
		</li>
		<Notifications
			className="yst-mx-[calc(50%-50vw)] yst-transition-all lg:yst-left-44"
			position="bottom-left"
		>
			{	toggleError && <Notifications.Notification
				id={ `toggle-alert-error-${ id }` }
				title={ __( "Something went wrong", "wordpress-seo" ) }
				variant="error"
				dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) }
				size="large"
				autoDismiss={ 4000 }
				onDismiss={ onToggleErrorDismiss }
			>
				{ __( `This ${type} can't be hidden at this time. Please try again later.`, "wordpress-seo" ) }
			</Notifications.Notification> }
		</Notifications>
	</Fragment>;
};

AlertItem.propTypes = {
	id: PropTypes.string,
	nonce: PropTypes.string,
	dismissed: PropTypes.bool,
	message: PropTypes.string,
};

/**
 * @param {string} className The class name.
 * @param {Object[]} items The list of items.
 *
 * @returns {JSX.Element} The list component.
 */
export const AlertsList = ( { className = "", items = [] } ) => {
	if ( items.length === 0 ) {
		return null;
	}

	return (
		<ul className={ className }>
			{ items.map( ( item ) => (
				<AlertItem
					key={ item.id }
					id={ item.id }
					nonce={ item.nonce }
					dismissed={ item.dismissed }
					message={ item.message }
				/>
			) ) }
		</ul>
	);
};

AlertsList.propTypes = {
	className: PropTypes.string,
	items: PropTypes.arrayOf( PropTypes.shape( {
		message: PropTypes.string,
	} ) ),
};
