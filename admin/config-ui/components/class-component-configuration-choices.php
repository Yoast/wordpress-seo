<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the configuration choices component.
 */
class WPSEO_Config_Component_Configuration_Choices implements WPSEO_Config_Component {

	/**
	 * Gets the component identifier.
	 *
	 * @return string
	 */
	public function get_identifier() {
		return 'ConfigurationChoices';
	}

	/**
	 * Gets the field.
	 *
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		/*
		 * Set up the configuration choices.
		 */

		/* translators: %s expands to 'Yoast SEO'. */
		$label = __( 'Please choose the %s configuration of your liking:', 'wordpress-seo' );
		$label = sprintf( $label, 'Yoast SEO' );

		$field = new WPSEO_Config_Field_Configuration_Choices();
		$field->set_property( 'label', $label );

		/* translators: %s expands to 'Yoast SEO'. */
		$title = __( 'Configure %s in a few steps', 'wordpress-seo' );
		$title = sprintf( $title, 'Yoast SEO' );

		/*
		 * Create first choice field.
		 */

		/* translators: %1$s expands to 'Yoast SEO'. */
		$intro_text = __( 'Welcome to the %1$s configuration wizard. In a few simple steps we\'ll help you configure your SEO settings to match your website\'s needs! %1$s will take care of all the technical optimizations your site needs.', 'wordpress-seo' );
		$intro_text = sprintf( $intro_text, 'Yoast SEO' );

		/* translators: %s expands to 'Yoast SEO'. */
		$button_text = sprintf( __( 'Configure %s', 'wordpress-seo' ), 'Yoast SEO' );
		$button      = array(
			'type'   => 'primary',
			'label'  => $button_text,
			'action' => 'nextStep',
		);

		$field->add_choice(
			$title,
			$intro_text,
			$button,
			plugin_dir_url( WPSEO_FILE ) . '/images/Yoast_SEO_Icon.svg'
		);

		/*
		 * Create second choice field.
		 */

		/* translators: %s expands to 'Yoast SEO'. */
		$title = __( 'Get the most out of the %s plugin', 'wordpress-seo' );
		$title = sprintf( $title, 'Yoast SEO' );

		/* translators: %1$s expands to 'Yoast SEO for WordPress', %2$s to Joost de Valk. */
		$plugin_training_text = __( 'If you want to take full advantage of the plugin, get our %1$s training. Get insights from renowned SEO expert %2$s and the team behind the plugin. Actionable tips that\'ll help you configure your site to perform even better in search and for your visitors. Hours of video, sliced into bite-sized clips for you to learn from!', 'wordpress-seo' );
		$plugin_training_text = sprintf( $plugin_training_text, 'Yoast SEO for WordPress', 'Joost de Valk' );

		/* translators: %s expands to 'Yoast SEO'. */
		$button_text = sprintf( __( 'Get the %s plugin training now', 'wordpress-seo' ), 'Yoast SEO' );
		$button      = array(
			'type'   => 'secondary',
			'label'  => $button_text,
			'action' => 'followURL',
			'url'    => WPSEO_Shortlinker::get( 'https://yoa.st/2vg' ),
		);

		$field->add_choice(
			$title,
			$plugin_training_text,
			$button,
			plugin_dir_url( WPSEO_FILE ) . 'images/yoast_seo_for_wp_2.svg'
		);

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
