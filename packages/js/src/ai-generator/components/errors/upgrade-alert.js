import { Alert } from "@yoast/ui-library";
import { Body, title } from "./messages/upgrade";

/**
 * @returns {JSX.Element} The element.
 */
export const UpgradeAlert = () => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body />
	</Alert>
);
