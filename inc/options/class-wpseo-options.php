<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

/**
 * Overal Option Management class.
 *
 * Instantiates all the options and offers a number of utility methods to work with the options.
 */
class WPSEO_Options {
	/**
	 * @var  array  Options this class uses.
	 *              Array format:  (string) option_name  => (string) name of concrete class for the option
	 * @static
	 */
	public static $options = array(
		'wpseo'               => 'WPSEO_Option_Wpseo',
		'wpseo_titles'        => 'WPSEO_Option_Titles',
		'wpseo_social'        => 'WPSEO_Option_Social',
		'wpseo_ms'            => 'WPSEO_Option_MS',
		'wpseo_taxonomy_meta' => 'WPSEO_Taxonomy_Meta',
	);
	/**
	 * @var  array   Array of instantiated option objects.
	 */
	protected static $option_instances = array();
	/**
	 * @var  object  Instance of this class.
	 */
	protected static $instance;

	/** @var WPSEO_Options_Backfill Backfill instance. */
	protected static $backfill;

	/**
	 * Instantiate all the WPSEO option management classes.
	 */
	protected function __construct() {
		// Backfill option values after transferring them to another base.
		self::$backfill = new WPSEO_Options_Backfill();
		self::$backfill->register_hooks();

		$is_multisite = is_multisite();

		foreach ( self::$options as $option_name => $option_class ) {
			$instance = call_user_func( array( $option_class, 'get_instance' ) );

			if ( ! $instance->multisite_only || $is_multisite ) {
				self::$option_instances[ $option_name ] = $instance;
			}
			else {
				unset( self::$options[ $option_name ] );
			}
		}
	}

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
	 * Get the group name of an option for use in the settings form.
	 *
	 * @param  string $option_name The option for which you want to retrieve the option group name.
	 *
	 * @return  string|bool
	 */
	public static function get_group_name( $option_name ) {
		if ( isset( self::$option_instances[ $option_name ] ) ) {
			return self::$option_instances[ $option_name ]->group_name;
		}

		return false;
	}

	/**
	 * Get a specific default value for an option.
	 *
	 * @param  string $option_name The option for which you want to retrieve a default.
	 * @param  string $key         The key within the option who's default you want.
	 *
	 * @return  mixed
	 */
	public static function get_default( $option_name, $key ) {
		if ( isset( self::$option_instances[ $option_name ] ) ) {
			$defaults = self::$option_instances[ $option_name ]->get_defaults();
			if ( isset( $defaults[ $key ] ) ) {
				return $defaults[ $key ];
			}
		}

		return null;
	}

	/**
	 * Update a site_option.
	 *
	 * @param  string $option_name The option name of the option to save.
	 * @param  mixed  $value       The new value for the option.
	 *
	 * @return bool
	 */
	public static function update_site_option( $option_name, $value ) {
		if ( is_multisite() && isset( self::$option_instances[ $option_name ] ) ) {
			return self::$option_instances[ $option_name ]->update_site_option( $value );
		}

		return false;
	}

