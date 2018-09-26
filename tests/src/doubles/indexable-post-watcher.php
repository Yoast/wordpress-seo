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
}
