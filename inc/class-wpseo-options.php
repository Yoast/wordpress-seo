<?php
/**
 * @package Internals
 */

// Avoid direct calls to this file
if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_Option' ) ) {
	/**
	 * @package    WordPress\Plugins\WPSeo
	 * @subpackage Internals
	 * @since      1.5.0
	 * @version    1.5.0
	 *
	 * This abstract class and it's concrete classes implement defaults and value validation for
	 * all WPSEO options and subkeys within options.
	 *
	 * Some guidelines:
	 * [Retrieving options]
	 * - Use the normal get_option() to retrieve an option. You will receive a complete array for the option.
	 *    Any subkeys which were not set, will have their default values in place.
	 * - In other words, you will normally not have to check whether a subkey isset() as they will *always* be set.
	 *    They will also *always* be of the correct variable type.
	 *    The only exception to this are the options with variable option names based on post_type or taxonomy
	 *    as those will not always be available before the taxonomy/post_type is registered.
	 *    (they will be available if a value was set, they won't be if it wasn't as the class won't know
	 *    that a default needs to be injected).
	 *    Oh and the very few options where the default value is null, i.e. wpseo->'theme_has_description'
	 *
	 * [Updating/Adding options]
	 * - Use the normal add/update_option() functions. As long a the classes here are instantiated, validation
	 *    for all options and their subkeys will be automatic.
	 * - On (succesfull) update of a couple of options, certain related actions will be run automatically.
	 *    Some examples:
	 *      - on change of wpseo[yoast_tracking], the cron schedule will be adjusted accordingly
	 *      - on change of wpseo_permalinks and wpseo_xml, the rewrite rules will be flushed
	 *      - on change of wpseo and wpseo_title, some caches will be cleared
	 *
	 *
	 * [Important information about add/updating/changing these classes]
	 * - Make sure that option array key names are unique across options. The WPSEO_Options::get_all()
	 *    method merges most options together. If any of them have non-unique names, even if they
	 *    are in a different option, they *will* overwrite each other.
	 * - When you add a new array key in an option: make sure you add proper defaults and add the key
	 *    to the validation routine in the proper place or add a new validation case.
	 *    You don't need to do any upgrading as any option returned will always be merged with the
	 *    defaults, so new options will automatically be available.
	 *    If the default value is a string which need translating, add this to the concrete class
	 *    translate_defaults() method.
	 * - When you remove an array key from an option: if it's important that the option is really removed,
	 *    add the WPSEO_Option::clean_up( $option_name ) method to the upgrade run.
	 *    This will re-save the option and automatically remove the array key no longer in existance.
	 * - When you rename a sub-option: add it to the clean_option() routine and run that in the upgrade run.
	 * - When you change the default for an option sub-key, make sure you verify that the validation routine will
	 *    still work the way it should.
	 *    Example: changing a default from '' (empty string) to 'text' with a validation routine with tests
	 *    for an empty string will prevent a user from saving an empty string as the real value. So the
	 *    test for '' with the validation routine would have to be removed in that case.
	 * - If an option needs specific actions different from defined in this abstract class, you can just overrule
	 *    a method by defining it in the concrete class.
	 *
	 *
	 * @todo       - [JRF => testers] double check that validation will not cause errors when called from upgrade routine
	 * (some of the WP functions may not yet be available)
	 */
	abstract class WPSEO_Option {

		/**
		 * @var  string  Option name - MUST be set in concrete class and set to public.
		 */
		protected $option_name;

		/**
		 * @var  string  Option group name for use in settings forms
		 *         - will be set automagically if not set in concrete class
		 *          (i.e. if it confirm to the normal pattern 'yoast' . $option_name . 'options',
		 *          only set in conrete class if it doesn't)
		 */
		public $group_name;

		/**
		 * @var  bool  Whether to include the option in the return for WPSEO_Options::get_all().
		 *        Also determines which options are copied over for ms_(re)set_blog().
		 */
		public $include_in_all = true;

		/**
		 * @var  bool  Whether this option is only for when the install is multisite.
		 */
		public $multisite_only = false;

		/**
		 * @var  array  Array of defaults for the option - MUST be set in concrete class.
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 */
		protected $defaults;

		/**
		 * @var  array  Array of variable option name patterns for the option - if any -
		 *        Set this when the option contains array keys which vary based on post_type
		 *        or taxonomy
		 */
		protected $variable_array_key_patterns;

		/**
		 * @var  object  Instance of this class
		 */
		protected static $instance;
		
		/**
		 *
		 * @var	bool Whether the filter extension is loaded
		 */
		public static $has_filters = true;


		/* *********** INSTANTIATION METHODS *********** */

		/**
		 * Add all the actions and filters for the option
		 *
		 * @return \WPSEO_Option
		 */
		protected function __construct() {
			
			self::$has_filters = extension_loaded( 'filter' );

			/* Add filters which get applied to the get_options() results */
			$this->add_default_filters(); // return defaults if option not set
			$this->add_option_filters(); // merge with defaults if option *is* set

			/* The option validation routines remove the default filters to prevent failing
			   to insert an option if it's new. Let's add them back afterwards. */
			add_action( 'add_option', array( $this, 'add_default_filters' ) ); // adding back after INSERT

			if ( version_compare( $GLOBALS['wp_version'], '3.7', '!=' ) ) { // adding back after non-WP 3.7 UPDATE
				add_action( 'update_option', array( $this, 'add_default_filters' ) );
			} else { // adding back after WP 3.7 UPDATE
				add_filter( 'pre_update_option_' . $this->option_name, array( $this, 'wp37_add_default_filters' ) );
			}


			/* Make sure the option will always get validated, independently of register_setting()
			   (only available on back-end) */
			add_filter( 'sanitize_option_' . $this->option_name, array( $this, 'validate' ) );

			/* Register our option for the admin pages */
			add_action( 'admin_init', array( $this, 'register_setting' ) );


			/* Set option group name if not given */
			if ( ! isset( $this->group_name ) || $this->group_name === '' ) {
				$this->group_name = 'yoast_' . $this->option_name . '_options';
			}

			/* Translate some defaults as early as possible - textdomain is loaded in init on priority 1 */
			if ( method_exists( $this, 'translate_defaults' ) ) {
				add_action( 'init', array( $this, 'translate_defaults' ), 2 );
			}

			/**
			 * Enrich defaults once custom post types and taxonomies have been registered
			 * which is normally done on the init action.
			 *
			 * @todo - [JRF/testers] verify that none of the options which are only available after
			 * enrichment are used before the enriching
			 */
			if ( method_exists( $this, 'enrich_defaults' ) ) {
				add_action( 'init', array( $this, 'enrich_defaults' ), 99 );
			}
		}


		/**
		 * All concrete classes *must* contain the get_instance method
		 * @internal Unfortunately I can't define it as an abstract as it also *has* to be static....
		 */
		//abstract protected static function get_instance();


		/**
		 * Concrete classes *may* contain a translate_defaults method
		 */
		//abstract public function translate_defaults();


		/**
		 * Concrete classes *may* contain a enrich_defaults method to add additional defaults once
		 * all post_types and taxonomies have been registered
		 */
		//abstract public function enrich_defaults();


		/* *********** METHODS INFLUENCING get_option() *********** */

		/**
		 * Add filters to make sure that the option default is returned if the option is not set
		 *
		 * @return  void
		 */
		public function add_default_filters() {
			// Don't change, needs to check for false as could return prio 0 which would evaluate to false
			if ( has_filter( 'default_option_' . $this->option_name, array( $this, 'get_defaults' ) ) === false ) {
				add_filter( 'default_option_' . $this->option_name, array( $this, 'get_defaults' ) );
			}
			if ( has_filter( 'default_site_option_' . $this->option_name, array( $this, 'get_defaults' ) ) === false ) {
				add_filter( 'default_site_option_' . $this->option_name, array( $this, 'get_defaults' ) );
			}
		}


		/**
		 * Abusing a filter to re-add our default filters
		 * WP 3.7 specific as update_option action hook was in the wrong place temporarily
		 * @see http://core.trac.wordpress.org/ticket/25705
		 *
		 * @param   mixed $new_value
		 *
		 * @return  mixed   unchanged value
		 */
		public function wp37_add_default_filters( $new_value ) {
			$this->add_default_filters();

			return $new_value;
		}


		/**
		 * Remove the default filters.
		 * Called from the validate() method to prevent failure to add new options
		 *
		 * @return  void
		 */
		public function remove_default_filters() {
			remove_filter( 'default_option_' . $this->option_name, array( $this, 'get_defaults' ) );
			remove_filter( 'default_site_option_' . $this->option_name, array( $this, 'get_defaults' ) );
		}


		/**
		 * Get the enriched default value for an option
		 *
		 * Checks if the concrete class contains an enrich_defaults() method and if so, runs it.
		 *
		 * @internal the enrich_defaults method is used to set defaults for variable array keys in an option,
		 * such as array keys depending on post_types and/or taxonomies
		 *
		 * @return  array
		 */
		public function get_defaults() {
			if ( method_exists( $this, 'enrich_defaults' ) ) {
				$this->enrich_defaults();
			}

			return apply_filters( 'wpseo_defaults', $this->defaults, $this->option_name );
		}


		/**
		 * Add filters to make sure that the option is merged with its defaults before being returned
		 *
		 * @return  void
		 */
		public function add_option_filters() {
			// Don't change, needs to check for false as could return prio 0 which would evaluate to false
			if ( has_filter( 'option_' . $this->option_name, array( $this, 'get_option' ) ) === false ) {
				add_filter( 'option_' . $this->option_name, array( $this, 'get_option' ) );
			}
			if ( has_filter( 'site_option_' . $this->option_name, array( $this, 'get_option' ) ) === false ) {
				add_filter( 'site_option_' . $this->option_name, array( $this, 'get_option' ) );
			}
		}


		/**
		 * Remove the option filters.
		 * Called from the clean_up methods to make sure we retrieve the original old option
		 *
		 * @return  void
		 */
		public function remove_option_filters() {
			remove_filter( 'option_' . $this->option_name, array( $this, 'get_option' ) );
			remove_filter( 'site_option_' . $this->option_name, array( $this, 'get_option' ) );
		}


		/**
		 * Merge an option with its default values
		 *
		 * This method should *not* be called directly!!! It is only meant to filter the get_option() results
		 *
		 * @param   mixed $options Option value
		 *
		 * @return  mixed        Option merged with the defaults for that option
		 */
		public function get_option( $options = null ) {
			$filtered = $this->array_filter_merge( $options );

			/* If the option contains variable option keys, make sure we don't remove those settings
			   - even if the defaults are not complete yet.
			   Unfortunately this means we also won't be removing the settings for post types or taxonomies
			   which are no longer in the WP install, but rather that than the other way around */
			if ( isset( $this->variable_array_key_patterns ) ) {
				$filtered = $this->retain_variable_keys( $options, $filtered );
			}

			return $filtered;
		}


		/* *********** METHODS influencing add_uption(), update_option() and saving from admin pages *********** */

		/**
		 * Register (whitelist) the option for the configuration pages.
		 * The validation callback is already registered separately on the sanitize_option hook,
		 * so no need to double register.
		 *
		 * @return void
		 */
		public function register_setting() {
			if ( WPSEO_Options::grant_access() ) {
				register_setting( $this->group_name, $this->option_name );
			}
		}


		/**
		 * Validate the option
		 *
		 * @param  mixed $option_value The unvalidated new value for the option
		 *
		 * @return  array          Validated new value for the option
		 */
		public function validate( $option_value ) {
			$clean = $this->get_defaults();

			/* Return the defaults if the new value is empty */
			if ( ! is_array( $option_value ) || $option_value === array() ) {
				return $clean;
			}


			$option_value = array_map( array( __CLASS__, 'trim_recursive' ), $option_value );
			$old          = get_option( $this->option_name );
			$clean        = $this->validate_option( $option_value, $clean, $old );

			/* Retain the values for variable array keys even when the post type/taxonomy is not yet registered */
			if ( isset( $this->variable_array_key_patterns ) ) {
				$clean = $this->retain_variable_keys( $option_value, $clean );
			}

			$this->remove_default_filters();

			return $clean;
		}


		/**
		 * All concrete classes must contain a validate_option() method which validates all
		 * values within the option
		 */
		abstract protected function validate_option( $dirty, $clean, $old );


		/* *********** METHODS for UPGRADING the option *********** */

		/**
		 * Retrieve the real old value (unmerged with defaults), clean and re-save the option
		 * @uses import()
		 *
		 * @param  string $current_version (optional) Version from which to upgrade, if not set,
		 *                                 version specific upgrades will be disregarded
		 *
		 * @return void
		 */
		public function clean( $current_version = null ) {

			$this->remove_default_filters();
			$this->remove_option_filters();
			$option_value = get_option( $this->option_name ); // = (unvalidated) array, NOT merged with defaults
			$this->add_option_filters();
			$this->add_default_filters();

			$this->import( $option_value, $current_version );
		}


		/**
		 * Clean and re-save the option
		 * @uses clean_option() method from concrete class if it exists
		 *
		 * @todo [JRF/whomever] Figure out a way to show settings error during/after the upgrade - maybe
		 * something along the lines of:
		 * -> add them to a property in this class
		 * -> if that property isset at the end of the routine and add_settings_error function does not exist,
		 *    save as transient (or update the transient if one already exists)
		 * -> next time an admin is in the WP back-end, show the errors and delete the transient or only delete it
		 *    once the admin has dismissed the message (add ajax function)
		 * Important: all validation routines which add_settings_errors would need to be changed for this to work
		 *
		 * @param  array  $option_value          Option value to be imported
		 * @param  string $current_version       (optional) Version from which to upgrade, if not set,
		 *                                       version specific upgrades will be disregarded
		 * @param  array  $all_old_option_values (optional) Only used when importing old options to have
		 *                                       access to the real old values, in contrast to the saved ones
		 *
		 * @return void
		 */
		public function import( $option_value, $current_version = null, $all_old_option_values = null ) {
			if ( $option_value === false ) {
				$option_value = $this->get_defaults();
			}
			elseif ( is_array( $option_value ) && method_exists( $this, 'clean_option' ) ) {
				$option_value = $this->clean_option( $option_value, $current_version, $all_old_option_values );
			}

			/* Save the cleaned value - validation will take care of cleaning out array keys which
			   should no longer be there */
			update_option( $this->option_name, $option_value );
		}


		/**
		 * Concrete classes *may* contain a clean_option method which will clean out old/renamed
		 * values within the option
		 */
		//abstract public function clean_option( $option_value, $current_version = null, $all_old_option_values = null );


		/* *********** HELPER METHODS for internal use *********** */

		/**
		 * Helper method - Combines a fixed array of default values with an options array
		 * while filtering out any keys which are not in the defaults array.
		 *
		 * @todo [JRF] - shouldn't this be a straight array merge ? at the end of the day, the validation
		 * removes any invalid keys on save
		 *
		 * @param  array $options (Optional) Current options
		 *                        - if not set, the option defaults for the $option_key will be returned.
		 *
		 * @return  array  Combined and filtered options array.
		 */
		protected function array_filter_merge( $options = null ) {

			$defaults = $this->get_defaults();

			if ( ! isset( $options ) || $options === false ) {
				return $defaults;
			}

			$options = (array) $options;
			/*$filtered = array();

			if ( $defaults !== array() ) {
				foreach ( $defaults as $key => $default_value ) {
					// @todo should this walk through array subkeys ?
					$filtered[$key] = ( isset( $options[$key] ) ? $options[$key] : $default_value );
				}
			}*/
			$filtered = array_merge( $defaults, $options );

			return $filtered;
		}


		/**
		 * Make sure that any set option values relating to post_types and/or taxonomies are retained,
		 * even when that post_type or taxonomy may not yet have been registered.
		 *
		 * @internal The wpseo_titles concrete class overrules this method. Make sure that any changes
		 * applied here, also get ported to that version.
		 *
		 * @param  array $dirty Original option as retrieved from the database
		 * @param  array $clean Filtered option where any options which shouldn't be in our option
		 *                      have already been removed and any options which weren't set
		 *                      have been set to their defaults
		 *
		 * @return  array
		 */
		protected function retain_variable_keys( $dirty, $clean ) {
			if ( ( is_array( $this->variable_array_key_patterns ) && $this->variable_array_key_patterns !== array() ) && ( is_array( $dirty ) && $dirty !== array() ) ) {
				foreach ( $dirty as $key => $value ) {
					foreach ( $this->variable_array_key_patterns as $pattern ) {
						if ( strpos( $key, $pattern ) === 0 && ! isset( $clean[$key] ) ) {
							$clean[$key] = $value;
							break;
						}
					}
				}
			}

			return $clean;
		}


		/**
		 * Check whether a given array key conforms to one of the variable array key patterns for this option
		 *
		 * @usedby validate_option() methods for options with variable array keys
		 *
		 * @param  string $key Array key to check
		 *
		 * @return  string      Pattern if it conforms, original array key if it doesn't or if the option
		 *              does not have variable array keys
		 */
		protected function get_switch_key( $key ) {
			if ( ! isset( $this->variable_array_key_patterns ) || ( ! is_array( $this->variable_array_key_patterns ) || $this->variable_array_key_patterns === array() ) ) {
				return $key;
			}

			foreach ( $this->variable_array_key_patterns as $pattern ) {
				if ( strpos( $key, $pattern ) === 0 ) {
					return $pattern;
				}
			}

			return $key;
		}


		/* *********** GENERIC HELPER METHODS *********** */

		/**
		 * Emulate the WP native sanitize_text_field function in a %%variable%% safe way
		 * @see https://core.trac.wordpress.org/browser/trunk/src/wp-includes/formatting.php for the original
		 *
		 * Sanitize a string from user input or from the db
		 *
		 * check for invalid UTF-8,
		 * Convert single < characters to entity,
		 * strip all tags,
		 * remove line breaks, tabs and extra white space,
		 * strip octets - BUT DO NOT REMOVE (part of) VARIABLES WHICH WILL BE REPLACED.
		 *
		 * @param string $value
		 *
		 * @return string
		 */
		public static function sanitize_text_field( $value ) {
			$filtered = wp_check_invalid_utf8( $value );

			if ( strpos( $filtered, '<' ) !== false ) {
				$filtered = wp_pre_kses_less_than( $filtered );
				// This will strip extra whitespace for us.
				$filtered = wp_strip_all_tags( $filtered, true );
			} else {
				$filtered = trim( preg_replace( '`[\r\n\t ]+`', ' ', $filtered ) );
			}

			$found = false;
			while ( preg_match( '`[^%](%[a-f0-9]{2})`i', $filtered, $match ) ) {
				$filtered = str_replace( $match[1], '', $filtered );
				$found    = true;
			}

			if ( $found ) {
				// Strip out the whitespace that may now exist after removing the octets.
				$filtered = trim( preg_replace( '` +`', ' ', $filtered ) );
			}

			/**
			 * Filter a sanitized text field string.
			 *
			 * @since WP 2.9.0
			 *
			 * @param string $filtered The sanitized string.
			 * @param string $str      The string prior to being sanitized.
			 */

			return apply_filters( 'sanitize_text_field', $filtered, $value );
		}


		/**
		 * Sanitize a url for saving to the database
		 * Not to be confused with the old native WP function
		 *
		 * @todo [JRF => whomever] check/improve url verification
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this should maybe
		 * be moved to a general WPSEO_Utils class. Obviously all calls to this method should be
		 * adjusted in that case.
		 *
		 * @param  string $value
		 * @param  array  $allowed_protocols
		 *
		 * @return  string
		 */
		public static function sanitize_url( $value, $allowed_protocols = array( 'http', 'https' ) ) {
			return esc_url_raw( sanitize_text_field( rawurldecode( $value ) ), $allowed_protocols );
		}

		/**
		 * Validate a value as boolean
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this (and the emulate method
		 * below) should maybe be moved to a general WPSEO_Utils class. Obviously all calls to this method
		 * should be adjusted in that case.
		 *
		 * @static
		 *
		 * @param  mixed $value
		 *
		 * @return  bool
		 */
		public static function validate_bool( $value ) {
			if( self::$has_filters ) {
				return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
			}
			else {
				return self::emulate_filter_bool( $value );
			}
		}

		/**
		 * Cast a value to bool
		 *
		 * @static
		 *
		 * @param	mixed	$value			Value to cast
		 *
		 * @return	bool
		 */
		public static function emulate_filter_bool( $value ) {
			$true  = array(
				'1',
				'true', 'True', 'TRUE',
				'y', 'Y',
				'yes', 'Yes', 'YES',
				'on', 'On', 'On',
		
			);
			$false = array(
				'0',
				'false', 'False', 'FALSE',
				'n', 'N',
				'no', 'No', 'NO',
				'off', 'Off', 'OFF',
			);
		
			if ( is_bool( $value ) ) {
				return $value;
			}
			else if ( is_int( $value ) && ( $value === 0 || $value === 1 ) ) {
				return (bool) $value;
			}
			else if ( ( is_float( $value ) && ! is_nan( $value ) ) && ( $value === (float) 0 || $value === (float) 1 ) ) {
				return (bool) $value;
			}
			else if ( is_string( $value ) ) {
				$value = trim( $value );
				if ( in_array( $value, $true, true ) ) {
					return true;
				}
				else if ( in_array( $value, $false, true ) ) {
					return false;
				}
				else {
					return false;
				}
			}
			return false;
		}


		/**
		 * Validate a value as integer
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this (and the emulate method
		 * below) should maybe be moved to a general WPSEO_Utils class. Obviously all calls to this method
		 * should be adjusted in that case.
		 *
		 * @static
		 *
		 * @param  mixed $value
		 *
		 * @return  mixed  int or false in case of failure to convert to int
		 */
		public static function validate_int( $value ) {
			if( self::$has_filters ) {
				return filter_var( $value, FILTER_VALIDATE_INT );
			}
			else {
				return self::emulate_filter_int( $value );
			}
		}
		
		/**
		 * Cast a value to integer
		 *
		 * @static
		 *
		 * @param	mixed	$value			Value to cast
		 *
		 * @return	int|bool
		 */
		public static function emulate_filter_int( $value ) {
			if ( is_int( $value ) ) {
				return $value;
			}
			else if ( is_float( $value ) ) {
				if ( (int) $value == $value && ! is_nan( $value ) ) {
					return ( int) $value;
				}
				else {
					return false;
				}
			}
			else if ( is_string( $value ) ) {
				$value = trim( $value );
				if ( $value === '' ) {
					return false;
				}
				else if ( ctype_digit( $value ) ) {
					return (int) $value;
				}
				else if ( strpos( $value, '-' ) === 0 && ctype_digit( substr( $value, 1 ) ) ) {
					return (int) $value ;
				}
				else {
					return false;
				}
			}
			return false;
		}


		/**
		 * Recursively trim whitespace round a string value or of string values within an array
		 * Only trims strings to avoid typecasting a variable (to string)
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this should maybe
		 * be moved to a general WPSEO_Utils class. Obviously all calls to this method should be
		 * adjusted in that case.
		 *
		 * @static
		 *
		 * @param   mixed $value Value to trim or array of values to trim
		 *
		 * @return  mixed      Trimmed value or array of trimmed values
		 */
		public static function trim_recursive( $value ) {
			if ( is_string( $value ) ) {
				$value = trim( $value );
			} elseif ( is_array( $value ) ) {
				$value = array_map( array( __CLASS__, 'trim_recursive' ), $value );
			}

			return $value;
		}

	} /* End of class WPSEO_Option */

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_Wpseo' ) ) {

	class WPSEO_Option_Wpseo extends WPSEO_Option {

		/**
		 * @var  string  option name
		 */
		public $option_name = 'wpseo';

		/**
		 * @var  array  Array of defaults for the option
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 */
		protected $defaults = array(
			// Non-form fields, set via (ajax) function
			'blocking_files'                  => array(),
			'ignore_blog_public_warning'      => false,
			'ignore_meta_description_warning' => null, // overwrite in __construct()
			'ignore_page_comments'            => false,
			'ignore_permalink'                => false,
			'ignore_tour'                     => false,
			'ms_defaults_set'                 => false,
			'theme_description_found'         => null, // overwrite in __construct()
			'theme_has_description'           => null, // overwrite in __construct()
			'tracking_popup_done'             => false,

			// Non-form field, should only be set via validation routine
			'version'                         => '', // leave default as empty to ensure activation/upgrade works

			// Form fields:
			'alexaverify'                     => '', // text field
			'disableadvanced_meta'            => true,
			'googleverify'                    => '', // text field
			'msverify'                        => '', // text field
			'pinterestverify'                 => '',
			'yandexverify'                    => '',
			'yoast_tracking'                  => false,
		);

		public static $desc_defaults = array(
			'ignore_meta_description_warning' => false,
			'theme_description_found'         => '', //  text string description
			'theme_has_description'           => null,
		);


		/**
		 * Add the actions and filters for the option
		 *
		 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
		 * is updated early on and if so, change the call to schedule these for a later action on add/update
		 * instead of running them straight away
		 *
		 * @return \WPSEO_Option_Wpseo
		 */
		protected function __construct() {
			/* Dirty fix for making certain defaults available during activation while still only
			   defining them once */
			foreach ( self::$desc_defaults as $key => $value ) {
				$this->defaults[$key] = $value;
			}

			parent::__construct();

			/* Clear the cache on update/add */
			add_action( 'add_option_' . $this->option_name, array( 'WPSEO_Options', 'clear_cache' ) );
			add_action( 'update_option_' . $this->option_name, array( 'WPSEO_Options', 'clear_cache' ) );


			/* Check if the yoast tracking cron job needs adding/removing on successfull option add/update */
			add_action( 'add_option_' . $this->option_name, array( 'WPSEO_Options', 'schedule_yoast_tracking' ), 15, 2 );
			add_action( 'update_option_' . $this->option_name, array( 'WPSEO_Options', 'schedule_yoast_tracking' ), 15, 2 );
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
		 * @param  array $old   Old value of the option
		 *
		 * @return  array      Validated clean value for the option to be saved to the database
		 */
		protected function validate_option( $dirty, $clean, $old ) {

			foreach ( $clean as $key => $value ) {
				switch ( $key ) {
					case 'version':
						$clean[$key] = WPSEO_VERSION;
						break;


					case 'blocking_files':
						/* @internal [JRF] to really validate this we should also do a file_exists()
						 * on each array entry and remove files which no longer exist, but that might be overkill */
						if ( isset( $dirty[$key] ) && is_array( $dirty[$key] ) ) {
							$clean[$key] = array_unique( $dirty[$key] );
						} elseif ( isset( $old[$key] ) && is_array( $old[$key] ) ) {
							$clean[$key] = array_unique( $old[$key] );
						}
						break;


					case 'theme_description_found':
						if ( isset( $dirty[$key] ) && is_string( $dirty[$key] ) ) {
							$clean[$key] = $dirty[$key]; // @todo [JRF/whomever] maybe do wp_kses ?
						} elseif ( isset( $old[$key] ) && is_string( $old[$key] ) ) {
							$clean[$key] = $old[$key];
						}
						break;


					/* text fields */
					case 'alexaverify':
					case 'googleverify':
					case 'msverify':
					case 'pinterestverify':
					case 'yandexverify':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$meta = $dirty[$key];
							if ( strpos( $meta, 'content=' ) ) {
								// Make sure we only have the real key, not a complete meta tag
								preg_match( '`content=([\'"])([^\'"]+)\1`', $meta, $match );
								if ( isset( $match[2] ) ) {
									$meta = $match[2];
								}
								unset( $match );
							}

							$meta = sanitize_text_field( $meta );
							if ( $meta !== '' ) {
								$regex   = '`^[A-Fa-f0-9_-]+$`';
								$service = '';

								switch ( $key ) {
									case 'googleverify':
										$regex = '`^[A-Za-z0-9_-]+$`';
										$service = 'Google Webmaster tools';
										break;

									case 'msverify':
										$service = 'Bing Webmaster tools';
										break;

									case 'pinterestverify':
										$service = 'Pinterest';
										break;

									case 'yandexverify':
										$service = 'Yandex Webmaster tools';
										break;

									case 'alexaverify':
										$regex = '`^[A-Za-z0-9_-]{20,}$`';
										$service = 'Alexa ID';
								}
								
								if ( preg_match( $regex, $meta ) ) {
									$clean[$key] = $meta;
								} else {
									if ( isset( $old[$key] ) && preg_match( $regex, $old[$key] ) ) {
										$clean[$key] = $old[$key];
									}
									if ( function_exists( 'add_settings_error' ) ) {
										add_settings_error(
											$this->group_name, // slug title of the setting
											'_' . $key, // suffix-id for the error message box
											sprintf( __( '%s does not seem to be a valid %s verification string. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( $meta ) . '</strong>', $service ), // the error message
											'error' // error type, either 'error' or 'updated'
										);
									}
								}
							}
							unset( $meta, $regex, $service );
						}
						break;


					/* boolean|null fields - if set a check was done, if null, it hasn't */
					case 'theme_has_description':
						if ( isset( $dirty[$key] ) ) {
							$clean[$key] = self::validate_bool( $dirty[$key] );
						} elseif ( isset( $old[$key] ) ) {
							$clean[$key] = self::validate_bool( $old[$key] );
						}
						break;


					/* boolean dismiss warnings - not fields - may not be in form
					   (and don't need to be either as long as the default is false) */
					case 'ignore_blog_public_warning':
					case 'ignore_meta_description_warning':
					case 'ignore_page_comments':
					case 'ignore_permalink':
					case 'ignore_tour':
					case 'ms_defaults_set':
					case 'tracking_popup_done':
						if ( isset( $dirty[$key] ) ) {
							$clean[$key] = self::validate_bool( $dirty[$key] );
						} elseif ( isset( $old[$key] ) ) {
							$clean[$key] = self::validate_bool( $old[$key] );
						}
						break;


					/* boolean (checkbox) fields */
					case 'disableadvanced_meta':
					case 'yoast_tracking':
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
		protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

			// Rename some options *and* change their value
			$rename = array(
				'presstrends'       => array(
					'new_name'  => 'yoast_tracking',
					'new_value' => true,
				),
				'presstrends_popup' => array(
					'new_name'  => 'tracking_popup_done',
					'new_value' => true,
				),
			);
			foreach ( $rename as $old => $new ) {
				if ( isset( $option_value[$old] ) && ! isset( $option_value[$new['new_name']] ) ) {
					$option_value[$new['new_name']] = $new['new_value'];
					unset( $option_value[$old] );
				}
			}
			unset( $rename, $old, $new );


			// Deal with renaming of some options without losing the settings
			$rename = array(
				'tracking_popup'           => 'tracking_popup_done',
				'meta_description_warning' => 'ignore_meta_description_warning',
			);
			foreach ( $rename as $old => $new ) {
				if ( isset( $option_value[$old] ) && ! isset( $option_value[$new] ) ) {
					$option_value[$new] = $option_value[$old];
					unset( $option_value[$old] );
				}
			}
			unset( $rename, $old, $new );


			// Change a array sub-option to two straight sub-options
			if ( isset( $option_value['theme_check']['description'] ) && ! isset( $option_value['theme_has_description'] ) ) {
				// @internal the negate is by design!
				$option_value['theme_has_description'] = ! $option_value['theme_check']['description'];
			}
			if ( isset( $option_values['theme_check']['description_found'] ) && ! isset( $option_value['theme_description_found'] ) ) {
				$option_value['theme_description_found'] = $option_value['theme_check']['description_found'];
			}


			// Deal with value change from text string to boolean
			$value_change = array(
				'ignore_blog_public_warning',
				'ignore_meta_description_warning',
				'ignore_page_comments',
				'ignore_permalink',
				'ignore_tour',
				'tracking_popup_done',
				//'disableadvanced_meta', => not needed as is 'on' which will auto-convert to true
			);
			foreach ( $value_change as $key ) {
				if ( isset( $option_value[$key] ) && in_array( $option_value[$key], array( 'ignore', 'done' ), true ) ) {
					$option_value[$key] = true;
				}
			}

			return $option_value;
		}

	} /* End of class WPSEO_Option_Wpseo */

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_permalinks
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_Permalinks' ) ) {

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

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_titles
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_Titles' ) ) {

	class WPSEO_Option_Titles extends WPSEO_Option {

		/**
		 * @var  string  option name
		 */
		public $option_name = 'wpseo_titles';

		/**
		 * @var  array  Array of defaults for the option
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 * @internal  Note: Some of the default values are added via the translate_defaults() method
		 */
		protected $defaults = array(
			// Non-form fields, set via (ajax) function
			'title_test'             => 0,

			// Form fields
			'forcerewritetitle'      => false,
			'hide-feedlinks'         => false,
			'hide-rsdlink'           => false,
			'hide-shortlink'         => false,
			'hide-wlwmanifest'       => false,
			'noodp'                  => false,
			'noydir'                 => false,
			'usemetakeywords'        => false,

			'title-home-wpseo'       => '%%sitename%% %%page%% %%sep%% %%sitedesc%%', // text field
			'title-author-wpseo'     => '', // text field
			'title-archive-wpseo'    => '%%date%% %%page%% %%sep%% %%sitename%%', // text field
			'title-search-wpseo'     => '', // text field
			'title-404-wpseo'        => '', // text field

			'metadesc-home-wpseo'    => '', // text area
			'metadesc-author-wpseo'  => '', // text area
			'metadesc-archive-wpseo' => '', // text area

			'metakey-home-wpseo'     => '', // text field
			'metakey-author-wpseo'   => '', // text field

			'noindex-subpages-wpseo' => false,
			'noindex-author-wpseo'   => false,
			'noindex-archive-wpseo'  => true,

			'disable-author'         => false,
			'disable-date'           => false,


			/**
			 * Uses enrich_defaults to add more along the lines of:
			 * - 'title-' . $pt->name        => ''; // text field
			 * - 'metadesc-' . $pt->name      => ''; // text field
			 * - 'metakey-' . $pt->name        => ''; // text field
			 * - 'noindex-' . $pt->name        => false;
			 * - 'noauthorship-' . $pt->name    => false;
			 * - 'showdate-' . $pt->name      => false;
			 * - 'hideeditbox-' . $pt->name      => false;
			 *
			 * - 'title-ptarchive-' . $pt->name    => ''; // text field
			 * - 'metadesc-ptarchive-' . $pt->name  => ''; // text field
			 * - 'metakey-ptarchive-' . $pt->name  => ''; // text field
			 * - 'bctitle-ptarchive-' . $pt->name  => ''; // text field
			 * - 'noindex-ptarchive-' . $pt->name  => false;
			 *
			 * - 'title-tax-' . $tax->name      => '''; // text field
			 * - 'metadesc-tax-' . $tax->name    => ''; // text field
			 * - 'metakey-tax-' . $tax->name    => ''; // text field
			 * - 'noindex-tax-' . $tax->name    => false;
			 * - 'hideeditbox-tax-' . $tax->name  => false;
			 */
		);

		/**
		 * @var  array  Array of variable option name patterns for the option
		 */
		protected $variable_array_key_patterns = array(
			'title-',
			'metadesc-',
			'metakey-',
			'noindex-',
			'noauthorship-',
			'showdate-',
			'hideeditbox-',
			'bctitle-ptarchive-',
		);


		/**
		 * Add the actions and filters for the option
		 *
		 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
		 * is updated early on and if so, change the call to schedule these for a later action on add/update
		 * instead of running them straight away
		 *
		 * @return \WPSEO_Option_Titles
		 */
		protected function __construct() {
			parent::__construct();
			add_action( 'update_option_' . $this->option_name, array( 'WPSEO_Options', 'clear_cache' ) );
			add_action( 'init', array( $this, 'end_of_init' ), 999 );
		}


		/**
		 * Make sure we can recognize the right action for the double cleaning
		 */
		public function end_of_init() {
			do_action( 'wpseo_double_clean_titles' );
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
		 * Translate strings used in the option defaults
		 *
		 * @return void
		 */
		public function translate_defaults() {
			$this->defaults['title-author-wpseo'] = sprintf( __( '%s, Author at %s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ';
			$this->defaults['title-search-wpseo'] = sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%';
			$this->defaults['title-404-wpseo']    = __( 'Page Not Found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%';
		}


		/**
		 * Add dynamically created default options based on available post types and taxonomies
		 *
		 * @return  void
		 */
		public function enrich_defaults() {

			// Retrieve all the relevant post type and taxonomy arrays
			$post_type_names = get_post_types( array( 'public' => true ), 'names' );

			$post_type_objects_custom = get_post_types( array( 'public' => true, '_builtin' => false ), 'objects' );

			$taxonomy_names = get_taxonomies( array( 'public' => true ), 'names' );


			if ( $post_type_names !== array() ) {
				foreach ( $post_type_names as $pt ) {
					$this->defaults['title-' . $pt]    = '%%title%% %%page%% %%sep%% %%sitename%%'; // text field
					$this->defaults['metadesc-' . $pt] = ''; // text area
					$this->defaults['metakey-' . $pt]  = ''; // text field
					$this->defaults['noindex-' . $pt]  = false;
					if ( 'post' == $pt ) {
						$this->defaults['noauthorship-' . $pt] = false;
					} else {
						$this->defaults['noauthorship-' . $pt] = true;
					}

					$this->defaults['showdate-' . $pt]    = false;
					$this->defaults['hideeditbox-' . $pt] = false;
				}
				unset( $pt );
			}

			if ( $post_type_objects_custom !== array() ) {
				foreach ( $post_type_objects_custom as $pt ) {
					if ( ! $pt->has_archive ) {
						continue;
					}

					$this->defaults['title-ptarchive-' . $pt->name]    = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' ) . ' %%page%% %%sep%% %%sitename%%'; // text field
					$this->defaults['metadesc-ptarchive-' . $pt->name] = ''; // text area
					$this->defaults['metakey-ptarchive-' . $pt->name]  = ''; // text field
					$this->defaults['bctitle-ptarchive-' . $pt->name]  = ''; // text field
					$this->defaults['noindex-ptarchive-' . $pt->name]  = false;
				}
				unset( $pt );
			}

			if ( $taxonomy_names !== array() ) {
				foreach ( $taxonomy_names as $tax ) {
					$this->defaults['title-tax-' . $tax]       = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' ) . ' %%page%% %%sep%% %%sitename%%'; // text field
					$this->defaults['metadesc-tax-' . $tax]    = ''; // text area
					$this->defaults['metakey-tax-' . $tax]     = ''; // text field
					$this->defaults['hideeditbox-tax-' . $tax] = false;

					if ( $tax !== 'post_format' ) {
						$this->defaults['noindex-tax-' . $tax] = false;
					} else {
						$this->defaults['noindex-tax-' . $tax] = true;
					}
				}
				unset( $tax );
			}
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
				$switch_key = $this->get_switch_key( $key );

				switch ( $switch_key ) {
					/* text fields */
					/* Covers:
					   'title-home-wpseo', 'title-author-wpseo', 'title-archive-wpseo',
					   'title-search-wpseo', 'title-404-wpseo'
					   'title-' . $pt->name
					   'title-ptarchive-' . $pt->name
					   'title-tax-' . $tax->name */
					case 'title-':
						if ( isset( $dirty[$key] ) ) {
							$clean[$key] = self::sanitize_text_field( $dirty[$key] );
						}
						break;

					/* Covers:
					   'metadesc-home-wpseo', 'metadesc-author-wpseo', 'metadesc-archive-wpseo'
					   'metadesc-' . $pt->name
					   'metadesc-ptarchive-' . $pt->name
					   'metadesc-tax-' . $tax->name */
					case 'metadesc-':
						/* Covers:
							 'metakey-home-wpseo', 'metakey-author-wpseo'
							 'metakey-' . $pt->name
							 'metakey-ptarchive-' . $pt->name
							 'metakey-tax-' . $tax->name */
					case 'metakey-':
						/* Covers:
							 ''bctitle-ptarchive-' . $pt->name */
					case 'bctitle-ptarchive-':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$clean[$key] = self::sanitize_text_field( $dirty[$key] );
						}
						break;


					/* integer field - not in form*/
					case 'title_test':
						if ( isset( $dirty[$key] ) ) {
							$int = self::validate_int( $dirty[$key] );
							if ( $int !== false && $int >= 0 ) {
								$clean[$key] = $int;
							}
						} elseif ( isset( $old[$key] ) ) {
							$int = self::validate_int( $old[$key] );
							if ( $int !== false && $int >= 0 ) {
								$clean[$key] = $int;
							}
						}
						break;


					/* boolean fields */
					case 'forcerewritetitle':
					case 'usemetakeywords':
					case 'noodp':
					case 'noydir':
					case 'hide-rsdlink':
					case 'hide-wlwmanifest':
					case 'hide-shortlink':
					case 'hide-feedlinks':
					case 'disable-author':
					case 'disable-date':
						/* Covers:
							 'noindex-subpages-wpseo', 'noindex-author-wpseo', 'noindex-archive-wpseo'
							 'noindex-' . $pt->name
							 'noindex-ptarchive-' . $pt->name
							 'noindex-tax-' . $tax->name */
					case 'noindex-':
					case 'noauthorship-': /* 'noauthorship-' . $pt->name */
					case 'showdate-': /* 'showdate-'. $pt->name */
						/* Covers:
							 'hideeditbox-'. $pt->name
							 'hideeditbox-tax-' . $tax->name */
					case 'hideeditbox-':
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
		protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {
			static $original = null;

			// Double-run this function to ensure renaming of the taxonomy options will work
			if ( ! isset( $original ) && has_action( 'wpseo_double_clean_titles', array( $this, 'clean' ) ) === false ) {
				add_action( 'wpseo_double_clean_titles', array( $this, 'clean' ) );
				$original = $option_value;
			}

			/* Move options from very old option to this one
			   @internal Don't rename to the 'current' names straight away as that would prevent
			   the rename/unset combi below from working
			   @todo [JRF] maybe figure out a smarter way to deal with this */
			$old_option = null;
			if ( isset( $all_old_option_values ) ) {
				// Ok, we have an import
				if ( isset( $all_old_option_values['wpseo_indexation'] ) && is_array( $all_old_option_values['wpseo_indexation'] ) && $all_old_option_values['wpseo_indexation'] !== array() ) {
					$old_option = $all_old_option_values['wpseo_indexation'];
				}
			} else {
				$old_option = get_option( 'wpseo_indexation' );
			}
			if ( is_array( $old_option ) && $old_option !== array() ) {
				$move = array(
					'noindexauthor'     => 'noindex-author',
					'disableauthor'     => 'disable-author',
					'noindexdate'       => 'noindex-archive',
					'noindexcat'        => 'noindex-category',
					'noindextag'        => 'noindex-post_tag',
					'noindexpostformat' => 'noindex-post_format',
					'noindexsubpages'   => 'noindex-subpages',
					'hidersdlink'       => 'hide-rsdlink',
					'hidefeedlinks'     => 'hide-feedlinks',
					'hidewlwmanifest'   => 'hide-wlwmanifest',
					'hideshortlink'     => 'hide-shortlink',
				);
				foreach ( $move as $old => $new ) {
					if ( isset( $old_option[$old] ) && ! isset( $option_value[$new] ) ) {
						$option_value[$new] = $old_option[$old];
					}
				}
				unset( $move, $old, $new );
			}
			unset( $old_option );


			// Fix wrongness created by buggy version 1.2.2
			if ( isset( $option_value['title-home'] ) && $option_value['title-home'] === '%%sitename%% - %%sitedesc%% - 12345' ) {
				$option_value['title-home-wpseo'] = '%%sitename%% - %%sitedesc%%';
			}


			/* Renaming these options to avoid ever overwritting these if a (bloody stupid) user /
			   programmer would use any of the following as a custom post type or custom taxonomy:
			   'home', 'author', 'archive', 'search', '404', 'subpages'

			   Similarly, renaming the tax options to avoid a custom post type and a taxonomy
			   with the same name occupying the same option */
			$rename = array(
				'title-home'       => 'title-home-wpseo',
				'title-author'     => 'title-author-wpseo',
				'title-archive'    => 'title-archive-wpseo',
				'title-search'     => 'title-search-wpseo',
				'title-404'        => 'title-404-wpseo',
				'metadesc-home'    => 'metadesc-home-wpseo',
				'metadesc-author'  => 'metadesc-author-wpseo',
				'metadesc-archive' => 'metadesc-archive-wpseo',
				'metakey-home'     => 'metakey-home-wpseo',
				'metakey-author'   => 'metakey-author-wpseo',
				'noindex-subpages' => 'noindex-subpages-wpseo',
				'noindex-author'   => 'noindex-author-wpseo',
				'noindex-archive'  => 'noindex-archive-wpseo',
			);
			foreach ( $rename as $old => $new ) {
				if ( isset( $option_value[$old] ) && ! isset( $option_value[$new] ) ) {
					$option_value[$new] = $option_value[$old];
					unset( $option_value[$old] );
				}
			}
			unset( $rename, $old, $new );


			/* @internal This clean-up action can only be done effectively once the taxonomies and post_types
			 * have been registered, i.e. at the end of the init action. */
			if ( isset( $original ) && current_filter() === 'wpseo_double_clean_titles' || did_action( 'wpseo_double_clean_titles' ) > 0 ) {
				$rename          = array(
					'title-'           => 'title-tax-',
					'metadesc-'        => 'metadesc-tax-',
					'metakey-'         => 'metakey-tax-',
					'noindex-'         => 'noindex-tax-',
					'tax-hideeditbox-' => 'hideeditbox-tax-',

				);
				$taxonomy_names  = get_taxonomies( array( 'public' => true ), 'names' );
				$post_type_names = get_post_types( array( 'public' => true ), 'names' );
				$defaults        = $this->get_defaults();
				if ( $taxonomy_names !== array() ) {
					foreach ( $taxonomy_names as $tax ) {
						foreach ( $rename as $old_prefix => $new_prefix ) {
							if (
									( isset( $original[$old_prefix . $tax] ) && ! isset( $original[$new_prefix . $tax] ) )
									&& ( ! isset( $option_value[$new_prefix . $tax] )
											|| ( isset( $option_value[$new_prefix . $tax] )
													&& $option_value[$new_prefix . $tax] === $defaults[$new_prefix . $tax] ) )
							) {
								$option_value[$new_prefix . $tax] = $original[$old_prefix . $tax];

								/* Check if there is a cpt with the same name as the tax,
								   if so, we should make sure that the old setting hasn't been removed */
								if ( ! isset( $post_type_names[$tax] ) && isset( $option_value[$old_prefix . $tax] ) ) {
									unset( $option_value[$old_prefix . $tax] );
								} else {
									if ( isset( $post_type_names[$tax] ) && ! isset( $option_value[$old_prefix . $tax] ) ) {
										$option_value[$old_prefix . $tax] = $original[$old_prefix . $tax];
									}
								}

								if ( $old_prefix === 'tax-hideeditbox-' ) {
									unset( $option_value[$old_prefix . $tax] );
								}
							}
						}
					}
				}
				unset( $rename, $taxonomy_names, $post_type_names, $tax, $old_prefix, $new_prefix );
			}


			/* Make sure the values of the variable option key options are cleaned as they
		 	   may be retained and would not be cleaned/validated then */
			if ( is_array( $option_value ) && $option_value !== array() ) {
				foreach ( $option_value as $key => $value ) {
					$switch_key = $this->get_switch_key( $key );

					// Similar to validation routine - any changes made there should be made here too
					switch ( $switch_key ) {
						/* text fields */
						case 'title-':
						case 'metadesc-':
						case 'metakey-':
						case 'bctitle-ptarchive-':
							$option_value[$key] = self::sanitize_text_field( $value );
							break;


						/* boolean fields */
						case 'noindex-':
						case 'noauthorship-':
						case 'showdate-':
						case 'hideeditbox-':
						default:
							$option_value[$key] = self::validate_bool( $value );
							break;
					}
				}
			}

			return $option_value;
		}


		/**
		 * Make sure that any set option values relating to post_types and/or taxonomies are retained,
		 * even when that post_type or taxonomy may not yet have been registered.
		 *
		 * @internal Overrule the abstract class version of this to make sure one extra renamed variable key
		 * does not get removed. IMPORTANT: keep this method in line with the parent on which it is based!
		 *
		 * @param  array $dirty Original option as retrieved from the database
		 * @param  array $clean Filtered option where any options which shouldn't be in our option
		 *                      have already been removed and any options which weren't set
		 *                      have been set to their defaults
		 *
		 * @return  array
		 */
		protected function retain_variable_keys( $dirty, $clean ) {
			if ( ( is_array( $this->variable_array_key_patterns ) && $this->variable_array_key_patterns !== array() ) && ( is_array( $dirty ) && $dirty !== array() ) ) {

				// Add the extra pattern
				$patterns   = $this->variable_array_key_patterns;
				$patterns[] = 'tax-hideeditbox-';

				foreach ( $dirty as $key => $value ) {
					foreach ( $patterns as $pattern ) {
						if ( strpos( $key, $pattern ) === 0 && ! isset( $clean[$key] ) ) {
							$clean[$key] = $value;
							break;
						}
					}
				}
			}

			return $clean;
		}


	} /* End of class WPSEO_Option_Titles */

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_rss
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_RSS' ) ) {

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

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_internallinks
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_InternalLinks' ) ) {

	class WPSEO_Option_InternalLinks extends WPSEO_Option {

		/**
		 * @var  string  option name
		 */
		public $option_name = 'wpseo_internallinks';

		/**
		 * @var  array  Array of defaults for the option
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 * @internal  Note: Some of the default values are added via the translate_defaults() method
		 */
		protected $defaults = array(
			'breadcrumbs-404crumb'      => '', // text field
			'breadcrumbs-blog-remove'   => false,
			'breadcrumbs-boldlast'      => false,
			'breadcrumbs-archiveprefix' => '', // text field
			'breadcrumbs-enable'        => false,
			'breadcrumbs-home'          => '', // text field
			'breadcrumbs-prefix'        => '', // text field
			'breadcrumbs-searchprefix'  => '', // text field
			'breadcrumbs-sep'           => '&raquo;', // text field

			/**
			 * Uses enrich_defaults() to add more along the lines of:
			 * - 'post_types-' . $pt->name . '-maintax'    => 0 / string
			 * - 'taxonomy-' . $tax->name . '-ptparent'    => 0 / string
			 */
		);

		/**
		 * @var  array  Array of variable option name patterns for the option
		 */
		protected $variable_array_key_patterns = array(
			'post_types-',
			'taxonomy-',
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
			$this->defaults['breadcrumbs-404crumb']      = __( 'Error 404: Page not found', 'wordpress-seo' );
			$this->defaults['breadcrumbs-archiveprefix'] = __( 'Archives for', 'wordpress-seo' );
			$this->defaults['breadcrumbs-home']          = __( 'Home', 'wordpress-seo' );
			$this->defaults['breadcrumbs-searchprefix']  = __( 'You searched for', 'wordpress-seo' );
		}


		/**
		 * Add dynamically created default options based on available post types and taxonomies
		 *
		 * @return  void
		 */
		public function enrich_defaults() {

			// Retrieve all the relevant post type and taxonomy arrays
			$post_type_names       = get_post_types( array( 'public' => true ), 'names' );
			$taxonomy_names_custom = get_taxonomies( array( 'public' => true, '_builtin' => false ), 'names' );

			if ( $post_type_names !== array() ) {
				foreach ( $post_type_names as $pt ) {
					$pto_taxonomies = get_object_taxonomies( $pt, 'names' );
					if ( $pto_taxonomies !== array() ) {
						$this->defaults['post_types-' . $pt . '-maintax'] = 0; // select box
					}
					unset( $pto_taxonomies );
				}
				unset( $pt );
			}

			if ( $taxonomy_names_custom !== array() ) {
				foreach ( $taxonomy_names_custom as $tax ) {
					$this->defaults['taxonomy-' . $tax . '-ptparent'] = 0; // select box;
				}
				unset( $tax );
			}
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

			$allowed_post_types = $this->get_allowed_post_types();

			foreach ( $clean as $key => $value ) {

				$switch_key = $this->get_switch_key( $key );

				switch ( $switch_key ) {
					/* text fields */
					case 'breadcrumbs-404crumb':
					case 'breadcrumbs-archiveprefix':
					case 'breadcrumbs-home':
					case 'breadcrumbs-prefix':
					case 'breadcrumbs-searchprefix':
					case 'breadcrumbs-sep':
						if ( isset( $dirty[$key] ) ) {
							$clean[$key] = wp_kses_post( $dirty[$key] );
						}
						break;


					/* 'post_types-' . $pt->name . '-maintax' fields */
					case 'post_types-':
						$post_type  = str_replace( array( 'post_types-', '-maintax' ), '', $key );
						$taxonomies = get_object_taxonomies( $post_type, 'names' );

						if ( isset( $dirty[$key] ) ) {
							if ( $taxonomies !== array() && in_array( $dirty[$key], $taxonomies, true ) ) {
								$clean[$key] = $dirty[$key];
							} elseif ( (string) $dirty[$key] === '0' ) {
								$clean[$key] = 0;
							} elseif ( sanitize_title_with_dashes( $dirty[$key] ) === $dirty[$key] ) {
								// Allow taxonomies which may not be registered yet
								$clean[$key] = $dirty[$key];
							} else {
								if ( isset( $old[$key] ) ) {
									$clean[$key] = sanitize_title_with_dashes( $old[$key] );
								}
								if ( function_exists( 'add_settings_error' ) ) {
									/* @todo [JRF => whomever] maybe change the untranslated $pt name in the
									 * error message to the nicely translated label ? */
									add_settings_error(
										$this->group_name, // slug title of the setting
											'_' . $key, // suffix-id for the error message box
										sprintf( __( 'Please select a valid taxonomy for post type "%s"', 'wordpress-seo' ), $post_type ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
								}
							}
						} elseif ( isset( $old[$key] ) ) {
							$clean[$key] = sanitize_title_with_dashes( $old[$key] );
						}
						unset( $taxonomies, $post_type );
						break;


					/* 'taxonomy-' . $tax->name . '-ptparent' fields */
					case 'taxonomy-':
						if ( isset( $dirty[$key] ) ) {
							if ( $allowed_post_types !== array() && in_array( $dirty[$key], $allowed_post_types, true ) ) {
								$clean[$key] = $dirty[$key];
							} elseif ( (string) $dirty[$key] === '0' ) {
								$clean[$key] = 0;
							} elseif ( sanitize_key( $dirty[$key] ) === $dirty[$key] ) {
								// Allow taxonomies which may not be registered yet
								$clean[$key] = $dirty[$key];
							} else {
								if ( isset( $old[$key] ) ) {
									$clean[$key] = sanitize_key( $old[$key] );
								}
								if ( function_exists( 'add_settings_error' ) ) {
									/* @todo [JRF =? whomever] maybe change the untranslated $tax name in the
									 * error message to the nicely translated label ? */
									$tax = str_replace( array( 'taxonomy-', '-ptparent' ), '', $key );
									add_settings_error(
										$this->group_name, // slug title of the setting
											'_' . $tax, // suffix-id for the error message box
										sprintf( __( 'Please select a valid post type for taxonomy "%s"', 'wordpress-seo' ), $tax ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
									unset( $tax );
								}
							}
						} elseif ( isset( $old[$key] ) ) {
							$clean[$key] = sanitize_key( $old[$key] );
						}
						break;


					/* boolean fields */
					case 'breadcrumbs-blog-remove':
					case 'breadcrumbs-boldlast':
					case 'breadcrumbs-enable':
					default:
						$clean[$key] = ( isset( $dirty[$key] ) ? self::validate_bool( $dirty[$key] ) : false );
						break;
				}
			}

			return $clean;
		}


		/**
		 * Retrieve a list of the allowed post types as breadcrumb parent for a taxonomy
		 * Helper method for validation
		 * @internal don't make static as new types may still be registered
		 */
		protected function get_allowed_post_types() {
			$allowed_post_types = array();

			$post_types = get_post_types( array( 'public' => true ), 'objects' );

			if ( get_option( 'show_on_front' ) == 'page' ) {
				$allowed_post_types[] = 'post';
			}

			if ( is_array( $post_types ) && $post_types !== array() ) {
				foreach ( $post_types as $type ) {
					if ( $type->has_archive ) {
						$allowed_post_types[] = $type->name;
					}
				}
			}

			return $allowed_post_types;
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
		protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

			/* Make sure the values of the variable option key options are cleaned as they
		 	   may be retained and would not be cleaned/validated then */
			if ( is_array( $option_value ) && $option_value !== array() ) {

				$allowed_post_types = $this->get_allowed_post_types();

				foreach ( $option_value as $key => $value ) {
					$switch_key = $this->get_switch_key( $key );

					// Similar to validation routine - any changes made there should be made here too
					switch ( $switch_key ) {
						/* 'post_types-' . $pt->name . '-maintax' fields */
						case 'post_types-':
							$post_type  = str_replace( array( 'post_types-', '-maintax' ), '', $key );
							$taxonomies = get_object_taxonomies( $post_type, 'names' );

							if ( $taxonomies !== array() && in_array( $value, $taxonomies, true ) ) {
								$option_value[$key] = $value;
							} elseif ( (string) $value === '0' ) {
								$option_value[$key] = 0;
							} elseif ( sanitize_title_with_dashes( $value ) === $value ) {
								// Allow taxonomies which may not be registered yet
								$option_value[$key] = $value;
							}
							unset( $taxonomies, $post_type );
							break;


						/* 'taxonomy-' . $tax->name . '-ptparent' fields */
						case 'taxonomy-':
							if ( $allowed_post_types !== array() && in_array( $value, $allowed_post_types, true ) ) {
								$option_value[$key] = $value;
							} elseif ( (string) $value === '0' ) {
								$option_value[$key] = 0;
							} elseif ( sanitize_key( $option_value[$key] ) === $option_value[$key] ) {
								// Allow post types which may not be registered yet
								$option_value[$key] = $value;
							}
							break;
					}
				}
			}

			return $option_value;
		}

	} /* End of class WPSEO_Option_InternalLinks */

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_xml
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_XML' ) ) {

	class WPSEO_Option_XML extends WPSEO_Option {

		/**
		 * @var  string  option name
		 */
		public $option_name = 'wpseo_xml';

		/**
		 * @var  string  option group name for use in settings forms
		 */
		public $group_name = 'yoast_wpseo_xml_sitemap_options';

		/**
		 * @var  array  Array of defaults for the option
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 */
		protected $defaults = array(
			'disable_author_sitemap' => true,
			'enablexmlsitemap'       => true,
			'entries-per-page'       => 1000,
			'xml_ping_yahoo'         => false,
			'xml_ping_ask'           => false,

			/**
			 * Uses enrich_defaults to add more along the lines of:
			 * - 'post_types-' . $pt->name . '-not_in_sitemap'  => bool
			 * - 'taxonomies-' . $tax->name . '-not_in_sitemap'  => bool
			 */
		);

		/**
		 * @var  array  Array of variable option name patterns for the option
		 */
		protected $variable_array_key_patterns = array(
			'post_types-',
			'taxonomies-',
		);


		/**
		 * Add the actions and filters for the option
		 *
		 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
		 *       is updated early on and if so, change the call to schedule these for a later action on add/update
		 *       instead of running them straight away
		 *
		 * @return \WPSEO_Option_XML
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
		 * Add dynamically created default options based on available post types and taxonomies
		 *
		 * @return  void
		 */
		public function enrich_defaults() {

			$post_type_names     = get_post_types( array( 'public' => true ), 'names' );
			$filtered_post_types = apply_filters( 'wpseo_sitemaps_supported_post_types', $post_type_names );

			if ( is_array( $filtered_post_types ) && $filtered_post_types !== array() ) {
				foreach ( $filtered_post_types as $pt ) {
					if ( $pt !== 'attachment' ) {
						$this->defaults['post_types-' . $pt . '-not_in_sitemap'] = false;
					} else {
						$this->defaults['post_types-' . $pt . '-not_in_sitemap'] = true;
					}
				}
				unset( $pt );
			}
			unset( $filtered_post_types );


			$taxonomy_objects    = get_taxonomies( array( 'public' => true ), 'objects' );
			$filtered_taxonomies = apply_filters( 'wpseo_sitemaps_supported_taxonomies', $taxonomy_objects );
			if ( is_array( $filtered_taxonomies ) && $filtered_taxonomies !== array() ) {
				foreach ( $filtered_taxonomies as $tax ) {
					if ( isset( $tax->labels->name ) && trim( $tax->labels->name ) != '' ) {
						$this->defaults['taxonomies-' . $tax->name . '-not_in_sitemap'] = false;
					}
				}
				unset( $tax );
			}
			unset( $filtered_taxonomies );
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
				$switch_key = $this->get_switch_key( $key );

				switch ( $switch_key ) {
					/* integer fields */
					case 'entries-per-page':
						/* @todo [JRF/JRF => Yoast] add some more rules (minimum 50 or something
						 * - what should be the guideline?) and adjust error message */
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$int = self::validate_int( $dirty[$key] );
							if ( $int !== false && $int > 0 ) {
								$clean[$key] = $int;
							} else {
								if ( isset( $old[$key] ) && $old[$key] !== '' ) {
									$int = self::validate_int( $old[$key] );
									if ( $int !== false && $int > 0 ) {
										$clean[$key] = $int;
									}
								}
								if ( function_exists( 'add_settings_error' ) ) {
									add_settings_error(
										$this->group_name, // slug title of the setting
										'_' . $key, // suffix-id for the error message box
										sprintf( __( '"Max entries per sitemap page" should be a positive number, which %s is not. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $dirty[$key] ) ) . '</strong>' ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
								}
							}
							unset( $int );
						}
						break;


					/* boolean fields */
					case 'disable_author_sitemap':
					case 'enablexmlsitemap':
					case 'post_types-': /* 'post_types-' . $pt->name . '-not_in_sitemap' fields */
					case 'taxonomies-': /* 'taxonomies-' . $tax->name . '-not_in_sitemap' fields */
					case 'xml_ping_yahoo':
					case 'xml_ping_ask':
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
		protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

			/* Make sure the values of the variable option key options are cleaned as they
		 	   may be retained and would not be cleaned/validated then */
			if ( is_array( $option_value ) && $option_value !== array() ) {

				foreach ( $option_value as $key => $value ) {
					$switch_key = $this->get_switch_key( $key );

					// Similar to validation routine - any changes made there should be made here too
					switch ( $switch_key ) {
						case 'post_types-': /* 'post_types-' . $pt->name . '-not_in_sitemap' fields */
						case 'taxonomies-': /* 'taxonomies-' . $tax->name . '-not_in_sitemap' fields */
							$option_value[$key] = self::validate_bool( $value );
							break;
					}
				}
			}

			return $option_value;
		}


	} /* End of class WPSEO_Option_XML */

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_social
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_Social' ) ) {

	class WPSEO_Option_Social extends WPSEO_Option {

		/**
		 * @var  string  option name
		 */
		public $option_name = 'wpseo_social';

		/**
		 * @var  array  Array of defaults for the option
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 */
		protected $defaults = array(
			// Non-form fields, set via procedural code in admin/pages/social.php
			'fb_admins'          => array(), // array of user id's => array( name => '', link => '' )
			'fbapps'             => array(), // array of linked fb apps id's => fb app display names

			// Non-form field, set via translate_defaults() and validate_option() methods
			'fbconnectkey'       => '',

			// Form fields:
			'facebook_site'      => '', // text field
			'og_default_image'   => '', // text field
			'og_frontpage_desc'  => '', // text field
			'og_frontpage_image' => '', // text field
			'opengraph'          => true,
			'googleplus'         => false,
			'plus-publisher'     => '', // text field
			'twitter'            => false,
			'twitter_site'       => '', // text field
			'twitter_card_type'  => 'summary',

			// Form field, but not always available:
			'fbadminapp'         => 0, // app id from fbapps list
		);

		/**
		 * @var  array  Array of allowed twitter card types
		 *              While we only have the options summary and summary_large_image in the
		 *              interface now, we might change that at some point.
		 *
		 * @internal Uncomment any of these to allow them in validation *and* automatically add them as a choice
		 * in the options page
		 */
		public static $twitter_card_types = array(
			'summary'             => '',
			'summary_large_image' => '',
			//'photo'               => '',
			//'gallery'             => '',
			//'app'                 => '',
			//'player'              => '',
			//'product'             => '',
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
		 * Translate/set strings used in the option defaults
		 *
		 * @return void
		 */
		public function translate_defaults() {
			/* Auto-magically set the fb connect key */
			$this->defaults['fbconnectkey'] = self::get_fbconnectkey();
			
			self::$twitter_card_types['summary']             = __( 'Summary', 'wordpress-seo' );
			self::$twitter_card_types['summary_large_image'] = __( 'Summary with large image', 'wordpress-seo' );
		}


		/**
		 * Get a Facebook connect key for the blog
		 *
		 * @static
		 * @return string
		 */
		public static function get_fbconnectkey() {
			return md5( get_bloginfo( 'url' ) . rand() );
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
				switch ( $key ) {
					/* Automagic Facebook connect key */
					case 'fbconnectkey':
						if ( ( isset( $old[$key] ) && $old[$key] !== '' ) && preg_match( '`^[a-f0-9]{32}$`', $old[$key] ) > 0 ) {
							$clean[$key] = $old[$key];
						} else {
							$clean[$key] = self::get_fbconnectkey();
						}
						break;


					/* Will not always exist in form */
					case 'fb_admins':
						if ( isset( $dirty[$key] ) && is_array( $dirty[$key] ) ) {
							if ( $dirty[$key] === array() ) {
								$clean[$key] = array();
							} else {
								foreach ( $dirty[$key] as $user_id => $fb_array ) {
									/* @todo [JRF/JRF => Yoast/whomever] add user_id validation -
									 * are these WP user-ids or FB user-ids ? Probably FB user-ids,
									 * if so, find out the rules for FB user-ids
									 */
									if ( is_array( $fb_array ) && $fb_array !== array() ) {
										foreach ( $fb_array as $fb_key => $fb_value ) {
											switch ( $fb_key ) {
												case 'name':
													/* @todo [JRF => whomever] add validation for name based
													 * on rules if there are any
													 * Input comes from: $_GET['userrealname'] */
													$clean[$key][$user_id][$fb_key] = sanitize_text_field( $fb_value );
													break;

												case 'link':
													$clean[$key][$user_id][$fb_key] = self::sanitize_url( $fb_value );
													break;
											}
										}
									}
								}
								unset( $user_id, $fb_array, $fb_key, $fb_value );
							}
						} elseif ( isset( $old[$key] ) && is_array( $old[$key] ) ) {
							$clean[$key] = $old[$key];
						}
						break;


					/* Will not always exist in form */
					case 'fbapps':
						if ( isset( $dirty[$key] ) && is_array( $dirty[$key] ) ) {
							if ( $dirty[$key] === array() ) {
								$clean[$key] = array();
							} else {
								$clean[$key] = array();
								foreach ( $dirty[$key] as $app_id => $display_name ) {
									$int = self::validate_int( $app_id );
									if ( $int !== false && $int > 0 ) {
										$clean[$key][$app_id] = sanitize_text_field( $display_name );
									}
								}
								unset( $app_id, $display_name, $int );
							}
						} elseif ( isset( $old[$key] ) && is_array( $old[$key] ) ) {
							$clean[$key] = $old[$key];
						}
						break;


					/* text fields */
					case 'og_frontpage_desc':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$clean[$key] = self::sanitize_text_field( $dirty[$key] );
						}
						break;


					/* url text fields - ftp allowed */
					case 'og_default_image':
					case 'og_frontpage_image':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$url = self::sanitize_url( $dirty[$key], array( 'http', 'https', 'ftp', 'ftps' ) );
							if ( $url !== '' ) {
								$clean[$key] = $url;
							} else {
								if ( isset( $old[$key] ) && $old[$key] !== '' ) {
									$url = self::sanitize_url( $old[$key], array( 'http', 'https', 'ftp', 'ftps' ) );
									if ( $url !== '' ) {
										$clean[$key] = $url;
									}
								}
								if ( function_exists( 'add_settings_error' ) ) {
									$url = self::sanitize_url( $dirty[$key], array( 'http', 'https', 'ftp', 'ftps' ) );
									add_settings_error(
										$this->group_name, // slug title of the setting
										'_' . $key, // suffix-id for the error message box
										sprintf( __( '%s does not seem to be a valid url. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( $url ) . '</strong>' ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
								}
							}
							unset( $url );
						}
						break;


					/* url text fields - no ftp allowed */
					case 'facebook_site':
					case 'plus-publisher':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$url = self::sanitize_url( $dirty[$key] );
							if ( $url !== '' ) {
								$clean[$key] = $url;
							} else {
								if ( isset( $old[$key] ) && $old[$key] !== '' ) {
									$url = self::sanitize_url( $old[$key] );
									if ( $url !== '' ) {
										$clean[$key] = $url;
									}
								}
								if ( function_exists( 'add_settings_error' ) ) {
									$url = self::sanitize_url( $dirty[$key] );
									add_settings_error(
										$this->group_name, // slug title of the setting
										'_' . $key, // suffix-id for the error message box
										sprintf( __( '%s does not seem to be a valid url. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( $url ) . '</strong>' ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
								}
							}
							unset( $url );
						}
						break;


					/* twitter user name */
					case 'twitter_site':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$twitter_id = sanitize_text_field( ltrim( $dirty[$key], '@' ) );
							/**
							 * From the Twitter documentation about twitter screen names:
							 * Typically a maximum of 15 characters long, but some historical accounts
							 * may exist with longer names.
							 */
							if ( preg_match( '`^[A-Za-z0-9_]{1,25}$`', $twitter_id ) ) {
								$clean[$key] = $twitter_id;
							} else {
								if ( isset( $old[$key] ) && $old[$key] !== '' ) {
									$twitter_id = sanitize_text_field( ltrim( $old[$key], '@' ) );
									if ( preg_match( '`^[A-Za-z0-9_]{1,25}$`', $twitter_id ) ) {
										$clean[$key] = $twitter_id;
									}
								}
								if ( function_exists( 'add_settings_error' ) ) {
									add_settings_error(
										$this->group_name, // slug title of the setting
										'_' . $key, // suffix-id for the error message box
										sprintf( __( '%s does not seem to be a valid Twitter user-id. Please correct.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $dirty[$key] ) ) . '</strong>' ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
								}
							}
							unset( $twitter_id );
						}
						break;

					case 'twitter_card_type':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' && isset( self::$twitter_card_types[$dirty[$key]] ) ) {
							$clean[$key] = $dirty[$key];
						}
						break;

					/* boolean fields */
					case 'googleplus':
					case 'opengraph':
					case 'twitter':
						$clean[$key] = ( isset( $dirty[$key] ) ? self::validate_bool( $dirty[$key] ) : false );
						break;
				}
			}

			/**
			 * Only validate 'fbadminapp' once we are sure that 'fbapps' has been validated already.
			 * Will not always exist in form - if not available it means that fbapps is empty,
			 * so leave the clean default.
			 */
			if ( ( isset( $dirty['fbadminapp'] ) && $dirty['fbadminapp'] != 0 ) && isset( $clean['fbapps'][$dirty['fbadminapp']] ) ) {
				$clean['fbadminapp'] = $dirty['fbadminapp'];
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
		protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

			/* Move options from very old option to this one */
			$old_option = null;
			if ( isset( $all_old_option_values ) ) {
				// Ok, we have an import
				if ( isset( $all_old_option_values['wpseo_indexation'] ) && is_array( $all_old_option_values['wpseo_indexation'] ) && $all_old_option_values['wpseo_indexation'] !== array() ) {
					$old_option = $all_old_option_values['wpseo_indexation'];
				}
			} else {
				$old_option = get_option( 'wpseo_indexation' );
			}

			if ( is_array( $old_option ) && $old_option !== array() ) {
				$move = array(
					'opengraph',
					'fb_adminid',
					'fb_appid',
				);
				foreach ( $move as $key ) {
					if ( isset( $old_option[$key] ) && ! isset( $option_value[$key] ) ) {
						$option_value[$key] = $old_option[$key];
					}
				}
				unset( $move, $key );
			}
			unset( $old_option );


			/* Clean some values which may not always be in form and may otherwise not be cleaned/validated */
			if ( isset( $option_value['fbapps'] ) && ( is_array( $option_value['fbapps'] ) && $option_value['fbapps'] !== array() ) ) {
				$fbapps = array();
				foreach ( $option_value['fbapps'] as $app_id => $display_name ) {
					$int = self::validate_int( $app_id );
					if ( $int !== false && $int > 0 ) {
						$fbapps[$app_id] = sanitize_text_field( $display_name );
					}
				}
				unset( $app_id, $display_name, $int );

				$option_value['fbapps'] = $fbapps;
			}

			return $option_value;
		}


	} /* End of class WPSEO_Option_Social */

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_ms
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Option_MS' ) ) {

	class WPSEO_Option_MS extends WPSEO_Option {

		/**
		 * @var  string  option name
		 */
		public $option_name = 'wpseo_ms';

		/**
		 * @var  string  option group name for use in settings forms
		 */
		public $group_name = 'yoast_wpseo_multisite_options';

		/**
		 * @var  bool  whether to include the option in the return for WPSEO_Options::get_all()
		 */
		public $include_in_all = false;

		/**
		 * @var  bool  whether this option is only for when the install is multisite
		 */
		public $multisite_only = true;

		/**
		 * @var  array  Array of defaults for the option
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 */
		protected $defaults = array(
			'access'      => 'admin',
			'defaultblog' => '', //numeric blog id or empty
		);

		/**
		 * @static
		 * @var  array $allowed_access_options Available options for the 'access' setting
		 *                    Used for input validation
		 *
		 * @internal Important: Make sure the options added to the array here are in line with the keys
		 * for the options set for the select box in the admin/pages/network.php file
		 */
		public static $allowed_access_options = array(
			'admin',
			'superadmin',
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
		 * Register (whitelist) the option for the configuration pages.
		 * The validation callback is already registered separately on the sanitize_option hook,
		 * so no need to double register.
		 *
		 * @todo [JRF] if the extra bit below is no longer needed, move the if combined with a check
		 * for $this->multisite_only to the abstract class
		 *
		 * @return void
		 */
		public function register_setting() {
			if ( ( function_exists( 'is_multisite' ) && is_multisite() ) && WPSEO_Options::grant_access() ) {
				register_setting( $this->group_name, $this->option_name );
			}
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
				switch ( $key ) {
					case 'access':
						if ( isset( $dirty[$key] ) && in_array( $dirty[$key], self::$allowed_access_options, true ) ) {
							$clean[$key] = $dirty[$key];
						} elseif ( function_exists( 'add_settings_error' ) ) {
							add_settings_error(
								$this->group_name, // slug title of the setting
								'_' . $key, // suffix-id for the error message box
								sprintf( __( '%s is not a valid choice for who should be allowed access to the WP SEO settings. Value reset to the default.', 'wordpress-seo' ), esc_html( sanitize_text_field( $dirty[$key] ) ) ), // the error message
								'error' // error type, either 'error' or 'updated'
							);
						}
						break;


					case 'defaultblog':
						if ( isset( $dirty[$key] ) && $dirty[$key] !== '' ) {
							$int = self::validate_int( $dirty[$key] );
							if ( $int !== false && $int > 0 ) {
								// Check if a valid blog number has been received
								$exists = get_blog_details( $int, false );
								if ( $exists && $exists->deleted == 0 ) {
									$clean[$key] = $int;
								} elseif ( function_exists( 'add_settings_error' ) ) {
									add_settings_error(
										$this->group_name, // slug title of the setting
											'_' . $key, // suffix-id for the error message box
											__( 'The default blog setting must be the numeric blog id of the blog you want to use as default.', 'wordpress-seo' ) . '<br>' . sprintf( __( 'This must be an existing blog. Blog %s does not exist or has been marked as deleted.', 'wordpress-seo' ), '<strong>' . esc_html( sanitize_text_field( $dirty[$key] ) ) . '</strong>' ), // the error message
										'error' // error type, either 'error' or 'updated'
									);
								}
								unset( $exists );
							} elseif ( function_exists( 'add_settings_error' ) ) {
								add_settings_error(
									$this->group_name, // slug title of the setting
										'_' . $key, // suffix-id for the error message box
										__( 'The default blog setting must be the numeric blog id of the blog you want to use as default.', 'wordpress-seo' ) . '<br>' . __( 'No numeric value was received.', 'wordpress-seo' ), // the error message
									'error' // error type, either 'error' or 'updated'
								);
							}
							unset( $int );
						}
						break;

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


	} /* End of class WPSEO_Option_MS */

} /* End of class-exists wrapper */


/*******************************************************************
 * Option: wpseo_taxonomy_meta
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Taxonomy_Meta' ) ) {

	class WPSEO_Taxonomy_Meta extends WPSEO_Option {

		/**
		 * @var  string  option name
		 */
		public $option_name = 'wpseo_taxonomy_meta';

		/**
		 * @var  bool  whether to include the option in the return for WPSEO_Options::get_all()
		 */
		public $include_in_all = false;

		/**
		 * @var  array  Array of defaults for the option
		 *        Shouldn't be requested directly, use $this->get_defaults();
		 * @internal  Important: in contrast to most defaults, the below array format is
		 *        very bare. The real option is in the format [taxonomy_name][term_id][...]
		 *        where [...] is any of the $defaults_per_term options shown below.
		 *        This is of course taken into account in the below methods.
		 */
		protected $defaults = array();


		/**
		 * @static
		 * @var  string  Option name - same as $option_name property, but now also available to static
		 * methods
		 */
		public static $name;

		/**
		 * @static
		 * @var  array  Array of defaults for individual taxonomy meta entries
		 */
		public static $defaults_per_term = array(
			'wpseo_title'           => '',
			'wpseo_desc'            => '',
			'wpseo_metakey'         => '',
			'wpseo_canonical'       => '',
			'wpseo_bctitle'         => '',
			'wpseo_noindex'         => 'default',
			'wpseo_sitemap_include' => '-',
		);

		/**
		 * @static
		 * @var  array  Available index options
		 *        Used for form generation and input validation
		 * @internal  Labels (translation) added on admin_init via WPSEO_Taxonomy::translate_meta_options()
		 */
		public static $no_index_options = array(
			'default' => '',
			'index'   => '',
			'noindex' => '',
		);

		/**
		 * @static
		 * @var  array  Available sitemap include options
		 *        Used for form generation and input validation
		 * @internal  Labels (translation) added on admin_init via WPSEO_Taxonomy::translate_meta_options()
		 */
		public static $sitemap_include_options = array(
			'-'      => '',
			'always' => '',
			'never'  => '',
		);


		/**
		 * Add the actions and filters for the option
		 *
		 * @todo [JRF => testers] Check if the extra actions below would run into problems if an option
		 * is updated early on and if so, change the call to schedule these for a later action on add/update
		 * instead of running them straight away
		 *
		 * @return \WPSEO_Taxonomy_Meta
		 */
		protected function __construct() {
			parent::__construct();

			/* On succesfull update/add of the option, flush the W3TC cache */
			add_action( 'add_option_' . $this->option_name, array( 'WPSEO_Options', 'flush_W3TC_cache' ) );
			add_action( 'update_option_' . $this->option_name, array( 'WPSEO_Options', 'flush_W3TC_cache' ) );
		}


		/**
		 * Get the singleton instance of this class
		 *
		 * @return object
		 */
		public static function get_instance() {
			if ( ! ( self::$instance instanceof self ) ) {
				self::$instance = new self();
				self::$name     = self::$instance->option_name;
			}

			return self::$instance;
		}


		public function enrich_defaults() {
			$extra_defaults_per_term = apply_filters( 'wpseo_add_extra_taxmeta_term_defaults', array() );
			if ( is_array( $extra_defaults_per_term ) ) {
				self::$defaults_per_term = array_merge( $extra_defaults_per_term, self::$defaults_per_term );
			}
		}


		/**
		 * Helper method - Combines a fixed array of default values with an options array
		 * while filtering out any keys which are not in the defaults array.
		 *
		 * @static
		 *
		 * @param  string $option_key Option name of the option we're doing the merge for
		 * @param  array  $options    (Optional) Current options
		 *                            - if not set, the option defaults for the $option_key will be returned.
		 *
		 * @return  array  Combined and filtered options array.
		 */
		/*public function array_filter_merge( $option_key, $options = null ) {

			$defaults = $this->get_defaults( $option_key );

			if ( ! isset( $options ) || $options === false ) {
				return $defaults;
			}

			/*
			@internal Adding the defaults to all taxonomy terms each time the option is retrieved
			will be quite inefficient if there are a lot of taxonomy terms
			As long as taxonomy_meta is only retrieved via methods in this class, we shouldn't need this

			$options  = (array) $options;
			$filtered = array();

			if ( $options !== array() ) {
				foreach ( $options as $taxonomy => $terms ) {
					if ( is_array( $terms ) && $terms !== array() ) {
						foreach ( $terms as $id => $term_meta ) {
							foreach ( self::$defaults_per_term as $name => $default ) {
								if ( isset( $options[$taxonomy][$id][$name] ) ) {
									$filtered[$taxonomy][$id][$name] = $options[$taxonomy][$id][$name];
								}
								else {
									$filtered[$name] = $default;
								}
							}
						}
					}
				}
				unset( $taxonomy, $terms, $id, $term_meta, $name, $default );
			}
			// end of may be remove

			return $filtered;
			* /

			return (array) $options;
		}*/


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

			/* Prevent complete validation (which can be expensive when there are lots of terms)
			   if only one item has changed and has already been validated */
			if ( isset( $dirty['wpseo_already_validated'] ) && $dirty['wpseo_already_validated'] === true ) {
				unset( $dirty['wpseo_already_validated'] );

				return $dirty;
			}


			foreach ( $dirty as $taxonomy => $terms ) {
				/* Don't validate taxonomy - may not be registered yet and we don't want to remove valid ones */
				if ( is_array( $terms ) && $terms !== array() ) {
					foreach ( $terms as $term_id => $meta_data ) {
						/* Only validate term if the taxonomy exists */
						if ( taxonomy_exists( $taxonomy ) && get_term_by( 'id', $term_id, $taxonomy ) === false ) {
							/* Is this term id a special case ? */
							if ( has_filter( 'wpseo_tax_meta_special_term_id_validation_' . $term_id ) !== false ) {
								$clean[$taxonomy][$term_id] = apply_filters( 'wpseo_tax_meta_special_term_id_validation_' . $term_id, $meta_data, $taxonomy, $term_id );
							}
							continue;
						}

						if ( is_array( $meta_data ) && $meta_data !== array() ) {
							/* Validate meta data */
							$old_meta  = self::get_term_meta( $term_id, $taxonomy );
							$meta_data = self::validate_term_meta_data( $meta_data, $old_meta );
							if ( $meta_data !== array() ) {
								$clean[$taxonomy][$term_id] = $meta_data;
							}
						}

						// Deal with special cases (for when taxonomy doesn't exist yet)
						if ( ! isset( $clean[$taxonomy][$term_id] ) && has_filter( 'wpseo_tax_meta_special_term_id_validation_' . $term_id ) !== false ) {
							$clean[$taxonomy][$term_id] = apply_filters( 'wpseo_tax_meta_special_term_id_validation_' . $term_id, $meta_data, $taxonomy, $term_id );
						}
					}
				}
			}

			return $clean;
		}


		/**
		 * Validate the meta data for one individual term and removes default values (no need to save those)
		 *
		 * @static
		 *
		 * @param  array $meta_data New values
		 * @param  array $old_meta  The original values
		 *
		 * @return  array        Validated and filtered value
		 */
		public static function validate_term_meta_data( $meta_data, $old_meta ) {

			$clean     = self::$defaults_per_term;
			$meta_data = array_map( array( __CLASS__, 'trim_recursive' ), $meta_data );

			if ( ! is_array( $meta_data ) || $meta_data === array() ) {
				return $clean;
			}

			foreach ( $clean as $key => $value ) {
				switch ( $key ) {

					case 'wpseo_noindex':
						if ( isset( $meta_data[$key] ) ) {
							if ( isset( self::$no_index_options[$meta_data[$key]] ) ) {
								$clean[$key] = $meta_data[$key];
							}
						} elseif ( isset( $old_meta[$key] ) ) {
							// Retain old value if field currently not in use
							$clean[$key] = $old_meta[$key];
						}
						break;

					case 'wpseo_sitemap_include':
						if ( isset( $meta_data[$key] ) && isset( self::$sitemap_include_options[$meta_data[$key]] ) ) {
							$clean[$key] = $meta_data[$key];
						}
						break;

					case 'wpseo_canonical':
						if ( isset( $meta_data[$key] ) && $meta_data[$key] !== '' ) {
							$url = self::sanitize_url( $meta_data[$key] );
							if ( $url !== '' ) {
								$clean[$key] = $url;
							}
						}
						break;

					case 'wpseo_metakey':
					case 'wpseo_bctitle':
						if ( isset( $meta_data[$key] ) ) {
							$clean[$key] = self::sanitize_text_field( $meta_data[$key] );
						} elseif ( isset( $old_meta[$key] ) ) {
							// Retain old value if field currently not in use
							$clean[$key] = $old_meta[$key];
						}
						break;

					case 'wpseo_title':
					case 'wpseo_desc':
					default:
						if ( isset( $meta_data[$key] ) && is_string( $meta_data[$key] ) ) {
							$clean[$key] = self::sanitize_text_field( $meta_data[$key] );
						}
						break;
				}

				$clean[$key] = apply_filters( 'wpseo_sanitize_tax_meta_' . $key, $clean[$key], ( isset( $meta_data[$key] ) ? $meta_data[$key] : null ), ( isset( $old_meta[$key] ) ? $old_meta[$key] : null ) );
			}

			// Only save the non-default values
			return array_diff_assoc( $clean, self::$defaults_per_term );
		}


		/**
		 * Clean a given option value
		 * - Convert old option values to new
		 * - Fixes strings which were escaped (should have been sanitized - escaping is for output)
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
		protected function clean_option( $option_value, $current_version = null, $all_old_option_values = null ) {

			/* Clean up old values and remove empty arrays */
			if ( is_array( $option_value ) && $option_value !== array() ) {

				foreach ( $option_value as $taxonomy => $terms ) {

					if ( is_array( $terms ) && $terms !== array() ) {

						foreach ( $terms as $term_id => $meta_data ) {
							if ( ! is_array( $meta_data ) || $meta_data === array() ) {
								// Remove empty term arrays
								unset( $option_value[$taxonomy][$term_id] );
							} else {
								foreach ( $meta_data as $key => $value ) {

									switch ( $key ) {
										case 'noindex':
											if ( $value === 'on' ) {
												// Convert 'on' to 'noindex'
												$option_value[$taxonomy][$term_id][$key] = 'noindex';
											}
											break;

										case 'canonical':
											// @todo [JRF => whomever] needs checking, I don't have example data [JRF]
											if ( $value !== '' ) {
												// Fix incorrectly saved (encoded) canonical urls
												$option_value[$taxonomy][$term_id][$key] = wp_specialchars_decode( stripslashes( $value ) );
											}
											break;

										default:
											// @todo [JRF => whomever] needs checking, I don't have example data [JRF]
											if ( $value !== '' ) {
												// Fix incorrectly saved (escaped) text strings
												$option_value[$taxonomy][$term_id][$key] = wp_specialchars_decode( $value, ENT_QUOTES );
											}
											break;
									}
								}
							}
						}
					} else {
						// Remove empty taxonomy arrays
						unset( $option_value[$taxonomy] );
					}
				}
			}

			return $option_value;
		}


		/**
		 * Retrieve a taxonomy term's meta value(s).
		 *
		 * @static
		 *
		 * @param  mixed  $term     Term to get the meta value for
		 *                          either (string) term name, (int) term id or (object) term
		 * @param  string $taxonomy Name of the taxonomy to which the term is attached
		 * @param  string $meta     (optional) Meta value to get (without prefix)
		 *
		 * @return  mixed|bool    Value for the $meta if one is given, might be the default
		 *              If no meta is given, an array of all the meta data for the term
		 *              False if the term does not exist or the $meta provided is invalid
		 */
		public static function get_term_meta( $term, $taxonomy, $meta = null ) {
			/* Figure out the term id */
			if ( is_int( $term ) ) {
				$term = get_term_by( 'id', $term, $taxonomy );
			} elseif ( is_string( $term ) ) {
				$term = get_term_by( 'slug', $term, $taxonomy );
			}

			if ( is_object( $term ) && isset( $term->term_id ) ) {
				$term_id = $term->term_id;
			} else {
				return false;
			}


			$tax_meta = get_option( self::$name );

			/* If we have data for the term, merge with defaults for complete array, otherwise set defaults */
			if ( isset( $tax_meta[$taxonomy][$term_id] ) ) {
				$tax_meta = array_merge( self::$defaults_per_term, $tax_meta[$taxonomy][$term_id] );
			} else {
				$tax_meta = self::$defaults_per_term;
			}

			/* Either return the complete array or a single value from it or false if the value does not exist
			   (shouldn't happen after merge with defaults, indicates typo in request) */
			if ( ! isset( $meta ) ) {
				return $tax_meta;
			} else {
				if ( isset( $tax_meta['wpseo_' . $meta] ) ) {
					return $tax_meta['wpseo_' . $meta];
				} else {
					return false;
				}
			}
		}

	} /* End of class WPSEO_Taxonomy_Meta */

} /* End of class-exists wrapper */


/*******************************************************************
 * Overall Option Management
 *******************************************************************/
if ( ! class_exists( 'WPSEO_Options' ) ) {
	/**
	 * Overal Option Management class
	 *
	 * Instantiates all the options and offers a number of utility methods to work with the options
	 */
	class WPSEO_Options {


		/**
		 * @static
		 * @var  array  Options this class uses
		 *        Array format:  (string) option_name  => (string) name of concrete class for the option
		 */
		public static $options = array(
			'wpseo'               => 'WPSEO_Option_Wpseo',
			'wpseo_permalinks'    => 'WPSEO_Option_Permalinks',
			'wpseo_titles'        => 'WPSEO_Option_Titles',
			'wpseo_social'        => 'WPSEO_Option_Social',
			'wpseo_rss'           => 'WPSEO_Option_RSS',
			'wpseo_internallinks' => 'WPSEO_Option_InternalLinks',
			'wpseo_xml'           => 'WPSEO_Option_XML',
			'wpseo_ms'            => 'WPSEO_Option_MS',
			'wpseo_taxonomy_meta' => 'WPSEO_Taxonomy_Meta',
		);

		protected static $option_instances;

		/**
		 * @var  object  Instance of this class
		 */
		protected static $instance;


		/**
		 * Instantiate all the WPSEO option management classes
		 */
		protected function __construct() {
			foreach ( self::$options as $option_name => $option_class ) {
				self::$option_instances[$option_name] = call_user_func( array( $option_class, 'get_instance' ) );
			}
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
		 * Check whether the current user is allowed to access the configuration.
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this should maybe
		 * be moved to a general WPSEO_Utils class. Obviously all calls to this method should be
		 * adjusted in that case.
		 *
		 * @return boolean
		 */
		public static function grant_access() {
			if ( ! function_exists( 'is_multisite' ) || ! is_multisite() ) {
				return true;
			}

			$options = get_site_option( 'wpseo_ms' );
			if ( $options['access'] === 'admin' && current_user_can( 'manage_options' ) ) {
				return true;
			}

			if ( $options['access'] === 'superadmin' && ! is_super_admin() ) {
				return false;
			}

			return true;
		}


		/**
		 * Get the group name of an option for use in the settings form
		 *
		 * @param  string $option_name the option for which you want to retrieve the option group name
		 *
		 * @return  string|bool
		 */
		public static function get_group_name( $option_name ) {
			if ( isset( self::$option_instances[$option_name] ) ) {
				return self::$option_instances[$option_name]->group_name;
			}

			return false;
		}


		/**
		 * Get a specific default value for an option
		 *
		 * @param  string $option_name The option for which you want to retrieve a default
		 * @param  string $key         The key within the option who's default you want
		 *
		 * @return  mixed
		 */
		public static function get_default( $option_name, $key ) {
			if ( isset( self::$option_instances[$option_name] ) ) {
				$defaults = self::$option_instances[$option_name]->get_defaults();
				if ( isset( $defaults[$key] ) ) {
					return $defaults[$key];
				}
			}

			return null;
		}

		/**
		 * Get the instantiated option instance
		 *
		 * @param  string $option_name The option for which you want to retrieve the instance
		 *
		 * @return  object|bool
		 */
		public static function get_option_instance( $option_name ) {
			if ( isset( self::$option_instances[$option_name] ) ) {
				return self::$option_instances[$option_name];
			}

			return false;
		}


		/**
		 * Retrieve an array of the options which should be included in get_all() and reset().
		 *
		 * @static
		 * @return  array  Array of option names
		 */
		public static function get_option_names() {
			static $option_names = array();

			if ( $option_names === array() ) {
				foreach ( self::$option_instances as $option_name => $option_object ) {
					if ( $option_object->include_in_all === true ) {
						$option_names[] = $option_name;
					}
				}
				$option_names = apply_filters( 'wpseo_options', $option_names );
			}

			return $option_names;
		}


		/**
		 * Retrieve all the options for the SEO plugin in one go.
		 *
		 * @todo [JRF] see if we can get some extra efficiency for this one, though probably not as options may
		 * well change between calls (enriched defaults and such)
		 *
		 * @static
		 * @return  array  Array combining the values of (nearly) all the options
		 */
		public static function get_all() {
			$all_options  = array();
			$option_names = self::get_option_names();

			if ( is_array( $option_names ) && $option_names !== array() ) {
				foreach ( $option_names as $option_name ) {
					$option = get_option( $option_name );
					if ( is_array( $option ) && $option !== array() ) {
						$all_options = array_merge( $all_options, $option );
					}
				}
			}

			return $all_options;
		}


		/**
		 * Run the clean up routine for one or all options
		 *
		 * @param  array|string $option_name     (optional) the option you want to clean or an array of
		 *                                       option names for the options you want to clean.
		 *                                       If not set, all options will be cleaned
		 * @param  string       $current_version (optional) Version from which to upgrade, if not set,
		 *                                       version specific upgrades will be disregarded
		 *
		 * @return  void
		 */
		public static function clean_up( $option_name = null, $current_version = null ) {
			if ( isset( $option_name ) && is_string( $option_name ) && $option_name !== '' ) {
				if ( isset( self::$option_instances[$option_name] ) ) {
					self::$option_instances[$option_name]->clean( $current_version );
				}
			} elseif ( isset( $option_name ) && is_array( $option_name ) && $option_name !== array() ) {
				foreach ( $option_name as $option ) {
					if ( isset( self::$option_instances[$option] ) ) {
						self::$option_instances[$option]->clean( $current_version );
					}
				}
			} else {
				foreach ( self::$option_instances as $instance ) {
					$instance->clean( $current_version );
				}

				// If we've done a full clean-up, we can safely remove this really old option
				delete_option( 'wpseo_indexation' );
			}
		}


		/**
		 * Initialize some options on first install/activate/reset
		 *
		 * @static
		 * @return void
		 */
		public static function initialize() {
			/* Make sure title_test and description_test function are available even when called
			   from the isolated activation */
			require_once( WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php' );

			wpseo_title_test();
			wpseo_description_test();

			/* Force WooThemes to use WordPress SEO data. */
			if ( function_exists( 'woo_version_init' ) ) {
				update_option( 'seo_woo_use_third_party_data', 'true' );
			}
		}


		/**
		 * Reset all options to their default values and rerun some tests
		 *
		 * @static
		 * @return void
		 *
		 * @todo [JRF => Yoast] add check for multisite and only add multisite option if applicable ?
		 * - currently will not add it (=old behaviour)
		 * @todo [JRF => Yoast] may be check for default blog option if multisite and restore based on
		 * that if available ?
		 */
		public static function reset() {
			$option_names = self::get_option_names();
			if ( is_array( $option_names ) && $option_names !== array() ) {
				foreach ( $option_names as $option_name ) {
					delete_option( $option_name );
					update_option( $option_name, get_option( $option_name ) );
				}
			}

			self::initialize();
		}


		/**
		 * Initialize default values for a new multisite blog
		 *
		 * @todo [JRF => testers] Double check that this works as it should, in the old situation,
		 * the call to initialize (title/description test) was not made
		 *
		 * @static
		 * @return void
		 */
		public static function set_multisite_defaults() {
			$option = get_option( 'wpseo' );

			if ( function_exists( 'is_multisite' ) && is_multisite() && $option['ms_defaults_set'] === false ) {
				$current_site = get_current_site();
				self::reset_ms_blog( $current_site->id );

				$option                    = get_option( 'wpseo' ); // Renew option after reset
				$option['ms_defaults_set'] = true;
				update_option( 'wpseo', $option );

				self::initialize();
			}
		}


		/**
		 * Reset all options for a specific multisite blog to their default values based upon a
		 * specified default blog if one was chosen on the network page or the plugin defaults if it was not
		 *
		 * @todo [JRF => testers] Double check that this works as it should
		 *
		 * @static
		 *
		 * @param  int|string $blog_id Blog id of the blog for which to reset the options
		 *
		 * @return  void
		 */
		public static function reset_ms_blog( $blog_id ) {
			$options      = get_site_option( 'wpseo_ms' );
			$option_names = self::get_option_names();
			// All of these settings shouldn't be copied so easily
			// @todo [JRF => Yoast] Would it be an idea to move and split this to be a class property of each option class, so as to keep the information contained in the most logical place ?
			// Let me know and I'll implement.
			$exclude      = array(
				'ignore_blog_public_warning',
				'ignore_meta_description_warning',
				'ignore_page_comments',
				'ignore_permalink',
				'ignore_tour',
				'theme_description_found',
				'theme_has_description',
				'alexaverify',
				'googleverify',
				'msverify',
				'pinterestverify',
				'yandexverify',
				'fb_admins',
				'fbapps',
				'fbconnectkey',
				'fbadminapp',
			);

			if ( is_array( $option_names ) && $option_names !== array() ) {
				$base_blog_id = $blog_id;
				if ( $options['defaultblog'] !== '' && $options['defaultblog'] != 0 ) {
					$base_blog_id = $options['defaultblog'];
				}
				foreach ( $option_names as $option_name ) {
					delete_blog_option( $blog_id, $option_name );

					$new_option = get_blog_option( $base_blog_id, $option_name );
					foreach ( $exclude as $key ) {
						unset( $new_option[$key] );
					}
					update_blog_option( $blog_id, $option_name, $new_option );
				}
			}
		}


		/* ************** METHODS FOR ACTIONS TO TAKE ON CERTAIN OPTION UPDATES ****************/

		/**
		 * (Un-)schedule the yoast tracking cronjob if the tracking option has changed
		 *
		 * @internal Better to be done here, rather than in the Yoast_Tracking class as
		 * class-tracking.php may not be loaded and might not need to be (lean loading).
		 *
		 * @todo     [JRF => whomever] when someone would reorganize the classes, this should maybe
		 * be moved to a general WPSEO_Utils class. Obviously all calls to this method should be
		 * adjusted in that case.
		 *
		 * @todo     - [JRF => Yoast] check if this has any impact on other Yoast plugins which may
		 * use the same tracking schedule hook. If so, maybe get any other yoast plugin options,
		 * check for the tracking status and unschedule based on the combined status.
		 *
		 * @static
		 *
		 * @param  mixed $disregard        Not needed - passed by add/update_option action call
		 *                                 Option name if option was added, old value if option was updated
		 * @param  array $value            The (new/current) value of the wpseo option
		 * @param  bool  $force_unschedule Whether to force an unschedule (i.e. on deactivate)
		 *
		 * @return  void
		 */
		public static function schedule_yoast_tracking( $disregard, $value, $force_unschedule = false ) {
			$current_schedule = wp_next_scheduled( 'yoast_tracking' );

			if ( $force_unschedule !== true && ( $value['yoast_tracking'] === true && $current_schedule === false ) ) {
				// The tracking checks daily, but only sends new data every 7 days.
				wp_schedule_event( time(), 'daily', 'yoast_tracking' );
			} elseif ( $force_unschedule === true || ( $value['yoast_tracking'] === false && $current_schedule !== false ) ) {
				wp_clear_scheduled_hook( 'yoast_tracking' );
			}
		}


		/**
		 * Clears the WP or W3TC cache depending on which is used
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this should maybe
		 * be moved to a general WPSEO_Utils class. Obviously all calls to this method should be
		 * adjusted in that case.
		 *
		 * @static
		 * @return void
		 */
		public static function clear_cache() {
			if ( function_exists( 'w3tc_pgcache_flush' ) ) {
				w3tc_pgcache_flush();
			} elseif ( function_exists( 'wp_cache_clear_cache' ) ) {
				wp_cache_clear_cache();
			}
		}


		/**
		 * Flush W3TC cache after succesfull update/add of taxonomy meta option
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this should maybe
		 * be moved to a general WPSEO_Utils class. Obviously all calls to this method should be
		 * adjusted in that case.
		 *
		 * @todo [JRF => whomever] check the above and this function to see if they should be combined or really
		 * do something significantly different
		 *
		 * @static
		 * @return  void
		 */
		public static function flush_W3TC_cache() {
			if ( defined( 'W3TC_DIR' ) && function_exists( 'w3tc_objectcache_flush' ) ) {
				w3tc_objectcache_flush();
			}
		}


		/**
		 * Clear rewrite rules
		 *
		 * @todo [JRF => whomever] when someone would reorganize the classes, this should maybe
		 * be moved to a general WPSEO_Utils class. Obviously all calls to this method should be
		 * adjusted in that case.
		 *
		 * @static
		 * @return void
		 */
		public static function clear_rewrites() {
			delete_option( 'rewrite_rules' );
		}


	} /* End of class WPSEO_Options */

} /* End of class-exists wrapper */
