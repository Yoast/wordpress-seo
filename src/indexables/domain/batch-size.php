<?php

namespace Yoast\WP\SEO\Indexables\Domain;

class Batch_Size {

	/**
	 * @var int $batch_size The batch size.
	 */
	private $batch_size;

	/**
	 * @param int $batch_size
	 */
	public function __construct( int $batch_size ) {
		$this->batch_size = $batch_size;
	}

	/**
	 * @return int
	 */
	public function get_batch_size(): int {
		return $this->batch_size;
	}

	public function should_keep_going( ?int $count ): bool {
		return $count >= $this->get_batch_size();
	}
}
