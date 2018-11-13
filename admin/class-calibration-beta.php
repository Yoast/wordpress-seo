<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Bulk Editor
 * @since   1.5.0
 */

/**
 * Holds the logic for the calibration beta.
 */
class WPSEO_Calibration_Beta implements WPSEO_WordPress_Integration {

	/**
	 * @var string Name of the options.
	 */
	private $option_name = 'recalibration_beta';

	/**
	 * Retrieves the settings for the feature toggle.
	 *
	 * @return Yoast_Feature_Toggle Instance of the Yoast Feature toggle.
	 */
	public static function get_feature_toggle() {
		$pre_html = sprintf(
			/* translators: 1: strong opening tag, 2: strong closing tag  */
            __(
            	'We have recalibrated our analysis. With the new analysis, we will get even closer to how Google sees your website. It would be %1$sawesome%2$s if you would like to %1$sbeta test this feature%2$s for us!',
	            'wordpress-seo'
            ),
			'<strong>',
			'</strong>'
		);

		$post_html = __(
			'Simply switch the toggle to "on" and you\'ll be able to use the recalibrated analysis. At the same time, we\'ll add you to our specific mailing list. We\'ll only email you about your experiences with this recalibration!',
			'wordpress-seo'
		);

		return new Yoast_Feature_Toggle(
			array(
				'name'      => __( 'Get an even better analysis', 'wordpress-seo' ),
				'setting'   => 'recalibration_beta',
				'label'     => __( 'We have recalibrated our analysis. With the new analysis, we will get even closer to how Google sees your website. It would be awesome if you would like to beta test this feature for us!', 'wordpress-seo' ),
				'pre_html'  => '<p>' . $pre_html . '</p>',
				'post_html' => '<p>' . $post_html .'</p>',
				'order'     => 100,
			)
		);
	}

	/**
	 * Registers the hook to catch option change.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void.
	 */
	public function register_hooks() {
		add_action( 'update_option_wpseo', array( $this, 'update_option' ), 10, 2 );

	}

	/**
	 * Compares the logic between old and new option value and send the request.
	 *
	 * @param mixed  $old_value The old option value.
	 * @param mixed  $new_value The new option value.
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
			$this->send_request();
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
	 * Sends the request
	 *
	 * @codeCoverageIgnore
	 */
	protected function send_request() {

	}
}