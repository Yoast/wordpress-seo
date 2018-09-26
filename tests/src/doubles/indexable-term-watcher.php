<?php

namespace Yoast\Tests\Doubles;

class Indexable_Term_Watcher extends \Yoast\YoastSEO\Watchers\Indexable_Term {
	/**
	 * @inheritdoc
	 */
	public function get_meta_lookup() {
		return parent::get_meta_lookup();
	}

	/**
	 * @inheritdoc
	 */
	public function get_noindex_value( $value ) {
		return parent::get_noindex_value( $value );
	}

	/**
	 * @inheritdoc
	 */
	public function get_indexable( $term_id, $taxonomy, $auto_create = true ) {
		return parent::get_indexable( $term_id, $taxonomy, $auto_create );
	}
}
