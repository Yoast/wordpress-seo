<?php

namespace Yoast\WP\SEO\Indexables\Domain;

/**
 * The Last Batch Count object.
 */
class Last_Batch_Count {

	/**
	 * The count value of the last batch.
	 *
	 * @var int
	 */
	private $last_batch;

	/**
	 * The constructor.
	 *
	 * @param int $last_batch The batch number.
	 */
	public function __construct( int $last_batch ) {
		$this->last_batch = $last_batch;
	}

	/**
	 * Returns the last Batch count.
	 *
	 * @return int
	 */
	public function get_last_batch(): int {
		return $this->last_batch;
	}
}
