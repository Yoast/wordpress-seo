<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Tracking
 */

/**
 * This class handles the tracking routine.
 */
class WPSEO_Tracking implements WPSEO_WordPress_Integration {

	/**
	 * The tracking option name.
	 *
	 * @var string
	 */
	protected $option_name = 'wpseo_tracking_last_request';

	/**
	 * The limit or the option.
	 *
	 * @var int
	 */
	protected $threshold = 0;

	/**
	 * The endpoint to send the data to.
	 *
	 * @var string
	 */
	protected $endpoint = '';

	/**
	 * The current time.
	 *
	 * @var int
	 */
	private $current_time;

	/**
	 * Constructor setting the threshold.
	 *
	 * @param string $endpoint  The endpoint to send the data to.
	 * @param int    $threshold The limit for the option.
	 */
	public function __construct( $endpoint, $threshold ) {
		$this->endpoint  = $endpoint;
		$this->threshold = $threshold;
		$this->current_time = time();
	}

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this, 'send' ), 1 );
	}

	/**
	 * Sends the tracking data.
	 */
	public function send() {
		if ( ! $this->should_send_tracking() ) {
			return;
		}

		$collector = $this->get_collector();

		$request = new WPSEO_Remote_Request( $this->endpoint );
		$request->set_body( $collector->get_as_json() );
		$request->send();

		update_option( $this->option_name, $this->current_time, 'yes' );
	}

	/**
	 * Returns true when last tracking data was send more than two weeks ago.
	 *
	 * @return bool True when tracking data should be send.
	 */
	protected function should_send_tracking() {
		global $pagenow;

		/**
		 * Filter: 'wpseo_disable_tracking' - Disables the data tracking of Yoast SEO Premium.
		 *
		 * @api string $is_disabled The disabled state. Default is false.
		 */
		if ( apply_filters( 'wpseo_enable_tracking', false ) === false ) {
			return false;
		}

		// Because we don't want to possibly block plugin actions with our routines.
		if ( in_array( $pagenow, array( 'plugins.php', 'plugin-install.php', 'plugin-editor.php' ), true ) ) {
			return false;
		}

		$last_time = get_option( $this->option_name );

		// When there is no data being set.
		if ( ! $last_time ) {
			return true;
		}

		return $this->exceeds_treshhold( $this->current_time - $last_time );
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
	public function get_collector() {
		$collector = new WPSEO_Collector();
		$collector->add_collection( new WPSEO_Tracking_Default_Data() );
		$collector->add_collection( new WPSEO_Tracking_Server_Data() );
		$collector->add_collection( new WPSEO_Tracking_Theme_Data() );
		$collector->add_collection( new WPSEO_Tracking_Plugin_Data() );
		$collector->add_collection( new WPSEO_Tracking_Settings_Data() );

		return $collector;
	}
}
