<?php

namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure;

use Yoast\WP\SEO\Dashboard\Infrastructure\Repositories\Permanently_Dismissed_Site_Kit_Widget_Repository_Interface;

/**
 * Fake class for the Permanently Dismissed Site Kit Widget Repository.
 *
 * @group Permanently_Dismissed_Site_Kit_Widget_Repository
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Permanently_Dismissed_Site_Kit_Widget_Repository_Fake implements Permanently_Dismissed_Site_Kit_Widget_Repository_Interface {

	/**
	 * Checks if the Site Kit widget is dismissed.
	 *
	 * @return bool
	 */
	public function is_site_kit_widget_dismissed(): bool {
		// Return a fake value for testing purposes.
		return true;
	}

	/**
	 * Sets the Site Kit widget dismissal status.
	 *
	 * @param bool $is_dismissed The dismissal status.
	 *
	 * @return bool
	 */
	public function set_site_kit_widget_dismissal( bool $is_dismissed ): bool {
		// Return the passed value for testing purposes.
		return $is_dismissed;
	}
}
