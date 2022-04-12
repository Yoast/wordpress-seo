<?php

namespace Yoast\WP\SEO\Services\Options;

use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;

/**
 * The abstract options service class.
 */
abstract class Abstract_Options_Service {

	/**
	 * Holds the name of the options row in the database.
	 *
	 * @var string
	 */
	protected $option_name;

	/**
	 * Holds the option configurations.
	 *
	 * Note that if one "type check" passes, the whole option validation passes.
	 *
	 * <code>
	 * $options = [
	 *    'name' => [                                   // The name of the option field in the database.
	 *        'default'    => 'value',                  // The default value.
	 *        'types'      => [ 'empty_string', 'url' ] // Which validators to use.
	 *        'ms_exclude' => false,                    // Whether to exclude from multisite. Optional, defaults to
	 *                                                  // false.
	 *    ],
	 * ];
	 * </code>
	 *
	 * @var array[string]
	 */
	protected $configurations = [];

	/**
	 * Holds the cached option configurations.
	 *
	 * @var array[string]
	 */
	protected $cached_configurations = null;

	/**
	 * Holds the cached option values.
	 *
	 * @var array
	 */
	protected $cached_values = null;

	/**
	 * Holds the cached option default values.
	 *
	 * @var array
	 */
	protected $cached_defaults = null;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper
	 */
	protected $validation_helper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * Constructs an options service instance.
	 *
	 * @param Validation_Helper $validation_helper The validation helper.
	 * @param Post_Type_Helper  $post_type_helper  The post type helper.
	 * @param Taxonomy_Helper   $taxonomy_helper   The taxonomy helper.
	 */
	public function __construct( Validation_Helper $validation_helper, Post_Type_Helper $post_type_helper, Taxonomy_Helper $taxonomy_helper ) {
		$this->validation_helper = $validation_helper;
		$this->post_type_helper  = $post_type_helper;
		$this->taxonomy_helper   = $taxonomy_helper;
	}

	/**
	 * Magic getter to get the option value.
	 *
	 * @param string $key The option key.
	 *
	 * @throws Unknown_Exception When the option does not exist.
	 *
	 * @return mixed The option value.
	 */
	public function __get( $key ) {
		if ( \array_key_exists( $key, $this->get_values() ) ) {
			return $this->get_values()[ $key ];
		}

		throw Unknown_Exception::for_option( $key );
	}

	/*
	 * phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: see below.
	 *
	 * This sniff does not detect the exception that can be re-thrown in the validation helper,
	 * making the expected count one less than it is.
	 * This is expected behavior, as the sniff does not trace variables.
	 * @link https://github.com/squizlabs/PHP_CodeSniffer/issues/2683#issuecomment-718271057
	 */

