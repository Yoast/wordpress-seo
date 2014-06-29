<?php

/**
 * @package Main
 */

if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * @internal Nobody should be able to overrule the real version number as this can cause serious issues
 * with the options, so no if ( ! defined() )
 */
define( 'WPSEO_VERSION', '1.5.3.3' );

if ( ! defined( 'WPSEO_PATH' ) ) {
	define( 'WPSEO_PATH', plugin_dir_path( WPSEO_FILE ) );
}

if ( ! defined( 'WPSEO_BASENAME' ) ) {
	define( 'WPSEO_BASENAME', plugin_basename( WPSEO_FILE ) );
}

if ( ! defined( 'WPSEO_CSSJS_SUFFIX' ) ) {
	define( 'WPSEO_CSSJS_SUFFIX', ( ( defined( 'SCRIPT_DEBUG' ) && true === SCRIPT_DEBUG ) ? '' : '.min' ) );
}


/**
 * Auto load our class files
 *
 * @param   string  $class  Class name
 * @return    void
 */
function wpseo_auto_load( $class ) {
	static $classes = null;

	if ( $classes === null ) {
		$classes = array(
			'wpseo_admin'                        => WPSEO_PATH . 'admin/class-admin.php',
			'wpseo_bulk_title_editor_list_table' => WPSEO_PATH . 'admin/class-bulk-title-editor-list-table.php',
			'wpseo_bulk_description_list_table'  => WPSEO_PATH . 'admin/class-bulk-description-editor-list-table.php',
			'wpseo_admin_pages'                  => WPSEO_PATH . 'admin/class-config.php',
			'wpseo_metabox'                      => WPSEO_PATH . 'admin/class-metabox.php',
			'wpseo_social_admin'                 => WPSEO_PATH . 'admin/class-opengraph-admin.php',
			'wpseo_pointers'                     => WPSEO_PATH . 'admin/class-pointers.php',
			'wpseo_sitemaps_admin'               => WPSEO_PATH . 'admin/class-sitemaps-admin.php',
			'wpseo_taxonomy'                     => WPSEO_PATH . 'admin/class-taxonomy.php',
			'yoast_tracking'                     => WPSEO_PATH . 'admin/class-tracking.php',
			'yoast_textstatistics'               => WPSEO_PATH . 'admin/TextStatistics.php',
			'wpseo_breadcrumbs'                  => WPSEO_PATH . 'frontend/class-breadcrumbs.php',
			'wpseo_frontend'                     => WPSEO_PATH . 'frontend/class-frontend.php',
			'wpseo_opengraph'                    => WPSEO_PATH . 'frontend/class-opengraph.php',
			'wpseo_twitter'                      => WPSEO_PATH . 'frontend/class-twitter.php',
			'wpseo_googleplus'                   => WPSEO_PATH . 'frontend/class-googleplus.php',
			'wpseo_rewrite'                      => WPSEO_PATH . 'inc/class-rewrite.php',
			'wpseo_sitemaps'                     => WPSEO_PATH . 'inc/class-sitemaps.php',
			'sitemap_walker'                     => WPSEO_PATH . 'inc/class-sitemap-walker.php',
			'wpseo_options'                      => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option'                       => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_wpseo'                 => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_permalinks'            => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_titles'                => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_social'                => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_rss'                   => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_internallinks'         => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_xml'                   => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_option_ms'                    => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_taxonomy_meta'                => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_meta'                         => WPSEO_PATH . 'inc/class-wpseo-meta.php',
			'wpseo_replace_vars'                 => WPSEO_PATH . 'inc/class-wpseo-replace-vars.php',

			'yoast_license_manager'              => WPSEO_PATH . 'admin/license-manager/class-license-manager.php',
			'yoast_plugin_license_manager'       =>	WPSEO_PATH . 'admin/license-manager/class-plugin-license-manager.php',
			'yoast_product'                      =>	WPSEO_PATH . 'admin/license-manager/class-product.php',

			'yoast_notification_center'          =>	WPSEO_PATH . 'admin/class-yoast-notification-center.php',
			'yoast_notification'                 =>	WPSEO_PATH . 'admin/class-yoast-notification.php',

			'wp_list_table'                      => ABSPATH . 'wp-admin/includes/class-wp-list-table.php',
			'walker_category'                    => ABSPATH . 'wp-includes/category-template.php',
			'pclzip'                             => ABSPATH . 'wp-admin/includes/class-pclzip.php',
		);
	}

	$cn = strtolower( $class );

	if ( isset( $classes[$cn] ) ) {
		require_once( $classes[$cn] );
	}
}
if ( function_exists( 'spl_autoload_register' ) ) {
	spl_autoload_register( 'wpseo_auto_load' );
}


