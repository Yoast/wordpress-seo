<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Watchers\Indexable_Post_Watcher;

class Indexable_Post_Watcher_Double extends Indexable_Post_Watcher {
	/**
	 * @inheritdoc
	 */
	public function get_indexable( $post_id, $auto_create = true ) {
		return parent::get_indexable( $post_id, $auto_create );
	}
}
