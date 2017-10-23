<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the configuration suggestions component.
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
		if ( ! WPSEO_Utils::is_yoast_seo_premium() ) {
			$field->add_suggestion(
				/* translators: %s resolves to Yoast SEO Premium */
				sprintf( __( 'Outrank the competition with %s', 'wordpress-seo' ), 'Yoast SEO Premium' ),
				/* translators: %1$s resolves to Yoast SEO Premium */
				sprintf( __( 'Do you want to outrank your competition? %1$s gives you awesome additional features that\'ll help you to set up your SEO strategy like a professional. Use the multiple focus keywords functionality, the redirect manager and our internal linking tool. %1$s will also give you access to premium support.', 'wordpress-seo' ), 'Yoast SEO Premium' ),
				array(
					'label' => __( 'Upgrade to Premium', 'wordpress-seo' ),
					'type'  => 'primary',
					'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/wizard-suggestion-premium' ),
				),
				WPSEO_Shortlinker::get( 'https://yoa.st/video-yoast-seo-premium' )
			);
		}

		$field->add_suggestion(
			__( 'Learn how to write copy that ranks', 'wordpress-seo' ),
			/* translators: %1$s resolves to SEO copywriting training */
			sprintf( __( 'Do you want to learn how to write content that generates traffic? Check out our %1$s. We will help you to write awesome copy that will rank in the search engines. The %1$s covers all the main steps in SEO copywriting: from keyword research to publishing.', 'wordpress-seo' ), 'SEO copywriting training' ),
			array(
				'label' => 'SEO copywriting training',
				'type'  => 'link',
				'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/configuration-wizard-copywrite-course-link' ),
			),
			WPSEO_Shortlinker::get( 'https://yoa.st/video-course-copywriting' )
		);

		$field->add_suggestion(
			/* translators: %1$s resolves to Yoast SEO, %2$s resolves to Yoast SEO plugin training */
			sprintf( __( 'Get the most out of %1$s with the %2$s', 'wordpress-seo' ), 'Yoast SEO', 'Yoast SEO plugin training' ),
			/* translators: %1$s resolves to Yoast SEO */
			sprintf( __( 'Do you want to know all the ins and outs of the %1$s plugin? Do you want to learn all about our advanced settings? Want to be able to really get the most out of the %1$s plugin? Check out our %1$s plugin training and start outranking the competition!', 'wordpress-seo' ), 'Yoast SEO' ),
			array(
				'label' => 'Yoast SEO plugin training',
				'type'  => 'link',
				'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/wizard-suggestion-plugin-course' ),
			),
			WPSEO_Shortlinker::get( 'https://yoa.st/video-plugin-course' )
		);

		// When we are running in Yoast SEO Premium and don't have Local SEO installed, show Local SEO as suggestion.
		if ( WPSEO_Utils::is_yoast_seo_premium() && ! defined( 'WPSEO_LOCAL_FILE' ) ) {
			$field->add_suggestion(
				sprintf( __( 'Attract more customers near you', 'wordpress-seo' ), 'Yoast SEO', 'Yoast SEO plugin training' ),
				/* translators: %1$s resolves to Local SEO */
				sprintf( __( 'If you want to outrank the competition in a specific town or region, check out our %1$s plugin! You’ll be able to easily insert Google maps, opening hours, contact information and a store locator. Besides that %1$s helps you to improve the usability of your contact page.', 'wordpress-seo' ), 'Local SEO' ),
				array(
					'label' => 'Local SEO',
					'type'  => 'link',
					'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/wizard-suggestion-localseo' ),
				),
				WPSEO_Shortlinker::get( 'https://yoa.st/video-localseo' )
			);
		}

		return $field;
	}

	/**
	 * Get the data for the field.
	 *
	 * @return array
	 */
	public function get_data() {
		return array();
	}

	/**
	 * Save data
	 *
	 * @param array $data Data containing changes.
	 *
	 * @return bool
	 */
	public function set_data( $data ) {
		return true;
	}
}
