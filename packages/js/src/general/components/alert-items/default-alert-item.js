import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * Default alert item component.
 */
export const DefaultAlertItem = ( { dismissed, message } ) => {
	return (
		<div
			className={ classNames(
				"yst-text-sm yst-text-slate-600 yst-grow",
				dismissed && "yst-opacity-50" ) }
			dangerouslySetInnerHTML={ { __html: message } }
		/>
	);
};

DefaultAlertItem.propTypes = {
	id: PropTypes.string.isRequired,
	nonce: PropTypes.string.isRequired,
	dismissed: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
};