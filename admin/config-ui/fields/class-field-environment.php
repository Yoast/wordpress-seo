<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Environment
 */
class WPSEO_Config_Field_Environment extends WPSEO_Config_Field_Choice {
	/**
	 * WPSEO_Config_Field_Environment constructor.
	 */
	public function __construct() {
		parent::__construct( 'environment_type' );

		/* Translators: %1$s resolves to the home_url of the blog. */
		$this->set_property( 'label', sprintf( __( 'Please specify the environment in which this site - %1$s - is running.', 'wordpress-seo' ), get_home_url() ) );

		$this->add_choice( 'production', __( 'Production (this is a live site with real traffic)', 'wordpress-seo' ) );
		$this->add_choice( 'staging', __( 'Staging (this is a copy of a live site used for testing purposes only)', 'wordpress-seo' ) );
		$this->add_choice( 'development', __( 'Development (this site is running locally for development purposes)', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_custom_lookup(
			$this->get_identifier(),
			array( $this, 'get_data' ),
			array( $this, 'set_data' )
		);
	}

	/**
	 * Gets the option that is set for this field.
	 *
	 * @return string The value for the environment_type wpseo option.
	 */
	public function get_data() {
		$option = WPSEO_Options::get_option( 'wpseo' );

		return $option['environment_type'];
	}

	/**
	 * Set new data.
	 *
	 * @param string $environment_type The site's environment type.
	 *
	 * @return bool Returns whether the value is successfully set.
	 */
	public function set_data( $environment_type ) {
		$option = WPSEO_Options::get_option( 'wpseo' );

		if ( $option['environment_type'] !== $environment_type ) {
			$option['environment_type'] = $environment_type;
			update_option( 'wpseo', $option );
			if ( ! $this->set_indexation( $environment_type ) ) {
				return false;
			}
		}

		$saved_environment_option = WPSEO_Options::get_option( 'wpseo' );

		return ( $saved_environment_option['environment_type'] === $option['environment_type'] );
	}

	/**
	 * Set the WordPress Search Engine Visibility option based on the environment type.
	 *
	 * @param string $environment_type The environment the site is running in.
	 *
	 * @return bool Returns if the options is set successfully.
	 */
	protected function set_indexation( $environment_type ) {
		$new_blog_public_value     = 0;
		$current_blog_public_value = get_option( 'blog_public' );

		if ( $environment_type === 'production' ) {
			$new_blog_public_value = 1;
		}

		if ( $current_blog_public_value !== $new_blog_public_value ) {
			update_option( 'blog_public', $new_blog_public_value );

			return true;
		}
		$saved_blog_public_value = get_option( 'blog_public' );

		return ( $saved_blog_public_value === $new_blog_public_value );
	}
}
