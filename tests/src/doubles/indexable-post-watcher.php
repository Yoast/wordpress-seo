<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Watchers\Indexable_Post;

class Indexable_Post_Watcher extends Indexable_Post {
	/**
	 * @inheritdoc
	 */
	public function get_indexable( $post_id, $auto_create = true ) {
		return parent::get_indexable( $post_id, $auto_create );
	}

	/**
	 * @inheritdoc
	 */
	public function get_indexable_fields() {
		return parent::get_indexable_fields();
	}

	/**
	 * @inheritdoc
	 */
	public function save_indexable_meta( $indexable, $formatted_data ) {
		parent::save_indexable_meta( $indexable, $formatted_data );
	}

	/**
	 * @inheritdoc
	 */
	public function get_indexable_meta_fields() {
		return parent::get_indexable_meta_fields();
	}
}
