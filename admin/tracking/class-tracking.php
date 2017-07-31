<?php
/**
 * @package WPSEO\Admin\Tracking
 */

/**
 * This class handles the tracking routine.
 */
class WPSEO_Tracking implements WPSEO_WordPress_Integration {

	/** @var string */
	protected $transient_name = 'wpseo_tracking_last_request';

	/** @var int */
	protected $threshold = 0;

	/** @var string */
	protected $endpoint = 'https://search-yoast-poc-gdaxpa7udbwtvpgxqaufa3dejm.eu-central-1.es.amazonaws.com/yoast/tracking';

	/**
	 * Constructor setting the treshhold..
	 */
	public function __construct() {
		$this->threshold = ( WEEK_IN_SECONDS * 2 );
	}

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {

		$current_time = time();
		if ( ! $this->should_run_tracking( $current_time ) ) {
			return;
		}

		$collector = $this->get_collector();

		$request = new WPSEO_Remote_Request( $this->endpoint );
		$request->set_body( $collector->get_as_json() );
		if ( $request->post() ) {
			update_option( $this->transient_name, $current_time );

			return;
		}

		// Try sending the request data later.
		update_option( $this->transient_name, ( $current_time - HOUR_IN_SECONDS ) );
	}

	/**
	 * Returns true when last tracking data was send more than two weeks ago.
	 *
	 * @param int $current_time The current timestamp.
	 *
	 * @return bool True when tracking data should be send.
	 */
	protected function should_run_tracking( $current_time ) {
		$last_time = get_option( $this->transient_name );

		// When there is no data being set.
		if ( ! $last_time ) {
			return true;
		}

		return $this->exceeds_treshhold( $current_time - $last_time );
	}

	/**
	 * Checks if the given amount of seconds exceeds the set threshold.
	 *
	 * @param int $seconds The amount of seconds to check.
	 *
	 * @return bool True when seconds is bigger than threshold.
	 */
	protected function exceeds_treshhold( $seconds ) {
		return ( $seconds > $this->threshold );
	}

	/**
	 * Returns the collector for collecting the data.
	 *
	 * @return WPSEO_Collector The instance of the collector.
	 */
	protected function get_collector() {
		$collector = new WPSEO_Collector();
		$collector->add_collection( new WPSEO_Tracking_Default_Data() );
		$collector->add_collection( new WPSEO_Tracking_Server_Data() );
		$collector->add_collection( new WPSEO_Tracking_Theme_Data() );
		$collector->add_collection( new WPSEO_Tracking_Plugin_Data() );

		return $collector;
	}
}
