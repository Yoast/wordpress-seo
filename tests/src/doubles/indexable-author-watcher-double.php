<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Watchers\Indexable_Author_Watcher;

class Indexable_Author_Watcher_Double extends Indexable_Author_Watcher {
	/**
	 * @inheritdoc
	 */
	public function get_indexable( $user_id, $auto_create = true ) {
		return parent::get_indexable( $user_id, $auto_create );
	}
}
