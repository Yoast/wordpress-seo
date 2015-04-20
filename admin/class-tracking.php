<?php
/**
 * Contains the Tracking class and filtering specific to WordPress SEO for the tracking class.
 *
 * If the class is instatiated from another plugin, the filtering still works.
 *
 * @package WPSEO\Admin\Tracking
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Class that creates the tracking functionality for WP SEO, as the core class might be used in more plugins,
 * it's checked for existence first.
 *
 * NOTE: this functionality is opt-in. Disabling the tracking in the settings or saying no when asked will cause
 * this file to not even be loaded.
 *
 * @todo [JRF => testers] check if tracking still works if an old version of the Yoast Tracking class was loaded
 * (i.e. another plugin loaded their version first)
 */
class Yoast_Tracking {

	/**
	 * @var    object    Instance of this class
	 */
	public static $instance;


	/**
	 * Class constructor
	 */
	function __construct() {
		// Constructor is called from WP SEO
		if ( current_filter( 'yoast_tracking' ) ) {
			$this->tracking();
		} // Backward compatibility - constructor is called from other Yoast plugin
		elseif ( ! has_action( 'yoast_tracking', array( $this, 'tracking' ) ) ) {
			add_action( 'yoast_tracking', array( $this, 'tracking' ) );
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
	 * Main tracking function.
	 */
	function tracking() {

		$transient_key = 'yoast_tracking_cache';
		$data          = get_transient( $transient_key );

		// bail if transient is set and valid
		if ( $data !== false ) {
			return;
		}

		// Make sure to only send tracking data once a week
		set_transient( $transient_key, 1, WEEK_IN_SECONDS );

		// Start of Metrics
		global $wpdb;

		$hash = get_option( 'Yoast_Tracking_Hash', false );

		if ( ! $hash || empty( $hash ) ) {
			// create and store hash
			$hash = md5( site_url() );
			update_option( 'Yoast_Tracking_Hash', $hash );
		}

		$pts        = array();
		$post_types = get_post_types( array( 'public' => true ) );
		if ( is_array( $post_types ) && $post_types !== array() ) {
			foreach ( $post_types as $post_type ) {
				$count             = wp_count_posts( $post_type );
				$pts[ $post_type ] = $count->publish;
			}
		}
		unset( $post_types, $post_type, $count );

		$comments_count = wp_count_comments();

		$theme_data     = wp_get_theme();
		$theme          = array(
			'name'       => $theme_data->display( 'Name', false, false ),
			'theme_uri'  => $theme_data->display( 'ThemeURI', false, false ),
			'version'    => $theme_data->display( 'Version', false, false ),
			'author'     => $theme_data->display( 'Author', false, false ),
			'author_uri' => $theme_data->display( 'AuthorURI', false, false ),
		);
		$theme_template = $theme_data->get_template();
		if ( $theme_template !== '' && $theme_data->parent() ) {
			$theme['template'] = array(
				'version'    => $theme_data->parent()->display( 'Version', false, false ),
				'name'       => $theme_data->parent()->display( 'Name', false, false ),
				'theme_uri'  => $theme_data->parent()->display( 'ThemeURI', false, false ),
				'author'     => $theme_data->parent()->display( 'Author', false, false ),
				'author_uri' => $theme_data->parent()->display( 'AuthorURI', false, false ),
			);
		}
		else {
			$theme['template'] = '';
		}
		unset( $theme_template );


		$plugins        = array();
		$active_plugins = get_option( 'active_plugins' );
		foreach ( $active_plugins as $plugin_path ) {
			if ( ! function_exists( 'get_plugin_data' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
			}

			$plugin_info = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin_path );

			$slug             = str_replace( '/' . basename( $plugin_path ), '', $plugin_path );
			$plugins[ $slug ] = array(
				'version'    => $plugin_info['Version'],
				'name'       => $plugin_info['Name'],
				'plugin_uri' => $plugin_info['PluginURI'],
				'author'     => $plugin_info['AuthorName'],
				'author_uri' => $plugin_info['AuthorURI'],
			);
		}
		unset( $active_plugins, $plugin_path, $plugin_info, $slug );


		$data = array(
			'site'     => array(
				'hash'      => $hash,
				'version'   => get_bloginfo( 'version' ),
				'multisite' => is_multisite(),
				'users'     => $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->users INNER JOIN $wpdb->usermeta ON ({$wpdb->users}.ID = {$wpdb->usermeta}.user_id) WHERE 1 = 1 AND ( {$wpdb->usermeta}.meta_key = %s )", 'wp_' . $GLOBALS['blog_id'] . '_capabilities' ) ),
				'lang'      => get_locale(),
			),
			'pts'      => $pts,
			'comments' => array(
				'total'    => $comments_count->total_comments,
				'approved' => $comments_count->approved,
				'spam'     => $comments_count->spam,
				'pings'    => $wpdb->get_var( "SELECT COUNT(comment_ID) FROM $wpdb->comments WHERE comment_type = 'pingback'" ),
			),
			'options'  => apply_filters( 'yoast_tracking_filters', array() ),
			'theme'    => $theme,
			'plugins'  => $plugins,
		);

		$args = array(
			'body'      => $data,
			'blocking'  => false,
			'sslverify' => false,
		);

		wp_remote_post( 'https://tracking.yoast.com/', $args );

	}
} /* End of class */

/**
 * Adds tracking parameters for WP SEO settings. Outside of the main class as the class could also be in use in other plugins.
 *
 * @param array $options
 *
 * @return array
 */
function wpseo_tracking_additions( $options ) {
	if ( function_exists( 'curl_version' ) ) {
		$curl = curl_version();
	}
	else {
		$curl = null;
	}


	$opt = WPSEO_Options::get_all();

	$options['wpseo'] = array(
		'xml_sitemaps'                => ( $opt['enablexmlsitemap'] === true ) ? 1 : 0,
		'force_rewrite'               => ( $opt['forcerewritetitle'] === true ) ? 1 : 0,
		'opengraph'                   => ( $opt['opengraph'] === true ) ? 1 : 0,
		'twitter'                     => ( $opt['twitter'] === true ) ? 1 : 0,
		'strip_category_base'         => ( $opt['stripcategorybase'] === true ) ? 1 : 0,
		'on_front'                    => get_option( 'show_on_front' ),
		'wmt_alexa'                   => ( ! empty( $opt['alexaverify'] ) ) ? 1 : 0,
		'wmt_bing'                    => ( ! empty( $opt['msverify'] ) ) ? 1 : 0,
		'wmt_google'                  => ( ! empty( $opt['googleverify'] ) ) ? 1 : 0,
		'wmt_pinterest'               => ( ! empty( $opt['pinterestverify'] ) ) ? 1 : 0,
		'wmt_yandex'                  => ( ! empty( $opt['yandexverify'] ) ) ? 1 : 0,
		'permalinks_clean'            => ( $opt['cleanpermalinks'] == 1 ) ? 1 : 0,
		'site_db_charset'             => DB_CHARSET,
		'webserver_apache'            => WPSEO_Utils::is_apache() ? 1 : 0,
		'webserver_apache_version'    => function_exists( 'apache_get_version' ) ? apache_get_version() : 0,
		'webserver_nginx'             => WPSEO_Utils::is_nginx() ? 1 : 0,
		'webserver_server_software'   => $_SERVER['SERVER_SOFTWARE'],
		'webserver_gateway_interface' => $_SERVER['GATEWAY_INTERFACE'],
		'webserver_server_protocol'   => $_SERVER['SERVER_PROTOCOL'],
		'php_version'                 => phpversion(),
		'php_max_execution_time'      => ini_get( 'max_execution_time' ),
		'php_memory_limit'            => ini_get( 'memory_limit' ),
		'php_open_basedir'            => ini_get( 'open_basedir' ),
		'php_bcmath_enabled'          => extension_loaded( 'bcmath' ) ? 1 : 0,
		'php_ctype_enabled'           => extension_loaded( 'ctype' ) ? 1 : 0,
		'php_curl_enabled'            => extension_loaded( 'curl' ) ? 1 : 0,
		'php_curl_version_a'          => phpversion( 'curl' ),
		'php_curl'                    => ( ! is_null( $curl ) ) ? $curl['version'] : 0,
		'php_dom_enabled'             => extension_loaded( 'dom' ) ? 1 : 0,
		'php_dom_version'             => phpversion( 'dom' ),
		'php_filter_enabled'          => extension_loaded( 'filter' ) ? 1 : 0,
		'php_mbstring_enabled'        => extension_loaded( 'mbstring' ) ? 1 : 0,
		'php_mbstring_version'        => phpversion( 'mbstring' ),
		'php_pcre_enabled'            => extension_loaded( 'pcre' ) ? 1 : 0,
		'php_pcre_version'            => phpversion( 'pcre' ),
		'php_pcre_with_utf8_a'        => @preg_match( '/^.{1}$/u', 'ñ', $UTF8_ar ),
		'php_pcre_with_utf8_b'        => defined( 'PREG_BAD_UTF8_ERROR' ),
		'php_spl_enabled'             => extension_loaded( 'spl' ) ? 1 : 0,
	);

	return $options;
}

add_filter( 'yoast_tracking_filters', 'wpseo_tracking_additions' );
