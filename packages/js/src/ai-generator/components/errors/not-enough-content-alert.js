import { Alert } from "@yoast/ui-library";
import { Body, title } from "./messages/not-enough-content";

/**
 * @returns {JSX.Element} The element.
 */
export const NotEnoughContentAlert = () => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body />
	</Alert>
);
