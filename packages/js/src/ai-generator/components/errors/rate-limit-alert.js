import { Alert } from "@yoast/ui-library";
import { Body, title } from "./messages/rate-limit";

/**
 * @returns {JSX.Element} The element.
 */
export const RateLimitAlert = () => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body />
	</Alert>
);
