<?php

namespace Yoast\WP\SEO\Tests\Doubles\Helpers;

use Yoast\WP\SEO\Helpers\Current_Page_Helper;

/**
 * Test Helper Class.
 */
class Current_Page_Helper_Double extends Current_Page_Helper {

	/**
	 * Returns the permalink of the currently opened date archive.
	 *
	 * @return string The permalink of the currently opened date archive.
	 */
	public function get_non_cached_date_archive_permalink() {
		return parent::get_non_cached_date_archive_permalink();
	}
}
