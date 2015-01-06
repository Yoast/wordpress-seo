<?php

// Avoid direct calls to this file
if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


/*******************************************************************
 * Option: wpseo_rss
 *******************************************************************/
class WPSEO_Option_RSS extends WPSEO_Option {

	/**
	 * @var  string  option name
	 */
	public $option_name = 'wpseo_rss';

	/**
	 * @var  array  Array of defaults for the option
	 *        Shouldn't be requested directly, use $this->get_defaults();
	 * @internal  Note: Some of the default values are added via the translate_defaults() method
	 */
	protected $defaults = array(
		'rssbefore' => '', // text area
		'rssafter'  => '', // text area
	);


	/**
	 * Get the singleton instance of this class
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
	 * Translate strings used in the option defaults
	 *
	 * @return void
	 */
	public function translate_defaults() {
		$this->defaults['rssafter'] = sprintf( __( 'The post %s appeared first on %s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' );
	}


	/**
	 * Validate the option
	 *
	 * @param  array $dirty New value for the option
	 * @param  array $clean Clean value for the option, normally the defaults
	 * @param  array $old   Old value of the option
	 *
	 * @return  array      Validated clean value for the option to be saved to the database
	 */
	protected function validate_option( $dirty, $clean, $old ) {
		foreach ( $clean as $key => $value ) {
			if ( isset( $dirty[$key] ) ) {
				$clean[$key] = wp_kses_post( $dirty[$key] );
			}
		}

		return $clean;
	}

} /* End of class WPSEO_Option_RSS */
