<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Admin\Formatter;

use WPSEO_Term_Metabox_Formatter;

/**
 * Test Helper Class.
 */
final class Term_Metabox_Formatter_Double extends WPSEO_Term_Metabox_Formatter {

	/**
	 * Gets the image URL for the term's social preview.
	 *
	 * @return string|null The image URL for the social preview.
	 */
	public function get_image_url() {
		return parent::get_image_url();
	}

	/**
	 * Overrides the parent method.
	 *
	 * @return bool Whether the social templates should be used.
	 */
	public function use_social_templates() {
		return false;
	}
}
