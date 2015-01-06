<?php

// Avoid direct calls to this file
if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


/*******************************************************************
 * Option: wpseo_permalinks
 *******************************************************************/

/**
 * @internal Clean routine for 1.5 not needed as values used to be saved as string 'on' and those will convert
 * automatically
 */
class WPSEO_Option_Permalinks extends WPSEO_Option {

	/**
	 * @var  string  option name
	 */
	public $option_name = 'wpseo_permalinks';

	/**
	 * @var  array  Array of defaults for the option
	 *        Shouldn't be requested directly, use $this->get_defaults();
	 */
	protected $defaults = array(
		'cleanpermalinks'                 => false,
		'cleanpermalink-extravars'        => '', // text field
		'cleanpermalink-googlecampaign'   => false,
		'cleanpermalink-googlesitesearch' => false,
		'cleanreplytocom'                 => false,
		'cleanslugs'                      => true,
		'force_transport'                 => 'default',
		'redirectattachment'              => false,
		'stripcategorybase'               => false,
		'trailingslash'                   => false,
	);


	/**
	 * @static
	 * @var  array $force_transport_options Available options for the force_transport setting
	 *                      Used for input validation
	 *
	 * @internal Important: Make sure the options added to the array here are in line with the keys
	 * for the options set for the select box in the admin/pages/permalinks.php file
	 */
	public static $force_transport_options = array(
		'default', // = leave as-is
		'http',
		'https',
	);


	/**
	 * Add the actions and filters for the option
	 *
	 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
	 * is updated early on and if so, change the call to schedule these for a later action on add/update
	 * instead of running them straight away
	 *
	 * @return \WPSEO_Option_Permalinks
	 */
	protected function __construct() {
		parent::__construct();
		add_action( 'update_option_' . $this->option_name, array( 'WPSEO_Options', 'clear_rewrites' ) );
	}


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
	 * Validate the option
	 *
	 * @param  array $dirty New value for the option
	 * @param  array $clean Clean value for the option, normally the defaults
	 * @param  array $old   Old value of the option (not used here as all fields will always be in the form)
	 *
	 * @return  array      Validated clean value for the option to be saved to the database
	 */
	protected function validate_option( $dirty, $clean, $old ) {

		foreach ( $clean as $key => $value ) {
			switch ( $key ) {
				case 'force_transport':
					if ( isset( $dirty[$key] ) && in_array( $dirty[$key], self::$force_transport_options, true ) ) {
						$clean[$key] = $dirty[$key];
					} else {
						if ( isset( $old[$key] ) && in_array( $old[$key], self::$force_transport_options, true ) ) {
							$clean[$key] = $old[$key];
						}
						if ( function_exists( 'add_settings_error' ) ) {
							add_settings_error(
								$this->group_name, // slug title of the setting
								'_' . $key, // suffix-id for the error message box
								__( 'Invalid transport mode set for the canonical settings. Value reset to default.', 'wordpress-seo' ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
						}
					}
					break;

				/* text fields */
				case 'cleanpermalink-extravars':
					if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
						$clean[$key] = sanitize_text_field( $dirty[$key] );
					}
					break;

				/* boolean (checkbox) fields */
				case 'cleanpermalinks':
				case 'cleanpermalink-googlesitesearch':
				case 'cleanpermalink-googlecampaign':
				case 'cleanreplytocom':
				case 'cleanslugs':
				case 'redirectattachment':
				case 'stripcategorybase':
				case 'trailingslash':
				default:
					$clean[$key] = ( isset( $dirty[$key] ) ? self::validate_bool( $dirty[$key] ) : false );
					break;
			}
		}

		return $clean;
	}


	/**
	 * Clean a given option value
	 *
	 * @param  array  $option_value          Old (not merged with defaults or filtered) option value to
	 *                                       clean according to the rules for this option
	 * @param  string $current_version       (optional) Version from which to upgrade, if not set,
	 *                                       version specific upgrades will be disregarded
	 * @param  array  $all_old_option_values (optional) Only used when importing old options to have
	 *                                       access to the real old values, in contrast to the saved ones
	 *
	 * @return  array            Cleaned option
	 */
	/*protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

		return $option_value;
	}*/


} /* End of class WPSEO_Option_Permalinks */
