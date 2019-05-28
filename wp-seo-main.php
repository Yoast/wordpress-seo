<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Main
 */

if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * {@internal Nobody should be able to overrule the real version number as this can cause
 *            serious issues with the options, so no if ( ! defined() ).}}
 */
define( 'WPSEO_VERSION', '11.3' );


if ( ! defined( 'WPSEO_PATH' ) ) {
	define( 'WPSEO_PATH', plugin_dir_path( WPSEO_FILE ) );
}

if ( ! defined( 'WPSEO_BASENAME' ) ) {
	define( 'WPSEO_BASENAME', plugin_basename( WPSEO_FILE ) );
}

/*
 * {@internal The prefix constants are used to build prefixed versions of dependencies.
 *            These should not be changed on run-time, thus missing the ! defined() check.}}
 */
define( 'YOAST_VENDOR_NS_PREFIX', 'YoastSEO_Vendor' );
define( 'YOAST_VENDOR_DEFINE_PREFIX', 'YOASTSEO_VENDOR__' );
define( 'YOAST_VENDOR_PREFIX_DIRECTORY', 'vendor_prefixed' );

if ( ! defined( 'WPSEO_NAMESPACES' ) ) {
	if ( version_compare( phpversion(), '5.3', '>=' ) ) {
		define( 'WPSEO_NAMESPACES', true );
	}
	else {
		define( 'WPSEO_NAMESPACES', false );
	}
}


/* ***************************** CLASS AUTOLOADING *************************** */

/**
 * Autoload our class files.
 *
 * @param string $class Class name.
 *
 * @return void
 */
function wpseo_auto_load( $class ) {
	static $classes = null;

	if ( $classes === null ) {
		$classes = array(
			'wp_list_table'   => ABSPATH . 'wp-admin/includes/class-wp-list-table.php',
			'walker_category' => ABSPATH . 'wp-includes/category-template.php',
		);
	}

	$cn = strtolower( $class );

	if ( ! class_exists( $class ) && isset( $classes[ $cn ] ) ) {
		require_once $classes[ $cn ];
	}
}

$yoast_autoload_file = WPSEO_PATH . 'vendor/autoload_52.php';
if ( version_compare( phpversion(), '5.6', '>=' ) ) {
	$yoast_autoload_file = WPSEO_PATH . 'vendor/autoload.php';
}

if ( is_readable( $yoast_autoload_file ) ) {
	require $yoast_autoload_file;
}
elseif ( ! class_exists( 'WPSEO_Options' ) ) { // Still checking since might be site-level autoload R.
	add_action( 'admin_init', 'yoast_wpseo_missing_autoload', 1 );

	return;
}

if ( function_exists( 'spl_autoload_register' ) ) {
	spl_autoload_register( 'wpseo_auto_load' );
}

/* ********************* DEFINES DEPENDING ON AUTOLOADED CODE ********************* */

/**
 * Defaults to production, for safety.
 */
if ( ! defined( 'YOAST_ENVIRONMENT' ) ) {
	define( 'YOAST_ENVIRONMENT', 'production' );
}

/**
 * Only use minified assets when we are in a production environment.
 */
if ( ! defined( 'WPSEO_CSSJS_SUFFIX' ) ) {
	define( 'WPSEO_CSSJS_SUFFIX', ( 'development' !== YOAST_ENVIRONMENT ) ? '.min' : '' );
}

/* ***************************** PLUGIN (DE-)ACTIVATION *************************** */

/**
 * Run single site / network-wide activation of the plugin.
 *
 * @param bool $networkwide Whether the plugin is being activated network-wide.
 */
function wpseo_activate( $networkwide = false ) {
	if ( ! is_multisite() || ! $networkwide ) {
		_wpseo_activate();
	}
	else {
		/* Multi-site network activation - activate the plugin for all blogs. */
		wpseo_network_activate_deactivate( true );
	}
}

