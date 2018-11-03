<?php
/**
 * WPSEO plugin file.
 *
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
				sprintf( __( 'Do you want to outrank your competition? %1$s gives you awesome additional features that\'ll help you to set up your SEO strategy like a professional. Add synonyms and related keywords, use our Premium SEO analysis, the redirect manager and our internal linking tool. %1$s will also give you access to premium support.', 'wordpress-seo' ), 'Yoast SEO Premium' ),
				array(
					'label' => __( 'Upgrade to Premium', 'wordpress-seo' ),
					'type'  => 'primary',
					'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/wizard-suggestion-premium' ),
				),
				array(
					'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/video-yoast-seo-premium' ),
					'title' => sprintf(
						/* translators: %1$s expands to Yoast SEO Premium. */
						__( '%1$s video', 'wordpress-seo' ),
						'Yoast SEO Premium'
					),
				)
			);
		}

		$field->add_suggestion(
			sprintf(
				/* translators: %1$s resolves to Basic SEO training */
				__( 'Learn all about SEO with our %1$s', 'wordpress-seo' ),
				'Basic SEO training'
			),
			sprintf(
				/* translators: %1$s resolves to Basic SEO training, 2: Yoast SEO */
				__( 'Do you want to learn how you can improve your SEO yourself? In our %1$s you\'ll learn practical SEO skills from keyword research and copywriting to technical SEO and off-page SEO. Using the %2$s plugin is one thing. Doing good SEO day-to-day is another. You simply won\'t get the results you want without putting in work yourself. The %1$s teaches you how.', 'wordpress-seo' ),
				'Basic SEO training',
				'Yoast SEO'
			),
			array(
				'label' => 'Basic SEO training',
				'type'  => 'link',
				'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/2up' ),
			),
			array(
				'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/2v0' ),
				'title' => sprintf(
					/* translators: %1$s expands to Basic SEO training. */
					__( '%1$s video', 'wordpress-seo' ),
					'Basic SEO training'
				),
			)
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
			array(
				'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/video-plugin-course' ),
				'title' => sprintf(
					/* translators: %1$s expands to Yoast SEO plugin training. */
					__( '%1$s video', 'wordpress-seo' ),
					'Yoast SEO plugin training'
				),
			)
		);

		// When we are running in Yoast SEO Premium and don't have Local SEO installed, show Local SEO as suggestion.
		if ( WPSEO_Utils::is_yoast_seo_premium() && ! defined( 'WPSEO_LOCAL_FILE' ) ) {
			$field->add_suggestion(
				__( 'Attract more customers near you', 'wordpress-seo' ),
				/* translators: %1$s resolves to Local SEO */
				sprintf( __( 'If you want to outrank the competition in a specific town or region, check out our %1$s plugin! You’ll be able to easily insert Google maps, opening hours, contact information and a store locator. Besides that %1$s helps you to improve the usability of your contact page.', 'wordpress-seo' ), 'Local SEO' ),
				array(
					'label' => 'Local SEO',
					'type'  => 'link',
					'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/wizard-suggestion-localseo' ),
				),
				array(
					'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/video-localseo' ),
					'title' => sprintf(
						/* translators: %1$s expands to Local SEO. */
						__( '%1$s video', 'wordpress-seo' ),
						'Local SEO'
					),
				)
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
