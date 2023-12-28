<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Admin_Bar_Menu;

/**
 * Test Helper Class.
 */
final class Admin_Bar_Menu_Double extends WPSEO_Admin_Bar_Menu {

	/**
	 * Gets the focus keyword for a given post.
	 *
	 * @param WP_Post $post Post object to get its focus keyword.
	 *
	 * @return string Focus keyword, or empty string if none available.
	 */
	public function get_post_focus_keyword( $post ) {
		return parent::get_post_focus_keyword( $post );
	}
}
