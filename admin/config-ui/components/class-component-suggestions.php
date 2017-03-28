<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the configuration choices component.
 */
class WPSEO_Config_Component_Suggestions implements WPSEO_Config_Component {

	/**
	 * Gets the component identifier.
	 *
	 * @return string
	 */
	public function get_identifier() {
		return 'Suggestions';
	}

	/**
	 * Gets the field.
	 *
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		$field = new WPSEO_Config_Field_Suggestions();

		// Only show Premium upsell when we are not inside a Premium install.
		if ( ! defined( 'WPSEO_PREMIUM_PLUGIN_FILE' ) ) {
			$field->add_suggestion(
				sprintf( __( 'Outrank the competition with %s', 'wordpress-seo' ), 'Yoast SEO Premium' ),
				sprintf( __( 'Do you want to outrank your competition? %1$s gives you awesome additional features that\'ll help you to set up your SEO strategy like a professional. Use the multiple focus keywords functionality, the redirect manager and our internal linking tool. %1$s will also give you access to premium support.', 'wordpress-seo' ), 'Yoast SEO Premium' ),
				array(
					'text' => __( 'Upgrade to Premium', 'wordpress-seo' ),
					'type' => 'primary',
					'url'  => 'https://yoa.st/premium',
				),
				'video-url'
			);
		}

		$field->add_suggestion(
			__( 'Learn how to write copy that ranks', 'wordpress-seo' ),
			sprintf( __( 'Do you want to learn how to write content that generates traffic? Check out our %1$s. We will help you to write awesome copy that will rank in the search engines. The %1$s covers all the main steps in SEO copywriting: from keyword research to publishing.', 'wordpress-seo' ), 'SEO copywriting training' ),
			array(
				'text' => 'SEO copywriting training',
				'type' => 'link',
				'url'  => 'https://yoa.st/copywriting',
			),
			'video-url'
		);

		/*
		$field->add_suggestion(
			__( 'An in-depth analysis of your site', 'wordpress-seo' ),
			__( 'Some text...', 'wordpress-seo' ),
			array(
				'text' => __( 'Website review', 'wordpress-seo' ),
				'type' => 'link',
				'url'  => 'https://yoa.st/copywriting',
			),
			'video-url'
		);
		*/

		return $field;
	}

	/**
	 * Get the data for the field.
	 *
	 * @return mixed
	 */
	public function get_data() {
		return array();
	}

	/**
	 * Save data
	 *
	 * @param array $data Data containing changes.
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {
		return true;
	}
}
