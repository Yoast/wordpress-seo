<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\Multisite_Conditional;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Services\Options\Multisite_Options_Service;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;

/**
 * Adds hooks for the network admin options service.
 *
 * This is an initializer instead of an integration because it needs to add the configurations before they get used.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Initializer should not count.
 */
class Network_Admin_Options_Initializer implements Initializer_Interface {

	/**
	 * Holds the multisite options service instance.
	 *
	 * @var Multisite_Options_Service
	 */
	protected $multisite_options_service;

	/**
	 * Holds the Network_Admin_Options_Service instance.
	 *
	 * @var Network_Admin_Options_Service
	 */
	protected $network_admin_options_service;

	/**
	 * Constructs the network admin options integration.
	 *
	 * @param Multisite_Options_Service     $multisite_options_service     The multisite options service.
	 * @param Network_Admin_Options_Service $network_admin_options_service The network admin options service.
	 */
	public function __construct( Multisite_Options_Service $multisite_options_service, Network_Admin_Options_Service $network_admin_options_service ) {
		$this->multisite_options_service     = $multisite_options_service;
		$this->network_admin_options_service = $network_admin_options_service;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [ Multisite_Conditional::class ];
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function initialize() {
		// Adds the `allow_` override option configurations.
		\add_filter(
			'wpseo_network_admin_options_additional_configurations',
			[ $this, 'add_multisite_verify_configurations' ]
		);
		// Ensure the next request gets the added configurations.
		$this->network_admin_options_service->clear_cache();

		// Check for options that should listen to the `allow_` option.
		\add_filter(
			'wpseo_multisite_option_values',
			[ $this, 'verify_options_against_network' ]
		);
		// Ensure the next request gets the option overrides.
		$this->multisite_options_service->clear_cache();
	}

	/**
	 * Adds the multisite verify configurations to the network admin option configurations.
	 *
	 * @param array $configurations The configurations.
	 *
	 * @return array The configurations.
	 */
	public function add_multisite_verify_configurations( array $configurations ) {
		$ms_verify_configurations = [];
		foreach ( $this->multisite_options_service->get_configurations() as $key => $configuration ) {
			if ( $this->is_multisite_verify_configuration( $configuration ) ) {
				$ms_verify_configurations[ Network_Admin_Options_Service::ALLOW_PREFIX . $key ] = [
					// Use the `ms_verify` value as the default value, but ensure the type is boolean only.
					'default' => (bool) $configuration['ms_verify'],
					'types'   => [ 'boolean' ],
				];
			}
		}

		return \array_merge( $configurations, $ms_verify_configurations );
	}

	/**
	 * Verifies the options against the network options.
	 *
	 * This implements the override part of the `ms_verify` configurations.
	 * Where a site can not have an option enabled when the network admin option is disabled.
	 *
	 * @param array $values The option values.
	 *
	 * @return array The option values with correct `ms_verify` values.
	 */
	public function verify_options_against_network( array $values ) {
		$configurations = $this->multisite_options_service->get_configurations();
		foreach ( $configurations as $key => $configuration ) {
			if ( ! $this->is_multisite_verify_configuration( $configuration ) || ! isset( $values[ $key ] ) ) {
				continue;
			}

			try {
				$network_value = $this->network_admin_options_service->__get( Network_Admin_Options_Service::ALLOW_PREFIX . $key );
			} catch ( Unknown_Exception $exception ) {
				$network_value = $configuration['default'];
			}

			// Override the value of the multisite option as it is not allowed by the network admin.
			if ( ! $network_value ) {
				$values[ $key ] = false;
			}
		}

		return $values;
	}

	/**
	 * Checks if the configuration contains a multisite verify.
	 *
	 * @param array $configuration The configuration.
	 *
	 * @return bool Whether this configuration contains a multisite verify.
	 */
	protected function is_multisite_verify_configuration( array $configuration ) {
		return \array_key_exists( 'ms_verify', $configuration );
	}
}
