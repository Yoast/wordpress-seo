<?php


namespace doubles\config;

use Yoast\WP\SEO\Config\Indexable_Builder_Versions;

class Indexable_Builder_Versions_Double extends Indexable_Builder_Versions {

	public function get_versions() {
		return parent::$indexable_builder_versions_by_type();
	}
}
