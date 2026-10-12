import { Alert } from "@yoast/ui-library";
import { Body, title } from "./messages/timeout";

/**
 * @returns {JSX.Element} The element.
 */
export const TimeoutAlert = () => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body />
	</Alert>
);
