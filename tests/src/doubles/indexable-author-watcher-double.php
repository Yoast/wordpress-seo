<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Watchers\Indexable_Author;

class Indexable_Author_Watcher extends Indexable_Author {
	/**
	 * @inheritdoc
	 */
	public function get_indexable( $user_id, $auto_create = true ) {
		return parent::get_indexable( $user_id, $auto_create );
	}
}
