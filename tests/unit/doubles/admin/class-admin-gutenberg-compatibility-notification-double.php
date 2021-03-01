<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Admin;

/**
 * Test helper class.
 *
 * Class WPSEO_Gutenberg_Compatibility_Double.
 */
class WPSEO_Admin_Gutenberg_Compatibility_Notification_Double extends WPSEO_Admin_Gutenberg_Compatibility_Notification {

	/**
	 * Sets the dependency instances.
	 *
	 * @param WPSEO_Gutenberg_Compatibility $compatibility_checker The WPSEO_Gutenberg_Compatibility object.
	 * @param Yoast_Notification_Center     $notification_center    The Yoast_Notification_Center object.
	 */
	public function set_dependencies( $compatibility_checker, $notification_center ) {
		$this->compatibility_checker = $compatibility_checker;
		$this->notification_center   = $notification_center;
	}
}
