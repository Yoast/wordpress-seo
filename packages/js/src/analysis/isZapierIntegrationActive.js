import { logOnce } from "@yoast/helpers";

/**
 * Returns whether the Zapier integration is active.
 *
 * @deprecated 20.7
 *
 * @returns {boolean} Whether the Zapier integration is active.
 */
export default function isZapierIntegrationActive() {
	logOnce( "@yoast/analysis/isZapierIntegrationActive", "The isZapierIntegrationActive function is deprecated since Yoast SEO 20.7." );

	return false;
}
