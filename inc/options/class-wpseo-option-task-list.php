<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo_task_list.
 */
class WPSEO_Option_Task_List extends WPSEO_Option {

	/**
	 * Option name.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo_task_list';

	/**
	 * Array of defaults for the option.
	 *
	 * Shouldn't be requested directly, use $this->get_defaults();
	 *
	 * @var array<string, array<string, string>>
	 */
	protected $defaults = [
		'manually_completed_tasks' => [],
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
	 * @param array<string, array<string, string>> $dirty New value for the option.
	 * @param array<string, array<string, string>> $clean Clean value for the option, normally the defaults.
	 * @param array<string, array<string, string>> $old   Old value of the option.
	 *
	 * @return array<string, array<string, string>> The clean option with the saved value.
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				case 'manually_completed_tasks':
					$clean[ $key ] = $old[ $key ];

					if ( isset( $dirty[ $key ] ) && is_array( $dirty[ $key ] ) ) {
						$clean[ $key ] = $dirty[ $key ];
					}
					break;
			}
		}

		return $clean;
	}
}