/**
 * Runs on activation of the plugin.
 */
function wpseo_activate() {
	require_once( WPSEO_PATH . 'inc/wpseo-functions.php' );

	WPSEO_Options::get_instance();
	if ( ! is_multisite() ) {
		WPSEO_Options::initialize();
	}
	else {
		WPSEO_Options::maybe_set_multisite_defaults( true );
	}

	flush_rewrite_rules();

	wpseo_add_capabilities();

	WPSEO_Options::schedule_yoast_tracking( null, get_option( 'wpseo' ) );

	// Clear cache so the changes are obvious.
	WPSEO_Options::clear_cache();

	do_action( 'wpseo_activate' );
}

/**
 * On deactivation, flush the rewrite rules so XML sitemaps stop working.
 */
function wpseo_deactivate() {
	require_once( WPSEO_PATH . 'inc/wpseo-functions.php' );

	flush_rewrite_rules();

	wpseo_remove_capabilities();

	// Force unschedule
	WPSEO_Options::schedule_yoast_tracking( null, get_option( 'wpseo' ), true );

	// Clear cache so the changes are obvious.
	WPSEO_Options::clear_cache();

	do_action( 'wpseo_deactivate' );
}

/**
 * Run wpseo activation routine on creation / activation of a multisite blog
 * Will only be called by multisite actions.
 * @internal Unfortunately will fail if the plugin is in the must-use directory
 * @see https://core.trac.wordpress.org/ticket/24205
 */
function wpseo_on_activate_blog( $blog_id ) {
	if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
		require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
	}

	if ( is_plugin_active_for_network( plugin_basename( WPSEO_FILE ) ) ) {
		switch_to_blog( $blog_id );
		wpseo_activate();
		restore_current_blog();
	}
}

/**
 * Run wpseo deactivation routine on deactivation of a multisite blog
 * Will only be called by multisite actions.
 * @internal Unfortunately will fail if the plugin is in the must-use directory
 * @see https://core.trac.wordpress.org/ticket/24205
 */
function wpseo_on_deactivate_blog( $blog_id ) {
	if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
		require_once( ABSPATH . '/wp-admin/includes/plugin.php' );
	}

	if ( is_plugin_active_for_network( plugin_basename( WPSEO_FILE ) ) ) {
		switch_to_blog( $blog_id );
		wpseo_deactivate();
		restore_current_blog();
	}
}

/**
 * Load translations
 */
function wpseo_load_textdomain() {
	load_plugin_textdomain( 'wordpress-seo', false, dirname( plugin_basename( WPSEO_FILE ) ) . '/languages/' );
}
add_action( 'init', 'wpseo_load_textdomain', 1 );



/**
 * On plugins_loaded: load the minimum amount of essential files for this plugin
 */
