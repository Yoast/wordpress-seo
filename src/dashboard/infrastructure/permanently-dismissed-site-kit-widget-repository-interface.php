<?php
namespace Yoast\WP\SEO\Dashboard\Infrastructure;

/**
 * Interface for the Permanently Dismissed Site Kit Widget Repository.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
interface Permanently_Dismissed_Site_Kit_Widget_Repository_Interface {

	/**
	 * Sets the Site Kit widget dismissal status.
	 *
	 * @param bool $is_dismissed The dismissal status.
	 *
	 * @return bool False when the update failed, true when the update succeeded.
	 */
	public function set_site_kit_widget_dismissal( bool $is_dismissed ): bool;

	/**
	 * Checks if the Site Kit widget is dismissed permanently.
	 * *
	 *
	 * @return bool True when the widget is dismissed, false when it is not.
	 */
	public function is_site_kit_widget_dismissed(): bool;
}
