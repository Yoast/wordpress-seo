// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as typings from "@wordpress/date";
import { DateSettings } from "@wordpress/date";

declare module "@wordpress/date" {
	export function __experimentalGetSettings(): DateSettings
}
