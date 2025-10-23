/* eslint-disable complexity */
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { useDispatch } from "@wordpress/data";
import { useCallback, useContext } from "@wordpress/element";
import { Button, TextField } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";
import { STORE_NAME } from "../constants";
import { AlertsContext } from "../contexts/alerts-context";
import { noop } from "lodash";

/**
 * The alert item object.
 *
 * @param {string} [id=""] The alert id.
 * @param {string} [nonce=""] The alert nonce.
 * @param {boolean} [dismissed=false] Whether the alert is dismissed or not.
 * @param {string} [message=""] The alert message.
 * @param {Object|null} [inputField=null] The alert input field.
 *
 * @returns {JSX.Element} The alert item component.
 */
const AlertItem = ( { id = "", nonce = "", dismissed = false, message = "", inputField = null } ) => {
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
			<div
				className={ classNames(
					"yst-text-sm yst-text-slate-600 yst-grow",
					dismissed && "yst-opacity-50" ) }
			>
				<div
					dangerouslySetInnerHTML={ { __html: message } }
				/>
				{ inputField &&
					<div className="yst-flex yst-items-end yst-gap-2 yst-mt-2">
						<TextField
							type="text"
							name={ id + "-input-field" }
							id={ id + "-input-field" }
							label={ inputField.label }
							onChange={ noop }
							placeholder={ inputField.placeholder }
							className="yst-flex-1"
						/>
						<Button
							variant="primary"
							size="large"
						>
							{ inputField.button_text }
							<div
								className="yst-ml-2 yst-w-4"
								dangerouslySetInnerHTML={ { __html: inputField.button_icon } }
							/>
						</Button>
					</div>
				}
				{ inputField?.footer_text && <p
					className="yst-text-slate-600 yst-text-xxs yst-leading-4 yst-mt-1"
					dangerouslySetInnerHTML={ { __html: inputField.footer_text } }
				/>
				}
			</div>

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
					inputField={ item.input_field }
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
		inputField: PropTypes.object,
	} ) ),
};
