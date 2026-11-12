import { Alert } from "@yoast/ui-library";
import { Body, title } from "./messages/bad-wp-request";

/**
 * @param {Object} props Component props.
 * @param {string} [props.errorMessage=""] The error message to display.
 *
 * @returns {JSX.Element} The element.
 */
export const BadWPRequestAlert = ( { errorMessage = "" } ) => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body errorMessage={ errorMessage } />
	</Alert>
);
