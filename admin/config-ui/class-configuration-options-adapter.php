<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Options_Adapter
 *
 * Convert Configuration settings to WPSEO Options
 *
 * @since 3.6
 */
class WPSEO_Configuration_Options_Adapter {

	const OPTION_TYPE_WORDPRESS = 'wordpress';
	const OPTION_TYPE_YOAST = 'yoast';
	const OPTION_TYPE_CUSTOM = 'custom';

	/** @var array List of registered lookups */
	protected $lookup = array();

	/**
	 * Add a lookup for a WordPress native option
	 *
	 * @param string $class_name Class to bind to an option.
	 * @param string $option     Option name to use.
	 *
	 * @throws InvalidArgumentException Thrown when invalid input is provided.
	 */
	public function add_wordpress_lookup( $class_name, $option ) {

		if ( ! is_string( $option ) ) {
			throw new InvalidArgumentException( 'WordPress option must be a string.' );
		}

		$this->add_lookup( $class_name, self::OPTION_TYPE_WORDPRESS, $option );
	}

	/**
	 * Add a lookup for a Yoast option
	 *
	 * @param string $class_name Class to bind to the lookup.
	 * @param string $key        Key in the option group to bind to.
	 *
	 * @throws InvalidArgumentException Thrown when invalid input is provided.
	 */
	public function add_option_lookup( $class_name, $key ) {

		$test = WPSEO_Options::get( $key );
		if ( is_null( $test ) ) {
			/* translators: %1$s resolves to the option name passed to the lookup registration */
			throw new InvalidArgumentException( sprintf( __( 'Yoast option %1$s not found.', 'wordpress-seo' ), $key ) );
		}

		$this->add_lookup( $class_name, self::OPTION_TYPE_YOAST, $key );
	}

	/**
	 * Add a lookup for a Yoast option
	 *
	 * @param string $class_name Class to bind to the lookup.
	 * @param string $option     Option group to use.
	 * @param string $key        Key in the option group to bind to.
	 *
	 * @deprecated 7.0
	 *
	 * @throws InvalidArgumentException Thrown when invalid input is provided.
	 */
	public function add_yoast_lookup( $class_name, $option, $key ) {
		_deprecated_function( __METHOD__, 'WPSEO 7.0', 'WPSEO_Configuration_Options_Adapter::add_option_lookup' );
		$this->add_option_lookup( $class_name, $key );
	}

	/**
	 * Add a lookup for a custom implementation
	 *
	 * @param string   $class_name   Class to bind to the lookup.
	 * @param callable $callback_get Callback to retrieve data.
	 * @param callable $callback_set Callback to save data.
	 *
	 * @throws InvalidArgumentException Thrown when invalid input is provided.
	 */
	public function add_custom_lookup( $class_name, $callback_get, $callback_set ) {

		if ( ! is_callable( $callback_get ) || ! is_callable( $callback_set ) ) {
			throw new InvalidArgumentException( 'Custom option must be callable.' );
		}

		$this->add_lookup( $class_name, self::OPTION_TYPE_CUSTOM, array(
			$callback_get,
			$callback_set,
		) );
	}

	/**
	 * Add a field lookup.
	 *
	 * @param string       $class_name Class to add lookup for.
	 * @param string       $type       Type of lookup.
	 * @param string|array $option     Implementation of the lookup.
	 *
	 * @throws Exception Thrown when invalid input is provided.
	 */
	protected function add_lookup( $class_name, $type, $option ) {
		$this->lookup[ $class_name ] = array(
			'type'   => $type,
			'option' => $option,
		);
	}

	/**
	 * Get the data for the provided field
	 *
	 * @param WPSEO_Config_Field $field Field to get data for.
	 *
	 * @return mixed
	 */
	public function get( WPSEO_Config_Field $field ) {
		$identifier = $field->get_identifier();

		// Lookup option and retrieve value.
		$type   = $this->get_option_type( $identifier );
		$option = $this->get_option( $identifier );

		switch ( $type ) {
			case self::OPTION_TYPE_WORDPRESS:
				return get_option( $option );

			case self::OPTION_TYPE_YOAST:
				return WPSEO_Options::get( $option );

			case self::OPTION_TYPE_CUSTOM:
				return call_user_func( $option[0] );
		}

		return null;
	}

	/**
	 * Save data from a field
	 *
	 * @param WPSEO_Config_Field $field Field to use for lookup.
	 * @param mixed              $value Value to save to the lookup of the field.
	 *
	 * @return bool
	 */
	public function set( WPSEO_Config_Field $field, $value ) {
		$identifier = $field->get_identifier();

		// Lookup option and retrieve value.
		$type   = $this->get_option_type( $identifier );
		$option = $this->get_option( $identifier );

		switch ( $type ) {
			case self::OPTION_TYPE_WORDPRESS:
				return update_option( $option, $value );

			case self::OPTION_TYPE_YOAST:
				return WPSEO_Options::set( $option, $value );

			case self::OPTION_TYPE_CUSTOM:
				return call_user_func( $option[1], $value );
		}

		return false;
	}

	/**
	 * Get the lookup type for a specific class
	 *
	 * @param string $class_name Class to get the type of.
	 *
	 * @return null|string
	 */
	protected function get_option_type( $class_name ) {
		if ( ! isset( $this->lookup[ $class_name ] ) ) {
			return null;
		}

		return $this->lookup[ $class_name ]['type'];
	}

	/**
	 * Get the option for a specific class
	 *
	 * @param string $class_name Class to get the option of.
	 *
	 * @return null|string|array
	 */
	protected function get_option( $class_name ) {
		if ( ! isset( $this->lookup[ $class_name ] ) ) {
			return null;
		}

		return $this->lookup[ $class_name ]['option'];
	}
}
