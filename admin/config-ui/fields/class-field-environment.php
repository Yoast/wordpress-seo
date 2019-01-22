<?php
/**
 * WPSEO plugin file.
 *
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

		$this->set_property( 'label', __( 'Please specify if your site is under construction or already active.', 'wordpress-seo' ) );

		$this->set_property( 'description', __( 'Choose under construction if you want to keep the site out of the index of search engines. Don\'t forget to activate it once you\'re ready to publish your site.', 'wordpress-seo' ) );

		$this->add_choice( 'production', __( 'Option A: My site is live and ready to be indexed', 'wordpress-seo' ) );
		$this->add_choice( 'staging', __( 'Option B: My site is under construction and should not be indexed', 'wordpress-seo' ) );
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
		return WPSEO_Options::get( 'environment_type' );
	}

	/**
	 * Set new data.
	 *
	 * @param string $environment_type The site's environment type.
	 *
	 * @return bool Returns whether the value is successfully set.
	 */
	public function set_data( $environment_type ) {
		$return = true;
		if ( $this->get_data() !== $environment_type ) {
			$return = WPSEO_Options::set( 'environment_type', $environment_type );
			if ( ! $this->set_indexation( $environment_type ) ) {
				return false;
			}
		}

		return $return;
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

		return ( get_option( 'blog_public' ) === $new_blog_public_value );
	}
}
