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


/*******************************************************************
 * Overall Option Management
 *******************************************************************/

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
			if ( class_exists( $option_class ) ) {
				self::$option_instances[$option_name] = call_user_func( array( $option_class, 'get_instance' ) );
			} else {
				unset( self::$options[$option_name] );
			}
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
		if ( ! is_multisite() ) {
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
	 * Update a site_option
	 *
	 * @param  string $option_name The option name of the option to save
	 * @param  mized  $value       The new value for the option
	 *
	 * @return bool
	 */
	public static function update_site_option( $option_name, $value ) {
		if ( is_network_admin() && isset( self::$option_instances[$option_name] ) ) {
			return self::$option_instances[$option_name]->update_site_option( $value );
		} else {
			return false;
		}
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
				if ( self::$option_instances[$option_name]->multisite_only !== true ) {
					$option = get_option( $option_name );
				} else {
					$option = get_site_option( $option_name );
				}

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
	 * Check that all options exist in the database and add any which don't
	 *
	 * @return  void
	 */
	public static function ensure_options_exist() {
		foreach ( self::$option_instances as $instance ) {
			$instance->maybe_add_option();
		}
	}


	/**
	 * Correct the inadvertent removal of the fallback to default values from the breadcrumbs
	 *
	 * @since 1.5.2.3
	 */
	public static function bring_back_breadcrumb_defaults() {
		if ( isset( self::$option_instances['wpseo_internallinks'] ) ) {
			self::$option_instances['wpseo_internallinks']->bring_back_defaults();
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

//			wpseo_title_test();
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
		} else {
			// Reset MS blog based on network default blog setting
			self::reset_ms_blog( get_current_blog_id() );
		}

		self::initialize();
	}


	/**
	 * Initialize default values for a new multisite blog
	 *
	 * @static
	 *
	 * @param  bool $force_init Whether to always do the initialization routine (title/desc test)
	 *
	 * @return void
	 */
	public static function maybe_set_multisite_defaults( $force_init = false ) {
		$option = get_option( 'wpseo' );

		if ( is_multisite() ) {
			if ( $option['ms_defaults_set'] === false ) {
				self::reset_ms_blog( get_current_blog_id() );
				self::initialize();
			} else {
				if ( $force_init === true ) {
					self::initialize();
				}
			}
		}
	}


	/**
	 * Reset all options for a specific multisite blog to their default values based upon a
	 * specified default blog if one was chosen on the network page or the plugin defaults if it was not
	 *
	 * @static
	 *
	 * @param  int|string $blog_id Blog id of the blog for which to reset the options
	 *
	 * @return  void
	 */
	public static function reset_ms_blog( $blog_id ) {
		if ( is_multisite() ) {
			$options      = get_site_option( 'wpseo_ms' );
			$option_names = self::get_option_names();

			if ( is_array( $option_names ) && $option_names !== array() ) {
				$base_blog_id = $blog_id;
				if ( $options['defaultblog'] !== '' && $options['defaultblog'] != 0 ) {
					$base_blog_id = $options['defaultblog'];
				}

				foreach ( $option_names as $option_name ) {
					delete_blog_option( $blog_id, $option_name );

					$new_option = get_blog_option( $base_blog_id, $option_name );

					/* Remove sensitive, theme dependent and site dependent info */
					if ( isset( self::$option_instances[$option_name] ) && self::$option_instances[$option_name]->ms_exclude !== array() ) {
						foreach ( self::$option_instances[$option_name]->ms_exclude as $key ) {
							unset( $new_option[$key] );
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
	public static function flush_w3tc_cache() {
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
