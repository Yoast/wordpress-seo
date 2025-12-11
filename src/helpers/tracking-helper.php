<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * Class Tracking_Helper.
 */
class Tracking_Helper {

	/**
	 * The Environment_Helper instance.
	 *
	 * @var Environment_Helper
	 */
	protected $environment_helper;
	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Social_Profiles_Helper constructor.
	 *
	 * @param Environment_Helper $environment_helper The environment helper.
	 * @param Options_Helper     $options_helper     The options helper.
	 *
	 */
	public function __construct(
		Environment_Helper $environment_helper,
		Options_Helper $options_helper
	) {
		$this->environment_helper = $environment_helper;
		$this->options_helper = $options_helper;
	}

	/**
	 * See if we should run tracking at all.
	 *
	 * @return bool True when we can track, false when we can't.
	 */
	public function tracking_enabled() {
		// Check if we're allowing tracking.
		$tracking = $this->options_helper->get( 'tracking' );

		if ( $tracking === false ) {
			return false;
		}

		// Save this state.
		if ( $tracking === null ) {
			/**
			 * Filter: 'wpseo_enable_tracking' - Enables the data tracking of Yoast SEO Premium and add-ons.
			 *
			 * @param string|false $is_enabled The enabled state. Default is false.
			 */
			$tracking = apply_filters( 'wpseo_enable_tracking', false );

			$this->options_helper->set( 'tracking', $tracking );
		}

		if ( $tracking === false ) {
			return false;
		}

		if ( ! $this->environment_helper->is_production_mode() ) {
			return false;
		}

		return true;
	}
}
