<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast_Network_Settings_API;

/**
 * Adds hooks for the options service.
 */
class Options_Initializer implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * Holds the site helper instance.
	 *
	 * @var Site_Helper
	 */
	protected $site_helper;

	/**
	 * Constructs the options integration.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper, Capability_Helper $capability_helper, Site_Helper $site_helper ) {
		$this->options_helper    = $options_helper;
		$this->capability_helper = $capability_helper;
		$this->site_helper       = $site_helper;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function initialize() {
		/*
		 * We need to keep track of any change in custom post types and taxonomies to update our option configurations
		 * that expand to public post types / taxonomies.
		 * Clearing the cache will make it so the next options operation re-expands the configurations.
		 */
		\add_action( 'registered_post_type', [ $this->options_helper, 'clear_cache' ] );
		\add_action( 'unregistered_post_type', [ $this->options_helper, 'clear_cache' ] );
		\add_action( 'registered_taxonomy', [ $this->options_helper, 'clear_cache' ] );
		\add_action( 'unregistered_taxonomy', [ $this->options_helper, 'clear_cache' ] );

		\add_action( 'admin_init', [ $this, 'register_options' ] );
	}

	/**
	 * Registers the options for the configuration pages.
	 *
	 * @return void
	 */
	public function register_options() {
		if ( ! $this->capability_helper->current_user_can( 'wpseo_manage_options' ) ) {
			return;
		}

		// TODO: replace this with $this->site_helper->is_multisite() after P1-1156 is merged.
		if ( \is_multisite() ) {
			$network_settings_api = Yoast_Network_Settings_API::get();
			if ( $network_settings_api->meets_requirements() ) {
				// TODO: replace hardcoded string with network_admin_options_service->option_name.
				$network_settings_api->register_setting( 'wpseo_network_admin_options', 'wpseo_network_admin_options' );
			}
		}

		\register_setting(
			'wpseo_options',
			'wpseo_options',
			[
				'type'              => 'array',
				'sanitize_callback' => [ $this, 'sanitize_options' ],
			]
		);
	}

	/**
	 * Validates the option values. Invalid or unknown values will be removed.
	 *
	 * @param array $values The option values.
	 *
	 * @return array Valid values.
	 */
	public function sanitize_options( $values ) {
		$valid_values = [];
		foreach ( $values as $key => $value ) {
			$valid_value = $this->options_helper->validate( $key, $value );
			if ( $valid_value !== Options_Helper::INVALID_VALUE ) {
				$valid_values[ $key ] = $valid_value;
			}
		}

		return $valid_values;
	}
}
