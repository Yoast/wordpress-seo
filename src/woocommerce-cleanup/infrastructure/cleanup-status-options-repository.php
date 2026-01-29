<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Woocommerce_Cleanup\Domain\Cleanup_Task_Status;

/**
 * WordPress options-based repository for cleanup status.
 */
class Cleanup_Status_Options_Repository {

	/**
	 * Option key for tracking the current cursor (last processed product ID).
	 */
	private const CURSOR_OPTION = 'product_permalink_cleanup_cursor';

	/**
	 * Option key for the completion flag.
	 */
	private const COMPLETED_OPTION = 'product_permalink_cleanup_completed';

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Gets the current cleanup status.
	 *
	 * @return Cleanup_Task_Status The current status.
	 */
	public function get_status(): Cleanup_Task_Status {
		$cursor       = (int) $this->options_helper->get( self::CURSOR_OPTION, 0 );
		$is_completed = (bool) $this->options_helper->get( self::COMPLETED_OPTION, false );

		return new Cleanup_Task_Status( $cursor, $is_completed );
	}

	/**
	 * Updates the cursor to the last processed product ID.
	 *
	 * @param int $cursor The last processed product ID.
	 *
	 * @return void
	 */
	public function update_cursor( int $cursor ): void {
		$this->options_helper->set( self::CURSOR_OPTION, $cursor );
	}

	/**
	 * Marks the cleanup as completed.
	 *
	 * @return void
	 */
	public function mark_completed(): void {
		$this->options_helper->set( self::COMPLETED_OPTION, true );
	}

	/**
	 * Resets the cursor to start from the beginning.
	 *
	 * @return void
	 */
	public function reset_cursor(): void {
		$this->options_helper->set( self::CURSOR_OPTION, 0 );
	}

	/**
	 * Resets the completion flag (for re-running the cleanup).
	 *
	 * @return void
	 */
	public function reset_completed(): void {
		$this->options_helper->set( self::COMPLETED_OPTION, false );
	}
}
