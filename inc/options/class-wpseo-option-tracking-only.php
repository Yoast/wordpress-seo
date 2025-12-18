<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo_tracking_only.
 *
 * For stuff that their only purpose is tracking.
 */
class WPSEO_Option_Tracking_Only extends WPSEO_Option {

	/**
	 * Option name.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo_tracking_only';

	/**
	 * Array of defaults for the option.
	 *
	 * Shouldn't be requested directly, use $this->get_defaults();
	 *
	 * @var array<string, int|string|array<int>>
	 */
	protected $defaults = [
		'task_list_first_opened_on' => '',
		'task_first_actioned_on'    => '',
	];

	/**
	 * Get the singleton instance of this class.
	 *
	 * @return object
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * All concrete classes must contain a validate_option() method which validates all
	 * values within the option.
	 *
	 * @phpcs:disable VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable -- Needed because the function is called with the parameter $old.
	 *
	 * @param array<string, string> $dirty New value for the option.
	 * @param array<string, string> $clean Clean value for the option, normally the defaults.
	 * @param array<string, string> $old   Old value of the option.
	 *
	 * @return array<string, string> The clean option with the saved value.
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				case 'task_list_first_opened_on':
				case 'task_first_actioned_on':
					// These should be set only once and never changed again (unless completely reset to default).

					if ( isset( $dirty[ $key ] ) && $old[ $key ] === $this->get_defaults()[ $key ] ) {
						// Allow setting it for the first time.
						$clean[ $key ] = sanitize_text_field( $dirty[ $key ] );
					}
					elseif ( isset( $dirty[ $key ] ) && $dirty[ $key ] === $this->get_defaults()[ $key ] ) {
						// Allow resetting to default.
						$clean[ $key ] = $dirty[ $key ];
					}
					else {
						// Otherwise keep old value.
						$clean[ $key ] = $old[ $key ];
					}

					break;
			}
		}

		return $clean;
	}
}
