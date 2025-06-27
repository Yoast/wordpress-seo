<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Option: wpseo_llmstxt.
 */
class WPSEO_Option_Llmstxt extends WPSEO_Option {

	/**
	 * Option name.
	 *
	 * @var string
	 */
	public $option_name = 'wpseo_llmstxt';

	/**
	 * Array of defaults for the option.
	 *
	 * Shouldn't be requested directly, use $this->get_defaults();
	 *
	 * @var array
	 */
	protected $defaults = [
		'ids_to_include' => [],
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
	 * @param array $dirty New value for the option.
	 * @param array $clean Clean value for the option, normally the defaults.
	 * @param array $old   Old value of the option.
	 *
	 * @return array The clean option with the saved value.
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				case 'ids_to_include':
					$clean[ $key ] = $old[ $key ];

					if ( isset( $dirty[ $key ] ) ) {
						$items = $dirty[ $key ];
						if ( ! is_array( $items ) ) {
							$items = json_decode( $dirty[ $key ], true );
						}

						if ( is_array( $items ) ) {
							$clean[ $key ] = $dirty[ $key ];
						}
					}

					break;
			}
		}

		return $clean;
	}
}
