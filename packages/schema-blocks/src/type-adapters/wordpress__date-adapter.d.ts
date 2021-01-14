// Import everything, so we get the existing type definitions.
import * as typings from "@wordpress/date";

declare module "@wordpress/date" {
	export function __experimentalGetSettings(): typings.DateSettings
}
