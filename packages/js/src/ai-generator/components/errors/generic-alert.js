import { Alert } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR } from "../../constants";
import { Body, title } from "./messages/generic";

/**
 * @param {string} [linkStoreName] The store to read the common-errors and support links from.
 *                                  Defaults to the block editor's store; pass a different store
 *                                  name when rendering outside the block editor (e.g. the AI
 *                                  consent screen on the user profile page).
 * @param {string} [className] An optional class name.
 *
 * @returns {JSX.Element} The element.
 */
export const GenericAlert = ( { linkStoreName = STORE_NAME_EDITOR, className = "" } ) => (
	<Alert variant="error" className={ className }>
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body linkStoreName={ linkStoreName } />
	</Alert>
);
GenericAlert.propTypes = {
	linkStoreName: PropTypes.string,
	className: PropTypes.string,
};
