<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Configuration;

/**
 * Interface for the Site Kit Usage Tracking Repository.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
interface Site_Kit_Usage_Tracking_Repository_Interface {

	/**
	 * Sets an option inside the Site Kit usage options array..
	 *
	 * @param string $element_name  The name of the array element to set.
	 * @param string $element_value The value of the array element  to set.
	 *
	 * @return bool False when the update failed, true when the update succeeded.
	 */
	public function set_site_kit_usage_tracking( string $element_name, string $element_value ): bool;

	/**
	 * Gets an option inside the Site Kit usage options array..
	 *
	 * @param string $element_name The name of the array element to get.
	 *
	 * @return string The value if present, empty string if not.
	 */
	public function get_site_kit_usage_tracking( string $element_name ): string;
}
