import { Alert } from "@yoast/ui-library";
import { Body, title } from "./messages/unethical-request";

/**
 * @returns {JSX.Element} The element.
 */
export const UnethicalRequestAlert = () => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body />
	</Alert>
);