function wpseo_init() {
	require_once( WPSEO_PATH . 'inc/wpseo-functions.php' );

	// Make sure our option and meta value validation routines and default values are always registered and available
	WPSEO_Options::get_instance();
	WPSEO_Meta::init();

	$option_wpseo = get_option( 'wpseo' );
	if ( version_compare( $option_wpseo['version'], WPSEO_VERSION, '<' ) ) {
		wpseo_do_upgrade( $option_wpseo['version'] );
	}

	$options = WPSEO_Options::get_all();

	if ( $options['stripcategorybase'] === true ) {
		$GLOBALS['wpseo_rewrite'] = new WPSEO_Rewrite;
	}

	if ( $options['enablexmlsitemap'] === true ) {
		$GLOBALS['wpseo_sitemaps'] = new WPSEO_Sitemaps;
	}

	if ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) {
		require_once( WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php' );
	}
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_frontend_init() {
	add_action( 'init', 'initialize_wpseo_front' );

	$options = WPSEO_Options::get_all();
	if ( $options['breadcrumbs-enable'] === true ) {
		/**
		 * If breadcrumbs are active (which they supposedly are if the users has enabled this settings,
		 * there's no reason to have bbPress breadcrumbs as well.
		 *
		 * @internal The class itself is only loaded when the template tag is encountered via
		 * the template tag function in the wpseo-functions.php file
		 */
		add_filter( 'bbp_get_breadcrumb', '__return_false' );
	}

	add_action( 'template_redirect', 'wpseo_frontend_head_init', 999 );
}

/**
 * Instantiate the different social classes on the frontend
 */
function wpseo_frontend_head_init() {
	$options = WPSEO_Options::get_all();
	if ( $options['twitter'] === true && is_singular() ) {
		add_action( 'wpseo_head', array( 'WPSEO_Twitter', 'get_instance' ), 40 );
	}

	if ( $options['opengraph'] === true ) {
		$GLOBALS['wpseo_og'] = new WPSEO_OpenGraph;
	}

	if ( $options['googleplus'] === true && is_singular() ) {
		add_action( 'wpseo_head', array( 'WPSEO_GooglePlus', 'get_instance' ), 35 );
	}
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_admin_init() {
	global $pagenow;

	$GLOBALS['wpseo_admin'] = new WPSEO_Admin;

	$options = WPSEO_Options::get_all();
	if ( isset( $_GET['wpseo_restart_tour'] ) ) {
		$options['ignore_tour'] = false;
		update_option( 'wpseo', $options );
	}

	if ( $options['yoast_tracking'] === true ) {
		/**
		 * @internal this is not a proper lean loading implementation (method_exist will autoload the class),
		 * but it can't be helped as there are other plugins out there which also use versions
		 * of the Yoast Tracking class and we need to take that into account unfortunately
		 */
		if ( method_exists( 'Yoast_Tracking', 'get_instance' ) ) {
			add_action( 'yoast_tracking', array( 'Yoast_Tracking', 'get_instance' ) );
		}
		else {
			$GLOBALS['yoast_tracking'] = new Yoast_Tracking;
		}
	}

	if ( in_array( $pagenow, array( 'edit.php', 'post.php', 'post-new.php' ) ) ) {
		$GLOBALS['wpseo_metabox'] = new WPSEO_Metabox;
		if ( $options['opengraph'] === true ) {
			$GLOBALS['wpseo_social'] = new WPSEO_Social_Admin;
		}
	}

	if ( in_array( $pagenow, array( 'edit-tags.php' ) ) ) {
		$GLOBALS['wpseo_taxonomy'] = new WPSEO_Taxonomy;
	}

	if ( in_array( $pagenow, array( 'admin.php' ) ) ) {
		// @todo [JRF => whomever] Can we load this more selectively ? like only when $_GET['page'] is one of ours ?
		$GLOBALS['wpseo_admin_pages'] = new WPSEO_Admin_Pages;
	}

	if ( $options['tracking_popup_done'] === false || $options['ignore_tour'] === false ) {
		add_action( 'admin_enqueue_scripts', array( 'WPSEO_Pointers', 'get_instance' ) );
	}

	if ( $options['enablexmlsitemap'] === true ) {
		$GLOBALS['wpseo_sitemaps_admin'] = new WPSEO_Sitemaps_Admin;
	}

}

if ( ! function_exists( 'spl_autoload_register' ) ) {
	add_action( 'admin_init', 'yoast_wpseo_self_deactivate', 1 );
}
else {
	add_action( 'plugins_loaded', 'wpseo_init', 14 );

	if ( is_admin() ) {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			require_once( WPSEO_PATH . 'admin/ajax.php' );
		}
		else {
			add_action( 'plugins_loaded', 'wpseo_admin_init', 15 );
		}
	}
	else {
		add_action( 'plugins_loaded', 'wpseo_frontend_init', 15 );
	}

	add_action( 'admin_init', 'load_yoast_notifications' );
}

// Activation and deactivation hook
register_activation_hook( WPSEO_FILE, 'wpseo_activate' );
register_deactivation_hook( WPSEO_FILE, 'wpseo_deactivate' );
add_action( 'wpmu_new_blog', 'wpseo_on_activate_blog' );
add_action( 'activate_blog', 'wpseo_on_activate_blog' );
add_action( 'deactivate_blog', 'wpseo_on_deactivate_blog' );


function load_yoast_notifications() {
	// Init Yoast_Notification_Center class
	Yoast_Notification_Center::get();
}


/**
 * Throw an error if the PHP SPL extension is disabled (prevent white screens) and self-deactivate plugin
 *
 * @since 1.5.4
 *
 * @param	string	Error message
 * @return	void
 */
function yoast_wpseo_self_deactivate() {
	if ( is_admin() ) {
		$message = esc_html__( 'The Standard PHP Library (SPL) extension seem to be unavailable. Please ask your web host to enable it.', 'wordpress-seo' );
		add_action( 'admin_notices', create_function( $message, 'echo \'<div class="error"><p>\' . __( \'Activation failed:\', \'wordpress-seo\' ) . \' \' . $message . \'</p></div>\';' ) );

		deactivate_plugins( plugin_basename( WPSEO_FILE ) );
		if ( isset( $_GET['activate'] ) ) {
			unset( $_GET['activate'] );
		}
	}
}
