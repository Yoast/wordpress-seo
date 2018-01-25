<?php

namespace Yoast\Tests\Doubles;

class Indexable_Term extends \Yoast\YoastSEO\Watchers\Indexable_Term {
	/**
	 * @inheritdoc
	 */
	public function get_meta_lookup() {
		return parent::get_meta_lookup();
	}

	/**
	 * @inheritdoc
	 */
	public function get_sitemap_include_value( $value ) {
		return parent::get_sitemap_include_value( $value );
	}
}
