import { Alert } from "@yoast/ui-library";
import { Body, title } from "./messages/site-unreachable";

/**
 * @returns {JSX.Element} The element.
 */
export const SiteUnreachableAlert = () => (
	<Alert variant="error">
		<span className="yst-block yst-font-medium">{ title }</span>
		<Body />
	</Alert>
);
