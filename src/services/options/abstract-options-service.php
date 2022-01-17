<?php

namespace Yoast\WP\SEO\Services\Options;

use Exception;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
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
	const OPTION_NAME = 'wpseo_options';

	/**
	 * Holds the option configurations.
	 *
	 * @var array
	 */
	protected $options = [];

	/**
	 * Holds the cached option values.
	 *
	 * @var array
	 */
	protected $values = null;

	/**
	 * Holds the sanitization helper instance.
	 *
	 * @var Sanitization_Helper
	 */
	protected $sanitization;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper
	 */
	protected $validation;

	/**
	 * Constructs an options service instance.
	 *
	 * @param Sanitization_Helper $sanitization The sanitization helper.
	 * @param Validation_Helper   $validation   The validation helper.
	 */
	public function __construct( Sanitization_Helper $sanitization, Validation_Helper $validation ) {
		$this->sanitization = $sanitization;
		$this->validation   = $validation;
	}

	/**
	 * Magic getter to get the option value.
	 *
	 * @param string $name The option name.
	 *
	 * @throws Exception When the option does not exist.
	 *
	 * @return mixed The option value.
	 */
	public function __get( $name ) {
		if ( $this->values === null ) {
			$this->values = \WPSEO_Options::get_all();
		}

		if ( \array_key_exists( $name, $this->values ) ) {
			return $this->values[ $name ];
		}

		throw new Exception( "Option '$name' does not exist." );
	}

	/**
	 * Magic setter to set the option value.
	 *
	 * @param string $name  The option name.
	 * @param mixed  $value The option value.
	 *
	 * @throws Exception When the option does not exist.
	 */
	public function __set( $name, $value ) {
		if ( ! \array_key_exists( $name, $this->options ) ) {
			throw new Exception( "Option '$name' does not exist." );
		}

		$option = $this->options[ $name ];
		$value  = $this->sanitization->sanitize_as( $value, $option->sanitize_as );
		$this->validation->validate_as( $value, $option->validate_as );

		\WPSEO_Options::set( $name, $value );
	}
}
