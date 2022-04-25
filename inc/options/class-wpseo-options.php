<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals\Options
 */

use Yoast\WP\SEO\Exceptions\Option\Unknown_Exception;
use Yoast\WP\SEO\Services\Options\Multisite_Options_Service;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;

/**
 * Overall Option Management class.
 *
 * Instantiates all the options and offers a number of utility methods to work with the options.
 */
class WPSEO_Options {

	/**
	 * The option values.
	 *
	 * @var array|null
	 */
	protected static $option_values = null;

	/**
	 * Options this class uses.
	 *
	 * @var array Array format: (string) option_name  => (string) name of concrete class for the option.
	 */
	public static $options = [
		'wpseo'               => 'WPSEO_Option_Wpseo',
		'wpseo_titles'        => 'WPSEO_Option_Titles',
		'wpseo_social'        => 'WPSEO_Option_Social',
		'wpseo_ms'            => 'WPSEO_Option_MS',
		'wpseo_taxonomy_meta' => 'WPSEO_Taxonomy_Meta',
	];

	/**
	 * Array of instantiated option objects.
	 *
	 * @var array
	 */
	protected static $option_instances = [];

	/**
	 * Array with the option names.
	 *
	 * @var array
	 */
	protected static $option_names = [];

	/**
	 * Instance of this class.
	 *
	 * @var WPSEO_Options
	 */
	protected static $instance;

