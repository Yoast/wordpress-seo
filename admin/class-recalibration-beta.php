<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   9.3.0
 */

/**
 * Holds the logic for the recalibration beta.
 */
class WPSEO_Recalibration_Beta implements WPSEO_WordPress_Integration {

	/**
	 * @var string Name of the options.
	 */
	protected $option_name = 'recalibration_beta';

	/**
	 * @var string The read more URL.
	 */
	protected $read_more_url = 'https://yoa.st/recalibration-beta-explanation';

	/**
	 * Shows the feature toggle.
	 *
	 * @return void
	 */
	public function show_feature_toggle() {
		$values = array(
			'on'  => __( 'On', 'wordpress-seo' ),
			'off' => __( 'Off', 'wordpress-seo' ),
		);

		echo '<div class="switch-container">';
		echo '<fieldset id="', esc_attr( $this->option_name ), '" class="fieldset-switch-toggle">';
		echo '<legend><strong>', __( 'Get an even better analysis', 'wordpress-seo' ), '</strong></legend>';
		echo '<p class="clear">';
		printf(
			/* translators: 1: link opening tag, 2: link closing tag, 3: strong opening tag, 4: strong closing tag */
			__(
				'We have %1$srecalibrated our analysis%2$s. With the new analysis, we will get even closer to how Google sees your website. It would be %3$sawesome%4$s if you would like to %3$sbeta test this feature%4$s for us!',
				'wordpress-seo'
			),
			'<a href="' . esc_url( WPSEO_Shortlinker::get( $this->read_more_url ) . '" target="_blank">',
			'</a>',
			'<strong>',
			'</strong>'
		);
		echo '</p>';

		echo '<div class="switch-toggle switch-candy switch-yoast-seo">';

		foreach ( $values as $key => $value ) {
			printf(
				'<input type="radio" id="%1$s" name="%2$s" value="%3$s" %4$s /><label for="%1$s">%5$s</label>',
				esc_attr( $this->option_name . '-' . $key ),
				'wpseo[' . esc_attr( $this->option_name ) . ']',
				esc_attr( $key ),
				checked( $this->get_option_value( self::is_enabled() ), esc_attr( $key ), false ),
				esc_html( $value )
			);
		}
		echo '<a></a></div>';

		echo '<p class="clear"><br/>';
		_e(
			'Simply switch the toggle to "on" and you\'ll be able to use the recalibrated analysis. At the same time, we\'ll add you to our specific mailing list. We\'ll only email you about your experiences with this recalibration!',
			'wordpress-seo'
		);
		echo '</p>';
		echo '</fieldset><div class="clear"></div></div>' . PHP_EOL . PHP_EOL;
	}

	/**
	 * Registers the hook to catch option change.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'update_option_wpseo', array( $this, 'update_option' ), 10, 2 );
	}

	/**
	 * Compares the logic between old and new option value and send the request.
	 *
	 * @param mixed $old_value The old option value.
	 * @param mixed $new_value The new option value.
	 *
	 * @return void
	 */
	public function update_option( $old_value, $new_value ) {
		$old_option_value = false;
		if ( isset( $old_value[ $this->option_name ] ) ) {
			$old_option_value = $old_value[ $this->option_name ];
		}

		$new_option_value = false;
		if ( isset( $new_value[ $this->option_name ] ) ) {
			$new_option_value = $new_value[ $this->option_name ];
		}

		if ( $old_option_value !== $new_option_value && $new_option_value === true ) {
			$this->subscribe_newsletter();
		}
	}

	/**
	 * Checks if the recalibration beta has been enabled.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True whether the beta has been enabled.
	 */
	public static function is_enabled() {
		return WPSEO_Options::get( 'recalibration_beta' );
	}

	/**
	 * Subscribes to the newsletter.
	 *
	 * @codeCoverageIgnore
	 */
	protected function subscribe_newsletter() {
		if ( get_option( 'wpseo_recalibration_beta_newsletter_registration', true ) ) {
			return;
		}

		update_option( 'wpseo_recalibration_beta_newsletter_registration', true );
	}

	/**
	 * Retrieves the option value based on the current setting.
	 *
	 * @param bool $is_enabled Is the option enabled.
	 *
	 * @return string On when is enabled, off when not.
	 */
	protected function get_option_value( $is_enabled ) {
		if ( $is_enabled === true ) {
			return 'on';
		}

		return 'off';
	}
}