/**
 * Run single site / network-wide de-activation of the plugin.
 *
 * @param bool $networkwide Whether the plugin is being de-activated network-wide.
 */
function wpseo_deactivate( $networkwide = false ) {
	if ( ! is_multisite() || ! $networkwide ) {
		_wpseo_deactivate();
	}
	else {
		/* Multi-site network activation - de-activate the plugin for all blogs. */
		wpseo_network_activate_deactivate( false );
	}
}

/**
 * Run network-wide (de-)activation of the plugin.
 *
 * @param bool $activate True for plugin activation, false for de-activation.
 */
function wpseo_network_activate_deactivate( $activate = true ) {
	global $wpdb;

	$network_blogs = $wpdb->get_col( $wpdb->prepare( "SELECT blog_id FROM $wpdb->blogs WHERE site_id = %d", $wpdb->siteid ) );

	if ( is_array( $network_blogs ) && $network_blogs !== array() ) {
		foreach ( $network_blogs as $blog_id ) {
			switch_to_blog( $blog_id );

			if ( $activate === true ) {
				_wpseo_activate();
			}
			else {
				_wpseo_deactivate();
			}

			restore_current_blog();
		}
	}
}

/**
 * Runs on activation of the plugin.
 */
function _wpseo_activate() {
	require_once WPSEO_PATH . 'inc/wpseo-functions.php';
	require_once WPSEO_PATH . 'inc/class-wpseo-installation.php';

	wpseo_load_textdomain(); // Make sure we have our translations available for the defaults.

	new WPSEO_Installation();

	WPSEO_Options::get_instance();
	if ( ! is_multisite() ) {
		WPSEO_Options::initialize();
	}
	else {
		WPSEO_Options::maybe_set_multisite_defaults( true );
	}
	WPSEO_Options::ensure_options_exist();

	if ( is_multisite() && ms_is_switched() ) {
		delete_option( 'rewrite_rules' );
	}
	else {
		$wpseo_rewrite = new WPSEO_Rewrite();
		$wpseo_rewrite->schedule_flush();
	}

	do_action( 'wpseo_register_roles' );
	WPSEO_Role_Manager_Factory::get()->add();

	do_action( 'wpseo_register_capabilities' );
	WPSEO_Capability_Manager_Factory::get()->add();

	// Clear cache so the changes are obvious.
	WPSEO_Utils::clear_cache();

	// Create the text link storage table.
	$link_installer = new WPSEO_Link_Installer();
	$link_installer->install();

	// Trigger reindex notification.
	$notifier = new WPSEO_Link_Notifier();
	$notifier->manage_notification();

	// Schedule cronjob when it doesn't exists on activation.
	$wpseo_onpage = new WPSEO_OnPage();
	$wpseo_onpage->activate_hooks();

	do_action( 'wpseo_activate' );
}
/**
 * On deactivation, flush the rewrite rules so XML sitemaps stop working.
 */
function _wpseo_deactivate() {
	require_once WPSEO_PATH . 'inc/wpseo-functions.php';

	if ( is_multisite() && ms_is_switched() ) {
		delete_option( 'rewrite_rules' );
	}
	else {
		add_action( 'shutdown', 'flush_rewrite_rules' );
	}

	// Register capabilities, to make sure they are cleaned up.
	do_action( 'wpseo_register_roles' );
	do_action( 'wpseo_register_capabilities' );

	// Clean up capabilities.
	WPSEO_Role_Manager_Factory::get()->remove();
	WPSEO_Capability_Manager_Factory::get()->remove();

	// Clear cache so the changes are obvious.
	WPSEO_Utils::clear_cache();

	do_action( 'wpseo_deactivate' );
}

/**
 * Run wpseo activation routine on creation / activation of a multisite blog if WPSEO is activated
 * network-wide.
 *
 * Will only be called by multisite actions.
 *
 * {@internal Unfortunately will fail if the plugin is in the must-use directory.
 *            {@link https://core.trac.wordpress.org/ticket/24205} }}
 *
 * @param int|WP_Site $blog_id Blog ID.
 */
