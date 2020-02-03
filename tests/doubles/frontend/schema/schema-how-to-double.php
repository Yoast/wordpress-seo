<?php

namespace Yoast\WP\SEO\Tests\Doubles\Frontend\Schema;

use WPSEO_Schema_HowTo;

/**
 * Test Helper Class.
 */
class Schema_HowTo_Double extends WPSEO_Schema_HowTo {

	/**
	 * Determine whether we're part of an article or a webpage.
	 *
	 * @return string A reference URL.
	 */
	public function get_main_schema_id() {
		return parent::get_main_schema_id();
	}

	/**
	 * Generate image schema from attachment id.
	 *
	 * @param int $id Attachment id.
	 *
	 * @return array Image schema.
	 */
	public function get_image_schema( $id ) {
		return parent::get_image_schema( $id );
	}
}
