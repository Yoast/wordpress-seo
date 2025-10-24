/* eslint-disable complexity */
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useDispatch } from "@wordpress/data";
import { useCallback, useContext, useMemo } from "@wordpress/element";
import { Button } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";
import { STORE_NAME } from "../constants";
import { AlertsContext } from "../contexts/alerts-context";
import {
	PingOtherAdminsAlertItem,
	DefaultAlertItem,
} from "./alert-items";

/**
 * Renders the appropriate alert item component based on the alert ID.
 */
const AlertItem = ( { id, nonce, dismissed, message } ) => {
	const commonProps = { id, nonce, dismissed, message };
	const { bulletClass = "" } = useContext( AlertsContext );
	const { toggleAlertStatus } = useDispatch( STORE_NAME );
	const Eye = dismissed ? EyeIcon : EyeOffIcon;
	const toggleAlert = useCallback( async() => {
		toggleAlertStatus( id, nonce, dismissed );
	}, [ id, nonce, dismissed, toggleAlertStatus ] );
	const AlertContent = useMemo( () => {
		switch ( id ) {
			case "wpseo-ping-other-admins":
				return <PingOtherAdminsAlertItem { ...commonProps } />;
			default:
				return <DefaultAlertItem { ...commonProps } />;
		}
	}, [ id ] );

	return (
		<li
			key={ id }
			className="yst-flex yst-justify-between yst-gap-x-5 yst-border-b yst-border-slate-200 last:yst-border-b-0 yst-py-6 first:yst-pt-0 last:yst-pb-0"
		>
			<div className={ classNames( "yst-mt-1", dismissed && "yst-opacity-50" ) }>
				<svg width="11" height="11" className={ bulletClass }>
					<circle cx="5.5" cy="5.5" r="5.5" />
				</svg>
			</div>
			{ AlertContent }
			<Button variant="secondary" size="small" className="yst-self-center yst-h-8" onClick={ toggleAlert }>
				<Eye className="yst-w-4 yst-h-4 yst-text-neutral-700" />
			</Button>
		</li>
	);
};

AlertItem.propTypes = {
	id: PropTypes.string.isRequired,
	nonce: PropTypes.string.isRequired,
	dismissed: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
};

/**
 * @param {string} [className=""] The class name.
 * @param {Object[]} [items=[]] The list of items.
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
		id: PropTypes.string,
		nonce: PropTypes.string,
		dismissed: PropTypes.bool,
	} ) ),
};
