/* eslint-disable complexity */
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useDispatch } from "@wordpress/data";
import { useCallback, useContext } from "@wordpress/element";
import { Button } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";
import { STORE_NAME } from "../constants";
import { AlertsContext } from "../contexts/alerts-context";
import { AlertContent } from "./alert-items/alert-content";

/**
 * Renders the appropriate alert item component based on the alert ID.
 *
 * @param {string} [id=""] The alert id.
 * @param {string} [nonce=""] The alert nonce.
 * @param {boolean} [dismissed=false] Whether the alert is dismissed or not.
 * @param {string} [message=""] The alert message.
 * @param {string} [resolveNonce=""] The nonce to resolve the alert.
 *
 * @returns {JSX.Element} The alert item component.
 */
const AlertItem = ( { id = "", nonce = "", dismissed = false, message = "", resolveNonce = "" } ) => {
	const { bulletClass = "" } = useContext( AlertsContext );
	const { toggleAlertStatus } = useDispatch( STORE_NAME );
	const Eye = dismissed ? EyeIcon : EyeOffIcon;
	const toggleAlert = useCallback( async() => {
		toggleAlertStatus( id, nonce, dismissed );
	}, [ id, nonce, dismissed, toggleAlertStatus ] );

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
			<AlertContent
				id={ id }
				dismissed={ dismissed }
				message={ message }
				resolveNonce={ resolveNonce }
			/>
			<Button variant="secondary" size="small" className="yst-self-center yst-h-8" onClick={ toggleAlert }>
				<Eye className="yst-w-4 yst-h-4 yst-text-neutral-700" />
			</Button>
		</li>
	);
};

AlertItem.propTypes = {
	id: PropTypes.string,
	nonce: PropTypes.string,
	dismissed: PropTypes.bool,
	message: PropTypes.string,
	resolveNonce: PropTypes.string,
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
					resolveNonce={ item.resolveNonce || "" }
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
		resolveNonce: PropTypes.string,
	} ) ),
};