function wpseo_on_activate_blog( $blog_id ) {
	if ( ! function_exists( 'is_plugin_active_for_network' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	if ( $blog_id instanceof WP_Site ) {
		$blog_id = (int) $blog_id->blog_id;
	}

	if ( is_plugin_active_for_network( plugin_basename( WPSEO_FILE ) ) ) {
		switch_to_blog( $blog_id );
		wpseo_activate( false );
		restore_current_blog();
	}
}

/* ***************************** PLUGIN LOADING *************************** */

/**
 * Load translations.
 */
function wpseo_load_textdomain() {
	$wpseo_path = str_replace( '\\', '/', WPSEO_PATH );
	$mu_path    = str_replace( '\\', '/', WPMU_PLUGIN_DIR );

	if ( false !== stripos( $wpseo_path, $mu_path ) ) {
		load_muplugin_textdomain( 'wordpress-seo', dirname( WPSEO_BASENAME ) . '/languages/' );
	}
	else {
		load_plugin_textdomain( 'wordpress-seo', false, dirname( WPSEO_BASENAME ) . '/languages/' );
	}
}

add_action( 'plugins_loaded', 'wpseo_load_textdomain' );


/**
 * On plugins_loaded: load the minimum amount of essential files for this plugin.
 */
function wpseo_init() {
	require_once WPSEO_PATH . 'inc/wpseo-functions.php';
	require_once WPSEO_PATH . 'inc/wpseo-functions-deprecated.php';

	// Make sure our option and meta value validation routines and default values are always registered and available.
	WPSEO_Options::get_instance();
	WPSEO_Meta::init();

	if ( version_compare( WPSEO_Options::get( 'version', 1 ), WPSEO_VERSION, '<' ) ) {
		if ( function_exists( 'opcache_reset' ) ) {
			@opcache_reset();
		}

		new WPSEO_Upgrade();
		// Get a cleaned up version of the $options.
	}

	if ( WPSEO_Options::get( 'stripcategorybase' ) === true ) {
		$GLOBALS['wpseo_rewrite'] = new WPSEO_Rewrite();
	}

	if ( WPSEO_Options::get( 'enable_xml_sitemap' ) === true ) {
		$GLOBALS['wpseo_sitemaps'] = new WPSEO_Sitemaps();
	}

	if ( ! wp_doing_ajax() ) {
		require_once WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php';
	}

	// Init it here because the filter must be present on the frontend as well or it won't work in the customizer.
	new WPSEO_Customizer();

	/*
	 * Initializes the link watcher for both the frontend and backend.
	 * Required to process scheduled items properly.
	 */
	$link_watcher = new WPSEO_Link_Watcher_Loader();
	$link_watcher->load();

	$integrations   = array();
	$integrations[] = new WPSEO_Slug_Change_Watcher();
	$integrations[] = new WPSEO_Structured_Data_Blocks();
	$integrations[] = new WPSEO_Courses_Overview();

	foreach ( $integrations as $integration ) {
		$integration->register_hooks();
	}

	// Loading Ryte integration.
	$wpseo_onpage = new WPSEO_OnPage();
	$wpseo_onpage->register_hooks();

	// When namespaces are not available, stop further execution.
	if ( version_compare( PHP_VERSION, '5.6.0', '>=' ) ) {
		require_once WPSEO_PATH . 'src/loaders/indexable.php';
		// require_once WPSEO_PATH . 'src/loaders/oauth.php'; Temporarily disabled.
	}
}

/**
 * Loads the rest api endpoints.
 */
function wpseo_init_rest_api() {
	// We can't do anything when requirements are not met.
	if ( ! WPSEO_Utils::is_api_available() ) {
		return;
	}

	// Boot up REST API.
	$configuration_service = new WPSEO_Configuration_Service();
	$configuration_service->initialize();

	$ryte_endpoint_service = new WPSEO_Ryte_Service( new WPSEO_OnPage_Option() );
	$statistics_service    = new WPSEO_Statistics_Service( new WPSEO_Statistics() );

	$endpoints   = array();
	$endpoints[] = new WPSEO_Link_Reindex_Post_Endpoint( new WPSEO_Link_Reindex_Post_Service() );
	$endpoints[] = new WPSEO_Endpoint_Ryte( $ryte_endpoint_service );
	$endpoints[] = new WPSEO_Endpoint_Indexable( new WPSEO_Indexable_Service() );
	$endpoints[] = new WPSEO_Endpoint_File_Size( new WPSEO_File_Size_Service() );
	$endpoints[] = new WPSEO_Endpoint_Statistics( $statistics_service );
	$endpoints[] = new WPSEO_Endpoint_MyYoast_Connect();

	/** @var WPSEO_Endpoint[] $endpoints */
	foreach ( $endpoints as $endpoint ) {
		$endpoint->register();
	}
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_frontend_init() {
	add_action( 'init', 'initialize_wpseo_front' );

	if ( WPSEO_Options::get( 'breadcrumbs-enable' ) === true ) {
		/**
		 * If breadcrumbs are active (which they supposedly are if the users has enabled this settings,
		 * there's no reason to have bbPress breadcrumbs as well.
		 *
		 * {@internal The class itself is only loaded when the template tag is encountered
		 *            via the template tag function in the wpseo-functions.php file.}}
		 */
		add_filter( 'bbp_get_breadcrumb', '__return_false' );
	}

	add_action( 'template_redirect', 'wpseo_frontend_head_init', 999 );
}

/**
 * Instantiate the different social classes on the frontend.
 */
function wpseo_frontend_head_init() {
	if ( WPSEO_Options::get( 'twitter' ) === true ) {
		add_action( 'wpseo_head', array( 'WPSEO_Twitter', 'get_instance' ), 40 );
	}

	if ( WPSEO_Options::get( 'opengraph' ) === true ) {
		$GLOBALS['wpseo_og'] = new WPSEO_OpenGraph();
	}
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_admin_init() {
	new WPSEO_Admin_Init();
}

/**
 * Initialize the WP-CLI integration.
 *
 * The WP-CLI integration needs PHP 5.3 support, which should be automatically
 * enforced by the check for the WP_CLI constant. As WP-CLI itself only runs
 * on PHP 5.3+, the constant should only be set when requirements are met.
 */
function wpseo_cli_init() {
	if ( WPSEO_Utils::is_yoast_seo_premium() ) {
		WP_CLI::add_command(
			'yoast redirect list',
			'WPSEO_CLI_Redirect_List_Command',
			array( 'before_invoke' => 'WPSEO_CLI_Premium_Requirement::enforce' )
		);

		WP_CLI::add_command(
			'yoast redirect create',
			'WPSEO_CLI_Redirect_Create_Command',
			array( 'before_invoke' => 'WPSEO_CLI_Premium_Requirement::enforce' )
		);

		WP_CLI::add_command(
			'yoast redirect update',
			'WPSEO_CLI_Redirect_Update_Command',
			array( 'before_invoke' => 'WPSEO_CLI_Premium_Requirement::enforce' )
		);

		WP_CLI::add_command(
			'yoast redirect delete',
			'WPSEO_CLI_Redirect_Delete_Command',
			array( 'before_invoke' => 'WPSEO_CLI_Premium_Requirement::enforce' )
		);

		WP_CLI::add_command(
			'yoast redirect has',
			'WPSEO_CLI_Redirect_Has_Command',
			array( 'before_invoke' => 'WPSEO_CLI_Premium_Requirement::enforce' )
		);

		WP_CLI::add_command(
			'yoast redirect follow',
			'WPSEO_CLI_Redirect_Follow_Command',
			array( 'before_invoke' => 'WPSEO_CLI_Premium_Requirement::enforce' )
		);
	}

	// Only add the namespace if the required base class exists (WP-CLI 1.5.0+).
	// This is optional and only adds the description of the root `yoast`
	// command.
	if ( class_exists( 'WP_CLI\Dispatcher\CommandNamespace' ) ) {
		WP_CLI::add_command( 'yoast', 'WPSEO_CLI_Yoast_Command_Namespace' );
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			WP_CLI::add_command( 'yoast redirect', 'WPSEO_CLI_Redirect_Command_Namespace' );
		}
		else {
			WP_CLI::add_command( 'yoast redirect', 'WPSEO_CLI_Redirect_Upsell_Command_Namespace' );
		}
	}
}

/* ***************************** BOOTSTRAP / HOOK INTO WP *************************** */
$spl_autoload_exists = function_exists( 'spl_autoload_register' );
$filter_exists       = function_exists( 'filter_input' );

if ( ! $spl_autoload_exists ) {
	add_action( 'admin_init', 'yoast_wpseo_missing_spl', 1 );
}

if ( ! $filter_exists ) {
	add_action( 'admin_init', 'yoast_wpseo_missing_filter', 1 );
}

if ( ! wp_installing() && ( $spl_autoload_exists && $filter_exists ) ) {
	add_action( 'plugins_loaded', 'wpseo_init', 14 );
	add_action( 'rest_api_init', 'wpseo_init_rest_api' );

	if ( is_admin() ) {

		new Yoast_Alerts();

		$yoast_addon_manager = new WPSEO_Addon_Manager();
		$yoast_addon_manager->register_hooks();

		if ( wp_doing_ajax() ) {
			require_once WPSEO_PATH . 'admin/ajax.php';

			// Plugin conflict ajax hooks.
			new Yoast_Plugin_Conflict_Ajax();

			if ( filter_input( INPUT_POST, 'action' ) === 'inline-save' ) {
				add_action( 'plugins_loaded', 'wpseo_admin_init', 15 );
			}
		}
		else {
			add_action( 'plugins_loaded', 'wpseo_admin_init', 15 );
		}
	}
	else {
		add_action( 'plugins_loaded', 'wpseo_frontend_init', 15 );
	}

	add_action( 'plugins_loaded', 'load_yoast_notifications' );

	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		add_action( 'plugins_loaded', 'wpseo_cli_init', 20 );
	}

	add_filter( 'phpcompat_whitelist', 'yoast_free_phpcompat_whitelist' );
}

// Activation and deactivation hook.
register_activation_hook( WPSEO_FILE, 'wpseo_activate' );
register_deactivation_hook( WPSEO_FILE, 'wpseo_deactivate' );

// Wpmu_new_blog has been deprecated in 5.1 and replaced by wp_insert_site.
global $wp_version;
if ( version_compare( $wp_version, '5.1', '<' ) ) {
	add_action( 'wpmu_new_blog', 'wpseo_on_activate_blog' );
}
else {
	add_action( 'wp_initialize_site', 'wpseo_on_activate_blog', 99 );
}

add_action( 'activate_blog', 'wpseo_on_activate_blog' );

// Registers SEO capabilities.
$wpseo_register_capabilities = new WPSEO_Register_Capabilities();
$wpseo_register_capabilities->register_hooks();

// Registers SEO roles.
$wpseo_register_capabilities = new WPSEO_Register_Roles();
$wpseo_register_capabilities->register_hooks();

/**
 * Wraps for notifications center class.
 */
function load_yoast_notifications() {
	// Init Yoast_Notification_Center class.
	Yoast_Notification_Center::get();
}


/**
 * Throw an error if the PHP SPL extension is disabled (prevent white screens) and self-deactivate plugin.
 *
 * @since 1.5.4
 *
 * @return void
 */
function yoast_wpseo_missing_spl() {
	if ( is_admin() ) {
		add_action( 'admin_notices', 'yoast_wpseo_missing_spl_notice' );

		yoast_wpseo_self_deactivate();
	}
}

/**
 * Returns the notice in case of missing spl extension.
 */
function yoast_wpseo_missing_spl_notice() {
	$message = esc_html__( 'The Standard PHP Library (SPL) extension seem to be unavailable. Please ask your web host to enable it.', 'wordpress-seo' );
	yoast_wpseo_activation_failed_notice( $message );
}

/**
 * Throw an error if the Composer autoload is missing and self-deactivate plugin.
 *
 * @return void
 */
function yoast_wpseo_missing_autoload() {
	if ( is_admin() ) {
		add_action( 'admin_notices', 'yoast_wpseo_missing_autoload_notice' );

		yoast_wpseo_self_deactivate();
	}
}

/**
 * Returns the notice in case of missing Composer autoload.
 */
function yoast_wpseo_missing_autoload_notice() {
	/* translators: %1$s expands to Yoast SEO, %2$s / %3$s: links to the installation manual in the Readme for the Yoast SEO code repository on GitHub */
	$message = esc_html__( 'The %1$s plugin installation is incomplete. Please refer to %2$sinstallation instructions%3$s.', 'wordpress-seo' );
	$message = sprintf( $message, 'Yoast SEO', '<a href="https://github.com/Yoast/wordpress-seo#installation">', '</a>' );
	yoast_wpseo_activation_failed_notice( $message );
}

/**
 * Throw an error if the filter extension is disabled (prevent white screens) and self-deactivate plugin.
 *
 * @since 2.0
 *
 * @return void
 */
function yoast_wpseo_missing_filter() {
	if ( is_admin() ) {
		add_action( 'admin_notices', 'yoast_wpseo_missing_filter_notice' );

		yoast_wpseo_self_deactivate();
	}
}

/**
 * Returns the notice in case of missing filter extension.
 */
function yoast_wpseo_missing_filter_notice() {
	$message = esc_html__( 'The filter extension seem to be unavailable. Please ask your web host to enable it.', 'wordpress-seo' );
	yoast_wpseo_activation_failed_notice( $message );
}

/**
 * Echo's the Activation failed notice with any given message.
 *
 * @param string $message Message string.
 */
function yoast_wpseo_activation_failed_notice( $message ) {
	echo '<div class="error"><p>' . esc_html__( 'Activation failed:', 'wordpress-seo' ) . ' ' . $message . '</p></div>';
}

/**
 * The method will deactivate the plugin, but only once, done by the static $is_deactivated.
 */
function yoast_wpseo_self_deactivate() {
	static $is_deactivated;

	if ( $is_deactivated === null ) {
		$is_deactivated = true;
		deactivate_plugins( plugin_basename( WPSEO_FILE ) );
		if ( isset( $_GET['activate'] ) ) {
			unset( $_GET['activate'] );
		}
	}
}

/**
 * Excludes specific files from php-compatibility-checker.
 *
 * @since 9.4
 *
 * @param array $ignored Array of ignored directories/files.
 *
 * @return array Array of ignored directories/files.
 */
function yoast_free_phpcompat_whitelist( $ignored ) {
	$path = '*/' . basename( WPSEO_PATH ) . '/';

	// To prevent: (warning) File has mixed line endings; this may cause incorrect results.
	$ignored[] = $path . 'vendor/ruckusing/lib/Ruckusing/FrameworkRunner.php';
	$ignored[] = $path . 'vendor_prefixed/ruckusing/lib/Ruckusing/FrameworkRunner.php';

	/*
	 * To prevent: (error) Extension 'sqlite' is removed since PHP 5.4.
	 * Ignoring because we are not using the sqlite functionality.
	 */
	$ignored[] = $path . 'vendor/ruckusing/lib/Ruckusing/Adapter/Sqlite3/Base.php';
	$ignored[] = $path . 'vendor_prefixed/ruckusing/lib/Ruckusing/Adapter/Sqlite3/Base.php';

	return $ignored;
}
