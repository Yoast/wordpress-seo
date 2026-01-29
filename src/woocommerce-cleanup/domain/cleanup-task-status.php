<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Domain;

/**
 * Value object representing the status of a cleanup task.
 */
class Cleanup_Task_Status {

	/**
	 * The last processed product ID (cursor).
	 *
	 * @var int
	 */
	private $cursor;

	/**
	 * Whether the cleanup has been completed.
	 *
	 * @var bool
	 */
	private $is_completed;

	/**
	 * Constructor.
	 *
	 * @param int  $cursor       The last processed product ID.
	 * @param bool $is_completed Whether the cleanup has been completed.
	 */
	public function __construct( int $cursor, bool $is_completed ) {
		$this->cursor       = $cursor;
		$this->is_completed = $is_completed;
	}

	/**
	 * Gets the cursor value.
	 *
	 * @return int The last processed product ID.
	 */
	public function get_cursor(): int {
		return $this->cursor;
	}

	/**
	 * Checks if the cleanup is completed.
	 *
	 * @return bool True if completed.
	 */
	public function is_completed(): bool {
		return $this->is_completed;
	}
}
