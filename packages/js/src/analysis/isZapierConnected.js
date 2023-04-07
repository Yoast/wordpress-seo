import { logOnce } from "@yoast/helpers";

/**
 * Returns whether the Zapier integration is connected.
 *
 * @deprecated 20.7
 *
 * @returns {boolean} Whether the Zapier integration is connected.
 */
export default function isZapierConnected() {
	logOnce( "@yoast/analysis/isZapierConnected", "The isZapierConnected function is deprecated since Yoast SEO 20.7." );

	return false;
}
