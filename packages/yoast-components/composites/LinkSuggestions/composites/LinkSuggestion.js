import React from "react";
import PropTypes from "prop-types";

import { localize } from "../../../utils/i18n";

/**
 * @summary Represents a suggestion component with a copy url to clipboard icon and a text value.
 *
 * @param {string}   value     The text value.
 * @param {string}   url       The URL.
 * @param {boolean}   isActive whether the URL is active.
 * @param {function} translate Translation.
 * @returns {JSX} The rendered suggestion.
 * @constructor
 */
const LinkSuggestion = ( { value, url, isActive, translate } ) => {
	const label = translate( "Copy link" );
	let ariaLabel = translate( "Copy link to suggested article: %s" );
	ariaLabel = ariaLabel.replace( "%s", value );

	let className = "yoast-link-suggestion-icon yoast-tooltip yoast-tooltip-alt yoast-tooltip-s";
	if ( isActive ) {
		className += " yoast-link-suggestion__check";
	}

	if ( ! isActive ) {
		className += " yoast-link-suggestion__copy";
	}

	/**
	 * @summary Resets the button aria-label and data-label to their default values.
	 *
	 * @param {Object} evt The blur SyntheticEvent on the button.
	 * @returns {void}
	 */
	const resetLabels = ( evt ) => {
		evt.nativeEvent.target.setAttribute( "aria-label", ariaLabel );
		evt.nativeEvent.target.setAttribute( "data-label", label );
	};

	return (
		<div className="yoast-link-suggestion">
			<button
				type="button" className={ className }
				onBlur={ resetLabels }
				data-clipboard-text={ url } aria-label={ ariaLabel } data-label={ label }
			>
				<span className="screen-reader-text">{ label }</span>
			</button>
			<a href={ url } className="yoast-link-suggestion__value" target="_blank">{ value }</a>
		</div>
	);
};

LinkSuggestion.propTypes = {
	value: PropTypes.string,
	url: PropTypes.string,
	isActive: PropTypes.bool,
	translate: PropTypes.func,
};

export default localize( LinkSuggestion );
