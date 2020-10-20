<?php

namespace Yoast\WP\SEO\Helpers;

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
	 * Indexing_Helper constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper, Date_Helper $date_helper ) {
		$this->options_helper = $options_helper;
		$this->date_helper    = $date_helper;
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
