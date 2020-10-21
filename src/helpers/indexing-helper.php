<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast_Notification_Center;

/**
 * A helper object for indexing.
 */
class Indexing_Helper {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	protected $date_helper;

	/**
	 * The notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Indexing_Helper constructor.
	 *
	 * @param Options_Helper            $options_helper      The options helper.
	 * @param Date_Helper               $date_helper         The date helper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Date_Helper $date_helper,
		Yoast_Notification_Center $notification_center
	) {
		$this->options_helper      = $options_helper;
		$this->date_helper         = $date_helper;
		$this->notification_center = $notification_center;
	}

	/**
	 * Sets several database options when the indexable indexing process is started.
	 *
	 * @return void
	 */
	public function start() {
		$this->set_first_time( false );
		$this->set_started( $this->date_helper->current_time() );
	}

	/**
	 * Sets several database options when the indexing process is finished.
	 *
	 * @return void
	 */
	public function finish() {
		$this->set_started( null );
		$this->set_reason( '' );
	}

	/**
	 * Sets the indexing reason.
	 *
	 * @param string $reason The indexing reason.
	 *
	 * @return void
	 */
	public function set_reason( $reason ) {
		$this->options_helper->set( 'indexing_reason', $reason );

		/*
		 * Remove any pre-existing notification, so that a new notification
		 * (with a possible new reason) can be added.
		 */
		$this->notification_center->remove_notification_by_id(
			Indexing_Notification_Integration::NOTIFICATION_ID
		);
	}

	/**
	 * Determines whether an indexing reason has been set in the options.
	 *
	 * @return bool Whether an indexing reason has been set in the options.
	 */
	public function has_reason() {
		$reason = $this->options_helper->get( 'indexing_reason', '' );

		return ! empty( $reason );
	}

	/**
	 * Returns the indexing reason. The reason why the site-wide indexing process should be run.
	 *
	 * @return string The indexing reason, defaults to the empty string if no reason has been set.
	 */
	public function get_reason() {
		return $this->options_helper->get( 'indexing_reason', '' );
	}

	/**
	 * Sets the start time when the indexing process has started but not completed.
	 *
	 * @param int|bool $value The start time when the indexing process has started but not completed, false otherwise.
	 *
	 * @return void
	 */
	public function set_started( $value ) {
		$this->options_helper->set( 'indexation_started', $value );
	}

	/**
	 * Gets the start time when the indexing process has started but not completed.
	 *
	 * @return int|bool $start_time The start time when the indexing process has started but not completed, false otherwise.
	 */
	public function get_started() {
		return $this->options_helper->get( 'indexation_started' );
	}

	/**
	 * Sets a boolean that indicates whether or not a site still has to be indexed for the first time.
	 *
	 * @param bool $is_first_time_indexing Whether or not a site still has to be indexed for the first time.
	 *
	 * @return void
	 */
	public function set_first_time( $is_first_time_indexing ) {
		$this->options_helper->set( 'indexing_first_time', $is_first_time_indexing );
	}

	/**
	 * Gets a boolean that indicates whether or not the site still has to be indexed for the first time.
	 *
	 * @return bool Whether the site still has to be indexed for the first time.
	 */
	public function is_initial_indexing() {
		return $this->options_helper->get( 'indexing_first_time', true );
	}
}
