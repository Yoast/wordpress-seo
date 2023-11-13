<?php

namespace Yoast\WP\SEO\Indexables\Domain;

/**
 * The abstract indexables command class.
 */
abstract class Abstract_Indexables_Command {

	/**
	 * The last batch count domain object.
	 *
	 * @var Last_Batch_Count $last_batch_count
	 */
	protected $last_batch_count;

	/**
	 * The batch size.
	 *
	 * @var Batch_Size $batch_size
	 */
	private $batch_size;

	/**
	 * The constructor.
	 *
	 * @param int $batch_size The batch size.
	 * @param int $last_batch The last batch count.
	 */
	public function __construct( int $batch_size, int $last_batch ) {
		$this->last_batch_count = new Last_Batch_Count( $last_batch );
		$this->batch_size       = new Batch_Size( $batch_size );
	}

	/**
	 * Gets the last batch count domain object.
	 *
	 * @return Last_Batch_Count
	 */
	public function get_last_batch_count(): Last_Batch_Count {
		return $this->last_batch_count;
	}

	/**
	 * Gets the batch size.
	 *
	 * @return Batch_Size
	 */
	public function get_batch_size(): Batch_Size {
		return $this->batch_size;
	}
}
