<?php

namespace Yoast\WP\SEO\Tests\Doubles\Admin\Metabox;

use WPSEO_Metabox;
use WPSEO_Metabox_Section_Additional;

/**
 * Test Helper Class.
 */
class Metabox_Double extends WPSEO_Metabox {

	/**
	 * Returns metabox sections that have been added by other plugins.
	 *
	 * @return WPSEO_Metabox_Section_Additional[]
	 */
	public function get_additional_meta_sections() {
		return parent::get_additional_meta_sections();
	}
}
