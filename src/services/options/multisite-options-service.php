<?php

namespace Yoast\WP\SEO\Services\Options;

/**
 * The multisite site options service class.
 */
class Multisite_Options_Service extends Abstract_Options_Service {

	/**
	 * Holds the name of the options row in the database.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo_multisite_options';

	/**
	 * Holds the multisite' network option configurations.
	 *
	 * {@inheritDoc}
	 *
	 * @var array[string]
	 */
	protected $configurations = [
		'access'       => [
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
		'default_blog' => [
			'default' => '',
			'types'   => [ 'empty_string' ],
		],
	];

	/**
	 * Retrieves additional configurations.
	 *
	 * @param array $configurations The additional configurations to be validated.
	 *
	 * @return array Additional configurations.
	 */
	protected function get_additional_configurations( $configurations = [] ) {
		/**
		 * Filter 'wpseo_multisite_options_additional_configurations' - Allows developers to add option configurations.
		 *
		 * @see Abstract_Options_Service::$configurations
		 *
		 * @api array The option configurations.
		 */
		$additional_configurations = \apply_filters( 'wpseo_multisite_options_additional_configurations', $configurations );

		return parent::get_additional_configurations( $additional_configurations );
	}
}
