<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Configuration;

use Yoast\WP\SEO\Dashboard\Infrastructure\Configuration\Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface;

/**
 * Fake class for the Permanently Dismissed Site Kit Configuration Repository.
 *
 * @group Permanently_Dismissed_Site_Kit_Configuration_Repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Permanently_Dismissed_Site_Kit_Configuration_Repository_Fake implements Permanently_Dismissed_Site_Kit_Configuration_Repository_Interface {

	/**
	 * Checks if the Site Kit configuration is dismissed.
	 *
	 * @return bool
	 */
	public function is_site_kit_configuration_dismissed(): bool {
		// Return a fake value for testing purposes.
		return true;
	}

	/**
	 * Sets the Site Kit configuration dismissal status.
	 *
	 * @param bool $is_dismissed The dismissal status.
	 *
	 * @return bool
	 */
	public function set_site_kit_configuration_dismissal( bool $is_dismissed ): bool {
		// Return the passed value for testing purposes.
		return $is_dismissed;
	}
}