	/**
	 * Get the instantiated option instance.
	 *
	 * @param  string $option_name The option for which you want to retrieve the instance.
	 *
	 * @return  object|bool
	 */
	public static function get_option_instance( $option_name ) {
		if ( isset( self::$option_instances[ $option_name ] ) ) {
			return self::$option_instances[ $option_name ];
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
	 * @return  array  Array combining the values of all the options
	 */
	public static function get_all() {
		return self::get_options( self::get_option_names() );
	}

	/**
	 * Retrieve one or more options for the SEO plugin.
	 *
	 * @static
	 *
	 * @param array $option_names An array of option names of the options you want to get.
	 *
	 * @return  array  Array combining the values of the requested options
	 */
	public static function get_options( array $option_names ) {
		$options      = array();
		$option_names = array_filter( $option_names, 'is_string' );
		foreach ( $option_names as $option_name ) {
			if ( isset( self::$option_instances[ $option_name ] ) ) {
				$option  = self::get_option( $option_name );
				$options = array_merge( $options, $option );
			}
		}

		return $options;
	}

	/**
	 * Retrieve a single option for the SEO plugin.
	 *
	 * @static
	 *
	 * @param string $option_name The name of the option you want to get.
	 *
	 * @return array Array containing the requested option.
	 */
	public static function get_option( $option_name ) {
		$option = null;
		if ( is_string( $option_name ) && ! empty( $option_name ) ) {
			if ( isset( self::$option_instances[ $option_name ] ) ) {
				if ( self::$option_instances[ $option_name ]->multisite_only !== true ) {
					$option = get_option( $option_name );
				}
				else {
					$option = get_site_option( $option_name );
				}
			}
		}

		return $option;
	}

	/**
	 * Retrieve a single field from any option for the SEO plugin. Keys are always unique.
	 *
	 * @param string $key     The key it should return.
	 * @param mixed  $default The default value that should be returned if the key isn't set.
	 *
	 * @return mixed|null Returns value if found, $default if not.
	 */
	public static function get( $key, $default = null ) {
		self::$backfill->remove_hooks();

		$option = self::get_all();
		$option = self::add_ms_option( $option );

		self::$backfill->register_hooks();

		if ( isset( $option[ $key ] ) ) {
			return $option[ $key ];
		}

		return $default;
	}

	/**
	 * Retrieve a single field from an option for the SEO plugin.
	 *
	 * @param string $key   The key to set.
	 * @param mixed  $value The value to set.
	 *
	 * @return mixed|null Returns value if found, $default if not.
	 */
	public static function set( $key, $value ) {
		$lookup_table = self::get_lookup_table();

		if ( isset( $lookup_table[ $key ] ) ) {
			return self::save_option( $lookup_table[ $key ], $key, $value );
		}

		$patterns = self::get_pattern_table();
		foreach ( $patterns as $pattern => $option ) {
			if ( strpos( $key, $pattern ) === 0 ) {
				return self::save_option( $option, $key, $value );
			}
		}
	}

	/**
	 * Get an option only if it's been auto-loaded.
	 *
	 * @static
	 *
	 * @param string     $option  The option to retrieve.
	 * @param bool|mixed $default A default value to return.
	 *
	 * @return bool|mixed
	 */
	public static function get_autoloaded_option( $option, $default = false ) {
		$value = wp_cache_get( $option, 'options' );
		if ( false === $value ) {
			$passed_default = func_num_args() > 1;

			return apply_filters( "default_option_{$option}", $default, $option, $passed_default );
		}

		return apply_filters( "option_{$option}", maybe_unserialize( $value ), $option );
	}

	/**
	 * Run the clean up routine for one or all options.
	 *
	 * @param  array|string $option_name     Optional. the option you want to clean or an array of
	 *                                       option names for the options you want to clean.
	 *                                       If not set, all options will be cleaned.
	 * @param  string       $current_version Optional. Version from which to upgrade, if not set,
	 *                                       version specific upgrades will be disregarded.
	 *
	 * @return  void
	 */
	public static function clean_up( $option_name = null, $current_version = null ) {
		if ( isset( $option_name ) && is_string( $option_name ) && $option_name !== '' ) {
			if ( isset( self::$option_instances[ $option_name ] ) ) {
				self::$option_instances[ $option_name ]->clean( $current_version );
			}
		}
		elseif ( isset( $option_name ) && is_array( $option_name ) && $option_name !== array() ) {
			foreach ( $option_name as $option ) {
				if ( isset( self::$option_instances[ $option ] ) ) {
					self::$option_instances[ $option ]->clean( $current_version );
				}
			}
			unset( $option );
		}
		else {
			foreach ( self::$option_instances as $instance ) {
				$instance->clean( $current_version );
			}
			unset( $instance );

			// If we've done a full clean-up, we can safely remove this really old option.
			delete_option( 'wpseo_indexation' );
		}
	}

	/**
	 * Check that all options exist in the database and add any which don't.
	 *
	 * @return  void
	 */
	public static function ensure_options_exist() {
		foreach ( self::$option_instances as $instance ) {
			$instance->maybe_add_option();
		}
	}

	/**
	 * Initialize some options on first install/activate/reset.
	 *
	 * @static
	 * @return void
	 */
	public static function initialize() {
		/* Force WooThemes to use Yoast SEO data. */
		if ( function_exists( 'woo_version_init' ) ) {
			update_option( 'seo_woo_use_third_party_data', 'true' );
		}
	}

	/**
	 * Reset all options to their default values and rerun some tests.
	 *
	 * @static
	 * @return void
	 */
	public static function reset() {
		if ( ! is_multisite() ) {
			$option_names = self::get_option_names();
			if ( is_array( $option_names ) && $option_names !== array() ) {
				foreach ( $option_names as $option_name ) {
					delete_option( $option_name );
					update_option( $option_name, get_option( $option_name ) );
				}
			}
			unset( $option_names );
		}
		else {
			// Reset MS blog based on network default blog setting.
			self::reset_ms_blog( get_current_blog_id() );
		}

		self::initialize();
	}

	/**
	 * Initialize default values for a new multisite blog.
	 *
	 * @static
	 *
	 * @param  bool $force_init Whether to always do the initialization routine (title/desc test).
	 *
	 * @return void
	 */
	public static function maybe_set_multisite_defaults( $force_init = false ) {
		$option = get_option( 'wpseo' );

		if ( is_multisite() ) {
			if ( $option['ms_defaults_set'] === false ) {
				self::reset_ms_blog( get_current_blog_id() );
				self::initialize();
			}
			elseif ( $force_init === true ) {
				self::initialize();
			}
		}
	}

	/**
	 * Reset all options for a specific multisite blog to their default values based upon a
	 * specified default blog if one was chosen on the network page or the plugin defaults if it was not.
	 *
	 * @static
	 *
	 * @param  int|string $blog_id Blog id of the blog for which to reset the options.
	 *
	 * @return  void
	 */
	public static function reset_ms_blog( $blog_id ) {
		if ( is_multisite() ) {
			$options      = get_site_option( 'wpseo_ms' );
			$option_names = self::get_option_names();

			if ( is_array( $option_names ) && $option_names !== array() ) {
				$base_blog_id = $blog_id;
				if ( $options['defaultblog'] !== '' && $options['defaultblog'] !== 0 ) {
					$base_blog_id = $options['defaultblog'];
				}

				foreach ( $option_names as $option_name ) {
					delete_blog_option( $blog_id, $option_name );

					$new_option = get_blog_option( $base_blog_id, $option_name );

					/* Remove sensitive, theme dependent and site dependent info. */
					if ( isset( self::$option_instances[ $option_name ] ) && self::$option_instances[ $option_name ]->ms_exclude !== array() ) {
						foreach ( self::$option_instances[ $option_name ]->ms_exclude as $key ) {
							unset( $new_option[ $key ] );
						}
					}

					if ( $option_name === 'wpseo' ) {
						$new_option['ms_defaults_set'] = true;
					}

					update_blog_option( $blog_id, $option_name, $new_option );
				}
			}
		}
	}

	/**
	 * Saves the option to the database.
	 *
	 * @param string $wpseo_options_group_name The name for the wpseo option group in the database.
	 * @param string $option_name              The name for the option to set.
	 * @param *      $option_value             The value for the option.
	 *
	 * @return boolean Returns true if the option is successfully saved in the database.
	 */
	public static function save_option( $wpseo_options_group_name, $option_name, $option_value ) {
		$options                 = WPSEO_Options::get_option( $wpseo_options_group_name );
		$options[ $option_name ] = $option_value;
		update_option( $wpseo_options_group_name, $options );

		// Check if everything got saved properly.
		$saved_option = self::get_option( $wpseo_options_group_name );

		return $saved_option[ $option_name ] === $options[ $option_name ];
	}

	/**
	 * Adds the multisite options to the option stack if relevant.
	 *
	 * @param array $option The currently present options settings.
	 *
	 * @return array Options possibly including multisite.
	 */
	protected static function add_ms_option( $option ) {
		if ( ! is_multisite() ) {
			return $option;
		}

		$ms_option = self::get_option( 'wpseo_ms' );

		return array_merge( $option, $ms_option );
	}

	/**
	 * Retrieves a lookup table to find in which option_group a key is stored.
	 *
	 * @return array The lookup table.
	 */
	private static function get_lookup_table() {
		$lookup_table = array();

		self::$backfill->remove_hooks();

		foreach ( array_keys( self::$options ) as $option_name ) {
			$full_option = self::get_option( $option_name );
			foreach ( $full_option as $key => $value ) {
				$lookup_table[ $key ] = $option_name;
			}
		}

		self::$backfill->register_hooks();

		return $lookup_table;
	}

	/**
	 * Retrieves a lookup table to find in which option_group a key is stored.
	 *
	 * @return array The lookup table.
	 */
	private static function get_pattern_table() {
		$pattern_table = array();
		foreach ( self::$options as $option_name => $option_class ) {
			/** @var WPSEO_Option $instance */
			$instance = call_user_func( array( $option_class, 'get_instance' ) );
			foreach ( $instance->get_patterns() as $key ) {
				$pattern_table[ $key ] = $option_name;
			}
		}

		return $pattern_table;
	}

	/**
	 * Correct the inadvertent removal of the fallback to default values from the breadcrumbs.
	 *
	 * @since 1.5.2.3
	 *
	 * @deprecated 7.0
	 */
	public static function bring_back_breadcrumb_defaults() {
		_deprecated_function( __METHOD__, 'WPSEO 7.0' );
	}
}
