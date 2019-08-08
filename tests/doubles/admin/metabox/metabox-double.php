<?php

namespace Yoast\WP\Free\Tests\Doubles\Admin\Metabox;

use WPSEO_Metabox;

/**
 * Test Helper Class.
 */
class Metabox_Double extends WPSEO_Metabox {

	/**
	 * Returns metabox sections that have been added by other plugins.
	 *
	 * @return \WPSEO_Metabox_Section_Additional[]
	 */
	public function get_additional_meta_sections() {
		return parent::get_additional_meta_sections();
	}
}
