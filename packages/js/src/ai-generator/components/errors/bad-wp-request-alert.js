import { Alert } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Body, title } from "./messages/bad-wp-request";

/**
 * @param {string} [errorMessage=""] The error message to display.
 * @returns {JSX.Element} The element.
 */
export const BadWPRequestAlert = ( { errorMessage = "" } ) => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body errorMessage={ errorMessage } />
	</Alert>
);

BadWPRequestAlert.propTypes = {
	errorMessage: PropTypes.string,
};
