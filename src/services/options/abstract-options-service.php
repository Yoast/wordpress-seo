<?php

namespace Yoast\WP\SEO\Services\Options;

use WPSEO_Options;
use Yoast\WP\SEO\Exceptions\Option\Missing_Configuration_Key_Exception;
use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Helpers\Validation_Helper;

/**
 * The abstract options service class.
 */
abstract class Abstract_Options_Service {

	/**
	 * Holds the WordPress options' option name.
	 *
	 * @var string
	 */
	protected $option_name;

	/**
	 * Holds the site option configurations.
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
	 * Holds the cached option values.
	 *
	 * @var array
	 */
	protected $values = null;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper
	 */
	protected $validation;

	/**
	 * Constructs an options service instance.
	 *
	 * @param Validation_Helper $validation The validation helper.
	 */
	public function __construct( Validation_Helper $validation ) {
		$this->validation = $validation;
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

		throw new Unknown_Exception( $key );
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
	 * @throws Missing_Configuration_Key_Exception When the option does not have a `sanitize_as` key.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When the value is invalid.
	 */
	public function __set( $key, $value ) {
		if ( ! \array_key_exists( $key, $this->configurations ) ) {
			throw new Unknown_Exception( $key );
		}

		// Presuming the default is safe.
		if ( $value === $this->configurations[ $key ]['default'] ) {
			$this->set_option( $key, $value );

			return;
		}
		// Only update when changed.
		if ( $value === $this->get_values()[ $key ] ) {
			return;
		}

		if ( ! \array_key_exists( 'types', $this->configurations[ $key ] ) ) {
			/*
			 * Note: this path is untested as it is configuration which is not exposed.
			 * In theory this makes this a development only exception, until we add a filter for it.
			 */
			throw new Missing_Configuration_Key_Exception( $key, 'types' );
		}
		// Validate, this can throw a Validation_Exception.
		$value = $this->validation->validate_as( $value, $this->configurations[ $key ]['types'] );

		// Only update when changed.
		if ( $value === $this->get_values()[ $key ] ) {
			return;
		}

		$this->set_option( $key, $value );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber

	/**
	 * Retrieves all the options.
	 *
	 * @return array The options.
	 */
	public function get_all() {
		return $this->get_values();
	}

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
	 * Retrieves the (cached) values.
	 *
	 * @return array The values.
	 */
	protected function get_values() {
		if ( $this->values === null ) {
			$this->values = WPSEO_Options::get_all();
		}

		return $this->values;
	}

	/**
	 * Sets an option value, without checks.
	 *
	 * @param string $key   The option key.
	 * @param mixed  $value The option value.
	 *
	 * @return void
	 */
	protected function set_option( $key, $value ) {
		WPSEO_Options::set( $key, $value );

		// Update the cache.
		$this->values[ $key ] = $value;
	}
}