	/**
	 * Magic setter to set the option value.
	 *
	 * @param string $key   The option key.
	 * @param mixed  $value The option value.
	 *
	 * @throws Unknown_Exception When the option does not exist.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When the value is invalid.
	 * @throws Save_Failed_Exception When the save failed.
	 */
	public function __set( $key, $value ) {
		if ( ! \array_key_exists( $key, $this->get_configurations() ) ) {
			throw Unknown_Exception::for_option( $key );
		}

		// Presuming the default is safe.
		if ( $value === $this->get_configurations()[ $key ]['default'] ) {
			$this->update_option( $key, $value );

			return;
		}
		// Only update when changed.
		if ( $value === $this->get_values()[ $key ] ) {
			return;
		}

		// Validate, this can throw a Validation_Exception.
		$value = $this->validation_helper->validate_as( $value, $this->get_configurations()[ $key ]['types'] );

		$this->update_option( $key, $value );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber

	/**
	 * Retrieves the options.
	 *
	 * @param string[] $keys Optionally request only these options.
	 *
	 * @return array The options.
	 */
	public function get_options( array $keys = [] ) {
		// Return all values if no filter is given.
		if ( \count( $keys ) === 0 ) {
			return $this->get_values();
		}

		// Return the values if the key is requested.
		return \array_filter(
			$this->get_values(),
			static function ( $key ) use ( $keys ) {
				return \in_array( $key, $keys, true );
			},
			ARRAY_FILTER_USE_KEY
		);
	}

	/**
	 * Saves the options if the database row does not exist.
	 *
	 * @throws Save_Failed_Exception When the save failed.
	 *
	 * @return void
	 */
	public function ensure_options() {
		if ( ! \get_option( $this->option_name ) ) {
			$this->update_options( $this->get_values() );
		}
	}

	/**
	 * Saves the options with their default values.
	 *
	 * @throws Delete_Failed_Exception When the deletion failed.
	 * @throws Save_Failed_Exception When the save failed.
	 *
	 * @return void
	 */
	public function reset_options() {
		$this->delete_options();
		$this->update_options( $this->get_defaults() );
	}

	/**
	 * Retrieves the default option values.
	 *
	 * @return array The default values.
	 */
	public function get_defaults() {
		if ( $this->cached_defaults === null ) {
			$this->cached_defaults = \array_combine(
				\array_keys( $this->get_configurations() ),
				\array_column( $this->get_configurations(), 'default' )
			);
		}

		return $this->cached_defaults;
	}

	/**
	 * Retrieves the default option value.
	 *
	 * @param string $key The option key.
	 *
	 * @throws Unknown_Exception When the option does not exist.
	 *
	 * @return mixed The default value.
	 */
	public function get_default( $key ) {
		if ( ! \array_key_exists( $key, $this->get_defaults() ) ) {
			throw Unknown_Exception::for_option( $key );
		}

		return $this->get_defaults()[ $key ];
	}

	/**
	 * Retrieves the (cached) option configurations.
	 *
	 * @return array The option configurations.
	 */
	public function get_configurations() {
		if ( $this->cached_configurations === null ) {
			/**
			 * Filter 'wpseo_additional_option_configurations' - Allows developers to add option configurations.
			 *
			 * @see Abstract_Options_Service::$configurations
			 *
			 * @api array The option configurations.
			 */
			$additional_configurations = \apply_filters( 'wpseo_additional_option_configurations', [] );

			// Ignore invalid filter result.
			if ( ! \is_array( $additional_configurations ) ) {
				$additional_configurations = [];
			}
			else {
				// Filter out invalid configurations.
				$additional_configurations = \array_filter(
					$additional_configurations,
					[ $this, 'is_valid_configuration' ],
					ARRAY_FILTER_USE_BOTH
				);
			}

			// Merge the configurations.
			$this->cached_configurations = \array_merge( $additional_configurations, $this->expand_configurations( $this->configurations ) );
		}

		return $this->cached_configurations;
	}

	/**
	 * Clears the cache.
	 *
	 * @return void
	 */
	public function clear_cache() {
		$this->cached_configurations = null;
		$this->cached_defaults       = null;
		$this->cached_values         = null;
	}

	/**
	 * Retrieves the (cached) values.
	 *
	 * @return array The values.
	 */
	protected function get_values() {
		if ( $this->cached_values === null ) {
			$this->cached_values = \get_option( $this->option_name );
			// Database row does not exist. We need an array.
			if ( ! $this->cached_values ) {
				$this->cached_values = [];
			}

			// Fill with default value when the database value is missing.
			$defaults = $this->get_defaults();
			foreach ( $defaults as $option => $default_value ) {
				if ( ! \array_key_exists( $option, $this->cached_values ) ) {
					$this->cached_values[ $option ] = $default_value;
				}
			}
		}

		return $this->cached_values;
	}

	/**
	 * Updates an option.
	 *
	 * @param string $key   The option key.
	 * @param mixed  $value The option value.
	 *
	 * @throws Save_Failed_Exception When the save failed.
	 *
	 * @return void
	 */
	protected function update_option( $key, $value ) {
		// Ensure the cache is filled.
		if ( $this->cached_values === null ) {
			$this->get_values();
		}

		// Only save when changed.
		if ( $value === $this->cached_values[ $key ] ) {
			return;
		}

		// Update the cache.
		$this->cached_values[ $key ] = $value;
		// Save to the database.
		$this->update_options( $this->cached_values );
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
	protected function update_options( $values ) {
		if ( ! \update_option( $this->option_name, $values ) ) {
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
	protected function delete_options() {
		if ( ! \delete_option( $this->option_name ) ) {
			throw Delete_Failed_Exception::for_option( $this->option_name );
		}
	}

	/**
	 * Determines if the passed configuration is valid.
	 *
	 * @param mixed $configuration The configuration.
	 * @param mixed $option        The name of the option.
	 *
	 * @return bool Whether the configuration is valid.
	 */
	protected function is_valid_configuration( $configuration, $option ) {
		if ( ! \is_string( $option ) ) {
			return false;
		}

		if ( ! \is_array( $configuration ) ) {
			return false;
		}

		if ( ! \array_key_exists( 'default', $configuration ) ) {
			return false;
		}

		if ( ! \array_key_exists( 'types', $configuration ) ) {
			return false;
		}

		if ( ! \is_array( $configuration['types'] ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Expands the post types & taxonomies "wildcards" in the configurations.
	 *
	 * @param array $configurations The configurations to expand.
	 *
	 * @return array The expanded configurations.
	 */
	protected function expand_configurations( array $configurations ) {
		$config = $this->expand_configurations_for( $configurations, '<PostTypeName>', $this->post_type_helper->get_public_post_types() );

		return $this->expand_configurations_for( $config, '<TaxonomyName>', $this->taxonomy_helper->get_public_taxonomies() );
	}

	/**
	 * Expands the configurations for a given search, using the names.
	 *
	 * This removes the found configuration and replaces it with variants, using the names.
	 *
	 * @param array    $configurations The configurations to expand.
	 * @param string   $search         The text to replace.
	 * @param string[] $names          The names to use as replacement.
	 *
	 * @return array The expanded configurations.
	 */
	protected function expand_configurations_for( array $configurations, $search, array $names ) {
		$config = [];

		foreach ( $configurations as $option => $configuration ) {
			$index = \strpos( $option, $search );
			// Keep other configurations.
			if ( $index === false ) {
				$config[ $option ] = $configuration;
				continue;
			}
			// Expand the names as configurations.
			foreach ( $names as $name ) {
				$config[ \str_replace( $search, $name, $option ) ] = $configuration;
			}
		}

		return $config;
	}
}
