<?php

namespace Yoast\WP\SEO\Indexables\Domain;

/**
 * The Batch_Size domain class.
 */
class Batch_Size {

	/**
	 * The batch size.
	 *
	 * @var int $batch_size
	 */
	private $batch_size;

	/**
	 * The constructor.
	 *
	 * @param int $batch_size The batch size.
	 */
	public function __construct( int $batch_size ) {
		$this->batch_size = $batch_size;
	}

	/**
	 * Returns the batch size.
	 *
	 * @return int
	 */
	public function get_batch_size(): int {
		return $this->batch_size;
	}

	/**
	 * Checks if the batch is bigger than the count.
	 *
	 * @param int $count The count to check.
	 *
	 * @return bool
	 */
	public function should_keep_going( int $count ): bool {
		return $count >= $this->get_batch_size();
	}
}
