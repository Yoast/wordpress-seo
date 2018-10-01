<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Watchers\Indexable_Term_Watcher;

class Indexable_Term_Watcher_Double extends Indexable_Term_Watcher {
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
