<?php
/**
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
	 * WPSEO_Configuration_Options_Adapter constructor.
	 *
	 * Register default/internal lookups.
	 */
	public function __construct() {

		$this->add_wordpress_lookup( 'WPSEO_Config_Field_Tag_Line', 'blogdescription' );
		$this->add_wordpress_lookup( 'WPSEO_Config_Field_Site_Name', 'blogname' );

		$this->add_yoast_lookup( 'WPSEO_Config_Field_Separator', 'wpseo_titles', 'separator' );

		$this->add_yoast_lookup( 'WPSEO_Config_Field_Site_Type', 'wpseo', 'site_type' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Multiple_Authors', 'wpseo', 'has_multiple_authors' );

		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_Facebook', 'wpseo_social', 'facebook_site' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_Twitter', 'wpseo_social', 'twitter_site' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_Instagram', 'wpseo_social', 'instagram_url' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_LinkedIn', 'wpseo_social', 'linkedin_url' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_MySpace', 'wpseo_social', 'myspace_url' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_Pinterest', 'wpseo_social', 'pinterest_url' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_YouTube', 'wpseo_social', 'youtube_url' );
		$this->add_yoast_lookup( 'WPSEO_Config_Field_Profile_URL_GooglePlus', 'wpseo_social', 'google_plus_url' );
	}

	/**
	 * Add a lookup for a WordPress native option
	 *
	 * @param string $class_name Class to bind to an option.
	 * @param string $option     Option name to use.
	 *
	 * @throws Exception Thrown when invalid input is provided.
	 */
	public function add_wordpress_lookup( $class_name, $option ) {
		if ( ! class_exists( $class_name ) ) {
			throw new Exception( 'Class must exist.' );
		}

		if ( ! is_string( $option ) ) {
			throw new Exception( 'WordPress option must be a string.' );
		}

		$this->add_lookup( $class_name, self::OPTION_TYPE_WORDPRESS, $option );
	}

	/**
	 * Add a lookup for a Yoast option
	 *
	 * @param string $class_name Class to bind to the lookup.
	 * @param string $option     Option group to use.
	 * @param string $key        Key in the option group to bind to.
	 *
	 * @throws Exception Thrown when invalid input is provided.
	 */
	public function add_yoast_lookup( $class_name, $option, $key ) {
		if ( ! class_exists( $class_name ) ) {
			throw new Exception( 'Class must exist.' );
		}

		$this->add_lookup( $class_name, self::OPTION_TYPE_YOAST, array( $option, $key ) );
	}

	/**
	 * Add a lookup for a custom implementation
	 *
	 * @param string   $class_name   Class to bind to the lookup.
	 * @param callable $callback_get Callback to retrieve data.
	 * @param callable $callback_set Callback to save data.
	 *
	 * @throws Exception Thrown when invalid input is provided.
	 */
	public function add_custom_lookup( $class_name, $callback_get, $callback_set ) {
		if ( ! class_exists( $class_name ) ) {
			throw new Exception( 'Class must exist.' );
		}

		if ( ! is_callable( $callback_get ) || ! is_callable( $callback_set ) ) {
			throw new Exception( 'Custom option must be callable.' );
		}

		$this->add_lookup( $class_name, self::OPTION_TYPE_CUSTOM, array( $callback_get, $callback_set ) );
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
		$class_name = get_class( $field );

		// Lookup option and retrieve value.
		$type   = $this->get_option_type( $class_name );
		$option = $this->get_option( $class_name );

		switch ( $type ) {
			case self::OPTION_TYPE_WORDPRESS:
				return get_option( $option );

			case self::OPTION_TYPE_YOAST:
				$group = WPSEO_Options::get_option( $option[0] );

				return $group[ $option[1] ];

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
		$class_name = get_class( $field );

		// Lookup option and retrieve value.
		$type   = $this->get_option_type( $class_name );
		$option = $this->get_option( $class_name );

		switch ( $type ) {
			case self::OPTION_TYPE_WORDPRESS:
				return update_option( $option, $value );

			case self::OPTION_TYPE_YOAST:
				$group = WPSEO_Options::get_option( $option[0] );

				$before = $group[ $option[1] ];
				if ( $before === $value ) {
					return true;
				}

				$group[ $option[1] ] = $value;
				update_option( $option[0], $group );

				$saved = WPSEO_Options::get_option( $option[0] );

				return $saved[ $option[1] ] !== $before;

			case self::OPTION_TYPE_CUSTOM:
				return call_user_func( $option[1] );
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
	private function get_option_type( $class_name ) {
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
	private function get_option( $class_name ) {
		if ( ! isset( $this->lookup[ $class_name ] ) ) {
			return null;
		}

		return $this->lookup[ $class_name ]['option'];
	}
}
