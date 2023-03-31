<?php

namespace Yoast\WP\SEO\Analystics\domain;

class Missing_Indexable_Count {


	private $indexable_type;
	private $count;

	/**
	 * @param string $indexable_type
	 * @param int    $count
	 */
	public function __construct( string $indexable_type, int $count ) {
		$this->indexable_type = $indexable_type;
		$this->count          = $count;
	}


}
