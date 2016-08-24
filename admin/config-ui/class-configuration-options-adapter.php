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
	 * @param $class_name
	 * @param $option
	 *
	 * @throws Exception
	 */
	public function add_wordpress_lookup( $class_name, $option ) {
		if ( ! is_string( $option ) ) {
			throw new Exception( 'WordPress option must be a string.' );
		}

		$this->add_lookup( $class_name, self::OPTION_TYPE_WORDPRESS, $option );
	}

	/**
	 * Add a lookup for a Yoast option
	 *
	 * @param $class_name
	 * @param $option
	 * @param $key
	 */
	public function add_yoast_lookup( $class_name, $option, $key ) {
		$this->add_lookup( $class_name, self::OPTION_TYPE_YOAST, array( $option, $key ) );
	}

	/**
	 * Add a lookup for a custom implementation
	 *
	 * @param string   $class_name
	 * @param callable $callback_get
	 * @param callable $callback_set
	 *
	 * @throws Exception
	 */
	public function add_custom_lookup( $class_name, $callback_get, $callback_set ) {
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
	 * @throws Exception
	 */
	protected function add_lookup( $class_name, $type, $option ) {
		$this->lookup[ $class_name ] = array(
			'type'   => $type,
			'option' => $option
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

		// lookup option and retrieve value.
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
	 * @param WPSEO_Config_Field $field
	 * @param mixed              $value
	 *
	 * @return bool
	 */
	public function set( WPSEO_Config_Field $field, $value ) {
		$class_name = get_class( $field );

		// lookup option and retrieve value.
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