	/**
	 * Instantiate all the WPSEO option management classes.
	 */
	protected function __construct() {
		foreach ( static::$options as $option_name => $option_class ) {
			static::register_option( call_user_func( [ $option_class, 'get_instance' ] ) );
		}
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @return object
	 */
	public static function get_instance() {
		if ( ! ( static::$instance instanceof self ) ) {
			static::$instance = new self();
		}

		return static::$instance;
	}

	/**
	 * Registers an option to the options list.
	 *
	 * @param WPSEO_Option $option_instance Instance of the option.
	 */
	public static function register_option( WPSEO_Option $option_instance ) {
		$option_name = $option_instance->get_option_name();

		if ( $option_instance->multisite_only && ! static::is_multisite() ) {
			unset( static::$options[ $option_name ], static::$option_names[ $option_name ] );

			return;
		}

		$is_already_registered = array_key_exists( $option_name, static::$options );
		if ( ! $is_already_registered ) {
			static::$options[ $option_name ] = get_class( $option_instance );
		}

		if ( $option_instance->include_in_all === true ) {
			static::$option_names[ $option_name ] = $option_name;
		}

		static::$option_instances[ $option_name ] = $option_instance;

		if ( ! $is_already_registered ) {
			static::clear_cache();
		}
	}

	/**
	 * Get the group name of an option for use in the settings form.
	 *
	 * @param string $option_name The option for which you want to retrieve the option group name.
	 *
	 * @return string|bool
	 */
	public static function get_group_name( $option_name ) {
		if ( isset( static::$option_instances[ $option_name ] ) ) {
			return static::$option_instances[ $option_name ]->group_name;
		}

		return false;
	}

	/**
	 * Get a specific default value for an option.
	 *
	 * @param string $option_name The option for which you want to retrieve a default.
	 * @param string $key         The key within the option who's default you want.
	 *
	 * @return mixed
	 */
	public static function get_default( $option_name, $key ) {
		return YoastSEO()->helpers->options->get_default( $key );
	}

	/**
	 * Update a site_option.
	 *
	 * @param string $option_name The option name of the option to save.
	 * @param mixed  $value       The new value for the option.
	 *
	 * @return bool
	 */
	public static function update_site_option( $option_name, $value ) {
		if ( is_multisite() && isset( static::$option_instances[ $option_name ] ) ) {
			return static::$option_instances[ $option_name ]->update_site_option( $value );
		}

		return false;
	}

	/**
	 * Get the instantiated option instance.
	 *
	 * @param string $option_name The option for which you want to retrieve the instance.
	 *
	 * @return object|bool
	 */
	public static function get_option_instance( $option_name ) {
		if ( isset( static::$option_instances[ $option_name ] ) ) {
			return static::$option_instances[ $option_name ];
		}

		return false;
	}

	/**
	 * Retrieve an array of the options which should be included in get_all() and reset().
	 *
	 * @return array Array of option names.
	 */
	public static function get_option_names() {
		$option_names = array_values( static::$option_names );
		if ( $option_names === [] ) {
			foreach ( static::$option_instances as $option_name => $option_object ) {
				if ( $option_object->include_in_all === true ) {
					$option_names[] = $option_name;
				}
			}
		}

		/**
		 * Filter: wpseo_options - Allow developers to change the option name to include.
		 *
		 * @api array The option names to include in get_all and reset().
		 */
		return apply_filters( 'wpseo_options', $option_names );
	}

	/**
	 * Retrieve all the options for the SEO plugin in one go.
	 *
	 * @return array Array combining the values of all the options.
	 */
	public static function get_all() {
		return YoastSEO()->helpers->options->get_options();
	}

	/**
	 * Retrieve one or more options for the SEO plugin.
	 *
	 * @param array $option_names An array of option names of the options you want to get.
	 *
	 * @return array Array combining the values of the requested options.
	 */
	public static function get_options( array $option_names ) {
		$options      = [];
		$option_names = array_filter( $option_names, 'is_string' );
		foreach ( $option_names as $option_name ) {
			if ( isset( static::$option_instances[ $option_name ] ) ) {
				$option = static::get_option( $option_name );

				if ( $option !== null ) {
					$options = array_merge( $options, $option );
				}
			}
		}

		return $options;
	}

	/**
	 * Retrieve a single option for the SEO plugin.
	 *
	 * @param string $option_name The name of the option you want to get.
	 *
	 * @return array Array containing the requested option.
	 */
	public static function get_option( $option_name ) {
		if ( is_string( $option_name ) && ! empty( $option_name ) ) {
			if ( isset( static::$option_instances[ $option_name ] ) ) {
				return YoastSEO()->helpers->options->get_options( \array_keys( static::$option_instances[ $option_name ]->get_defaults() ) );
			}
		}

		return null;
	}

	/**
	 * Retrieve a single field from any option for the SEO plugin. Keys are always unique.
	 *
	 * @param string $key           The key it should return.
	 * @param mixed  $default_value The default value that should be returned if the key isn't set.
	 *
	 * @return mixed Returns value if found, $default_value if not.
	 */
	public static function get( $key, $default_value = null ) {
		return YoastSEO()->helpers->options->get( $key, $default_value );
	}

	/**
	 * Resets the cache to null.
	 */
	public static function clear_cache() {
		static::$option_values = null;
		YoastSEO()->helpers->options->clear_cache();
	}

	/**
	 * Primes our cache.
	 */
	private static function prime_cache() {
		static::$option_values = static::get_all();
		static::$option_values = static::add_ms_option( static::$option_values );
	}

	/**
	 * Retrieve a single field from an option for the SEO plugin.
	 *
	 * @param string $key   The key to set.
	 * @param mixed  $value The value to set.
	 *
	 * @return bool Whether the save was successful.
	 */
	public static function set( $key, $value ) {
		return YoastSEO()->helpers->options->set( $key, $value );
	}

	/**
	 * Get an option only if it's been auto-loaded.
	 *
	 * @param string $option        The option to retrieve.
	 * @param mixed  $default_value A default value to return.
	 *
	 * @return mixed
	 */
	public static function get_autoloaded_option( $option, $default_value = false ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		$value = wp_cache_get( $option, 'options' );
		if ( $value === false ) {
			$passed_default = func_num_args() > 1;

			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- Using WP native filter.
			return apply_filters( "default_option_{$option}", $default_value, $option, $passed_default );
		}

		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals -- Using WP native filter.
		return apply_filters( "option_{$option}", maybe_unserialize( $value ), $option );
	}

	/**
	 * Run the clean up routine for one or all options.
	 *
	 * @param array|string|null $option_name     Optional. the option you want to clean or an array of
	 *                                           option names for the options you want to clean.
	 *                                           If not set, all options will be cleaned.
	 * @param string|null       $current_version Optional. Version from which to upgrade, if not set,
	 *                                           version specific upgrades will be disregarded.
	 *
	 * @return void
	 */
	public static function clean_up( $option_name = null, $current_version = null ) {
		if ( isset( $option_name ) && is_string( $option_name ) && $option_name !== '' ) {
			if ( isset( static::$option_instances[ $option_name ] ) ) {
				static::$option_instances[ $option_name ]->clean( $current_version );
			}
		}
		elseif ( isset( $option_name ) && is_array( $option_name ) && $option_name !== [] ) {
			foreach ( $option_name as $option ) {
				if ( isset( static::$option_instances[ $option ] ) ) {
					static::$option_instances[ $option ]->clean( $current_version );
				}
			}
			unset( $option );
		}
		else {
			foreach ( static::$option_instances as $instance ) {
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
	 * @return void
	 */
	public static function ensure_options_exist() {
		YoastSEO()->helpers->options->ensure_options();
	}

	/**
	 * Initialize some options on first install/activate/reset.
	 *
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
	 * @return void
	 */
	public static function reset() {
		if ( ! is_multisite() ) {
			YoastSEO()->helpers->options->reset_options();
		}
		else {
			// Reset MS blog based on network default blog setting.
			static::reset_ms_blog( get_current_blog_id() );
		}

		static::initialize();
	}

	/**
	 * Initialize default values for a new multisite blog.
	 *
	 * @param bool $force_init Whether to always do the initialization routine (title/desc test).
	 *
	 * @return void
	 */
	public static function maybe_set_multisite_defaults( $force_init = false ) {
		if ( ! is_multisite() ) {
			return;
		}

		/**
		 * Indicates this variable is a Multisite_Options_Service.
		 *
		 * @var \Yoast\WP\SEO\Services\Options\Multisite_Options_Service $multisite_options_service
		 */
		$multisite_options_service = YoastSEO()->classes->get( Multisite_Options_Service::class );

		try {
			$is_ms_defaults_set = $multisite_options_service->__get( 'ms_defaults_set' );
		} catch ( Unknown_Exception $e ) {
			$is_ms_defaults_set = false;
		}

		if ( ! $is_ms_defaults_set ) {
			static::reset_ms_blog( get_current_blog_id() );
			static::initialize();
		}
		elseif ( $force_init === true ) {
			static::initialize();
		}
	}

	/**
	 * Reset all options for a specific multisite blog to their default values based upon a
	 * specified default blog if one was chosen on the network page or the plugin defaults if it was not.
	 *
	 * @param int|string $blog_id Blog id of the blog for which to reset the options.
	 *
	 * @return void
	 */
	public static function reset_ms_blog( $blog_id ) {
		if ( ! self::is_multisite() ) {
			return;
		}

		/**
		 * Indicates this variable is a Multisite_Options_Service.
		 *
		 * @var \Yoast\WP\SEO\Services\Options\Multisite_Options_Service $multisite_options_service
		 */
		$multisite_options_service = YoastSEO()->classes->get( Multisite_Options_Service::class );
		/**
		 * Indicates this variable is a Network_Admin_Options_Service.
		 *
		 * @var \Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service $options_service
		 */
		$network_admin_options_service = YoastSEO()->classes->get( Network_Admin_Options_Service::class );

		$base_blog_id = $blog_id;
		// Override the blog ID to get the new options from when a default blog is set.
		try {
			$default_blog = $network_admin_options_service->__get( 'defaultblog' );
			if ( $default_blog !== '' && $default_blog !== 0 ) {
				$base_blog_id = $default_blog;
			}
		} catch ( Unknown_Exception $exception ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		}

		delete_blog_option( $blog_id, $multisite_options_service->option_name );

		$new_options                    = get_blog_option( $base_blog_id, $multisite_options_service->option_name );
		$new_options['ms_defaults_set'] = true;
		foreach ( $multisite_options_service->get_configurations() as $key => $configuration ) {
			// Remove sensitive, theme dependent and site dependent info.
			if ( array_key_exists( 'ms_exclude', $configuration ) && $configuration['ms_exclude'] ) {
				unset( $new_options[ $key ] );
			}
		}

		update_blog_option( $blog_id, $multisite_options_service->option_name, $new_options );
	}

	/**
	 * Saves the option to the database.
	 *
	 * @param string $wpseo_options_group_name The name for the wpseo option group in the database.
	 * @param string $option_name              The name for the option to set.
	 * @param mixed  $option_value             The value for the option.
	 *
	 * @return bool Returns true if the option is successfully saved in the database.
	 */
	public static function save_option( $wpseo_options_group_name, $option_name, $option_value ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'YoastSEO()->helpers->options->set' );

		$options                 = static::get_option( $wpseo_options_group_name );
		$options[ $option_name ] = $option_value;

		if ( isset( static::$option_instances[ $wpseo_options_group_name ] ) && static::$option_instances[ $wpseo_options_group_name ]->multisite_only === true ) {
			static::update_site_option( $wpseo_options_group_name, $options );
		}
		else {
			update_option( $wpseo_options_group_name, $options );
		}

		// Check if everything got saved properly.
		$saved_option = static::get_option( $wpseo_options_group_name );

		// Clear our cache.
		static::clear_cache();

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

		$ms_option = static::get_option( 'wpseo_ms' );
		if ( $ms_option === null ) {
			return $option;
		}

		return array_merge( $option, $ms_option );
	}

	/**
	 * Checks if installation is multisite.
	 *
	 * @return bool True when is multisite.
	 */
	protected static function is_multisite() {
		static $is_multisite;

		if ( $is_multisite === null ) {
			$is_multisite = is_multisite();
		}

		return $is_multisite;
	}

	/**
	 * Retrieves a lookup table to find in which option_group a key is stored.
	 *
	 * @return array The lookup table.
	 */
	private static function get_lookup_table() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		$lookup_table = [];


		foreach ( array_keys( static::$options ) as $option_name ) {
			$full_option = static::get_option( $option_name );
			foreach ( $full_option as $key => $value ) {
				$lookup_table[ $key ] = $option_name;
			}
		}

		return $lookup_table;
	}

	/**
	 * Retrieves a lookup table to find in which option_group a key is stored.
	 *
	 * @return array The lookup table.
	 */
	private static function get_pattern_table() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		$pattern_table = [];
		foreach ( static::$options as $option_name => $option_class ) {
			$instance = call_user_func( [ $option_class, 'get_instance' ] );
			foreach ( $instance->get_patterns() as $key ) {
				$pattern_table[ $key ] = $option_name;
			}
		}

		return $pattern_table;
	}
}
