<?php

namespace Yoast\WP\SEO\Services\Options;

use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;

/**
 * The network admin options service class.
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
			'types'   => [
				'empty_string',
				'blog_id',
			],
		],
	];

	/**
	 * Holds the multisite options service instance.
	 *
	 * @var Multisite_Options_Service
	 */
	protected $multisite_options_service;

	/**
	 * Sets the dependencies.
	 *
	 * Use this for dependencies that are not included via the Abstract_Options_Service's constructor.
	 *
	 * @param Multisite_Options_Service $multisite_options_service The multisite options service.
	 *
	 * @required
	 */
	public function set_dependencies( Multisite_Options_Service $multisite_options_service ) {
		$this->multisite_options_service = $multisite_options_service;
	}

	/**
	 * Resets all options for the current blog when the `ms_defaults_set` option is false.
	 *
	 * @throws Save_Failed_Exception When the save failed.
	 * @throws Delete_Failed_Exception When the deletion failed.
	 * @throws Unknown_Exception When the `defaultblog` option is not registered.
	 *
	 * @return bool Whether the options were reset.
	 */
	public function maybe_reset_current_blog_options() {
		try {
			$is_ms_defaults_set = $this->multisite_options_service->__get( 'ms_defaults_set' );
		} catch ( Unknown_Exception $e ) {
			$is_ms_defaults_set = false;
		}

		if ( $is_ms_defaults_set ) {
			return false;
		}
		$this->reset_options_for( \get_current_blog_id() );

		return true;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- PHPCS doesn't take into account exceptions thrown in called methods.

	/**
	 * Resets all options for a specific multisite blog.
	 *
	 * The new options are retrieved from the specified default blog, if one was chosen on the network page, or the
	 * plugin defaults if it was not.
	 *
	 * @param int $blog_id The blog ID.
	 *
	 * @throws Save_Failed_Exception When the save failed.
	 * @throws Delete_Failed_Exception When the deletion failed.
	 * @throws Unknown_Exception When the `defaultblog` option is not registered.
	 *
	 * @return void
	 */
	public function reset_options_for( $blog_id ) {
		// Determine the blog to get the options from.
		$base_blog_id = $blog_id;
		// Use the default blog when that is set.
		$default_blog = $this->__get( 'defaultblog' );
		if ( $default_blog !== '' && $default_blog !== 0 ) {
			$base_blog_id = $default_blog;
		}

		// Delete the old options.
		if ( \get_blog_option( $blog_id, $this->multisite_options_service->option_name ) ) {
			if ( ! \delete_blog_option( $blog_id, $this->multisite_options_service->option_name ) ) {
				throw Delete_Failed_Exception::for_option( $this->multisite_options_service->option_name );
			}
		}

		// Retrieve the new options.
		if ( $base_blog_id === $blog_id ) {
			$new_options = $this->multisite_options_service->get_defaults();
		}
		else {
			$new_options = \get_blog_option( $base_blog_id, $this->multisite_options_service->option_name );
			foreach ( $this->multisite_options_service->get_configurations() as $key => $configuration ) {
				// Remove sensitive, theme dependent and site dependent info.
				if ( \array_key_exists( 'ms_exclude', $configuration ) && $configuration['ms_exclude'] ) {
					$new_options[ $key ] = $configuration['default'];
				}
			}
		}
		// Using this option to prevent unnecessary resets.
		$new_options['ms_defaults_set'] = true;

		// Save the new options.
		if ( ! \update_blog_option( $blog_id, $this->multisite_options_service->option_name, $new_options ) ) {
			throw Save_Failed_Exception::for_option( $this->multisite_options_service->option_name );
		}
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber

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

	/**
	 * Expands the post types & taxonomies "wildcards" in the configurations.
	 *
	 * @param array $configurations The configurations to expand.
	 *
	 * @return array The expanded configurations.
	 */
	protected function expand_configurations( array $configurations ) {
		return $configurations;
	}
}
