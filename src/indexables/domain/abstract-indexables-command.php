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
	 * The plugin deactivated timestamp domain object.
	 * @var Plugin_Deactivated_Timestamp $plugin_deactivated_at
	 */
	protected $plugin_deactivated_at;

	/**
	 * @var Batch_Size $batch_size The batch size.
	 */
	private $batch_size;

	/**
	 * The constructor.
	 *
	 * @param int    $last_batch The last batch count.
	 * @param string $plugin_deactivated_at The plugin deactivated at timestamp.
	 */
	public function __construct(int $batch_size, int $last_batch, string $plugin_deactivated_at ) {
		$this->last_batch_count      = new Last_Batch_Count( $last_batch );
		$this->plugin_deactivated_at = new Plugin_Deactivated_Timestamp( $plugin_deactivated_at );
		$this->batch_size     = new Batch_Size( $batch_size );
	}

	/**
	 * Gets the last batch count domain object.
	 * @return Last_Batch_Count
	 */
	public function get_last_batch_count(): Last_Batch_Count {
		return $this->last_batch_count;
	}

	/**
	 * Gets the plugin deactivated at timestamp.
	 *
	 * @return Plugin_Deactivated_Timestamp
	 */
	public function get_plugin_deactivated_at(): Plugin_Deactivated_Timestamp {
		return $this->plugin_deactivated_at;
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
