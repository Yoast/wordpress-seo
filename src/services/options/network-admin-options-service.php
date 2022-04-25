<?php

namespace Yoast\WP\SEO\Services\Options;

use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;

/**
 * The multisite site options service class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Service should not count.
 */
class Network_Admin_Options_Service extends Abstract_Options_Service {

	/**
	 * Holds the prefix for the override option keys that allow or disallow the option key of the same name.
	 *
	 * @var string
	 */
	const ALLOW_PREFIX = 'allow_';

	/**
	 * Holds the name of the options row in the database.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo_network_admin_options';

	/**
	 * Holds the multisite' network option configurations.
	 *
	 * {@inheritDoc}
	 *
	 * @var array[string]
	 */
	protected $configurations = [
		'access'      => [
			'default'    => 'admin',
			'types'      => [
				'in_array' => [
					'allow' => [
						'admin',
						'superadmin',
					],
				],
			],
			'ms_exclude' => false,
		],
		'defaultblog' => [
			'default' => '',
			'types'   => [ 'empty_string' ],
		],
	];

	/**
	 * Retrieves the options.
	 *
	 * @return array|false The options or false.
	 */
	protected function get_wp_option() {
		return \get_site_option( $this->option_name );
	}

	/**
	 * Updates the options.
	 *
	 * @param array $values The option values.
	 *
	 * @throws Save_Failed_Exception When the save failed.
	 *
	 * @return void
	 */
	protected function update_wp_options( $values ) {
		if ( ! \update_site_option( $this->option_name, $values ) ) {
			throw Save_Failed_Exception::for_option( $this->option_name );
		}
	}

	/**
	 * Deletes the options.
	 *
	 * @throws Delete_Failed_Exception When the deletion failed.
	 *
	 * @return void
	 */
	protected function delete_wp_options() {
		if ( ! \delete_site_option( $this->option_name ) ) {
			throw Delete_Failed_Exception::for_option( $this->option_name );
		}
	}

	/**
	 * Retrieves additional configurations.
	 *
	 * @param array $configurations The additional configurations to be validated.
	 *
	 * @return array Additional configurations.
	 */
	protected function get_additional_configurations( $configurations = [] ) {
		/**
		 * Filter 'wpseo_network_admin_options_additional_configurations' - Allows developers to add option configurations.
		 *
		 * @see Abstract_Options_Service::$configurations
		 *
		 * @api array The option configurations.
		 */
		$additional_configurations = \apply_filters( 'wpseo_network_admin_options_additional_configurations', $configurations );

		return parent::get_additional_configurations( $additional_configurations );
	}
}
