<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'Yoast_Tracking' ) ) {
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
			global $blog_id, $wpdb;

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
					$count           = wp_count_posts( $post_type );
					$pts[$post_type] = $count->publish;
				}
			}
			unset( $post_types );

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
			} else {
				$theme['template'] = '';
			}
			unset( $theme_template );


			$plugins       = array();
			$active_plugin = get_option( 'active_plugins' );
			foreach ( $active_plugin as $plugin_path ) {
				if ( ! function_exists( 'get_plugin_data' ) ) {
					require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
				}

				$plugin_info = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin_path );

				$slug           = str_replace( '/' . basename( $plugin_path ), '', $plugin_path );
				$plugins[$slug] = array(
					'version'    => $plugin_info['Version'],
					'name'       => $plugin_info['Name'],
					'plugin_uri' => $plugin_info['PluginURI'],
					'author'     => $plugin_info['AuthorName'],
					'author_uri' => $plugin_info['AuthorURI'],
				);
			}
			unset( $active_plugins, $plugin_path );

			$data = array(
				'site'     => array(
					'hash'      => $hash,
					'version'   => get_bloginfo( 'version' ),
					'multisite' => is_multisite(),
					'users'     => $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM $wpdb->users INNER JOIN $wpdb->usermeta ON ({$wpdb->users}.ID = {$wpdb->usermeta}.user_id) WHERE 1 = 1 AND ( {$wpdb->usermeta}.meta_key = %s )", 'wp_' . $blog_id . '_capabilities' ) ),
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
				'sslverify' => false
			);

			wp_remote_post( 'https://tracking.yoast.com/', $args );

		}
	} /* End of class */
} /* End of class-exists wrapper */

/**
 * Adds tracking parameters for WP SEO settings. Outside of the main class as the class could also be in use in other plugins.
 *
 * @param array $options
 *
 * @return array
 */
function wpseo_tracking_additions( $options ) {
	$opt = WPSEO_Options::get_all();
	if ( function_exists( 'curl_version' ) ) {
		$curl = curl_version();
	} else {
		$curl = NULL;
	}

	$options['wpseo'] = array(
		'xml_sitemaps'        => ( $opt['enablexmlsitemap'] === true ) ? 1 : 0,
		'force_rewrite'       => ( $opt['forcerewritetitle'] === true ) ? 1 : 0,
		'opengraph'           => ( $opt['opengraph'] === true ) ? 1 : 0,
		'twitter'             => ( $opt['twitter'] === true ) ? 1 : 0,
		'strip_category_base' => ( $opt['stripcategorybase'] === true ) ? 1 : 0,
		'on_front'            => get_option( 'show_on_front' ),
		'php_version'         => phpversion(),
		'php_curl'            => ( ! is_null( $curl ) ) ? $curl['version'] : 0,
		'wmt_alexa'           => ( ! empty( $opt['alexaverify'] ) ) ? 1 : 0,
		'wmt_bing'            => ( ! empty( $opt['msverify'] ) ) ? 1 : 0,
		'wmt_google'          => ( ! empty( $opt['googleverify'] ) ) ? 1 : 0,
		'wmt_pinterest'       => ( ! empty( $opt['pinterestverify'] ) ) ? 1 : 0,
		'wmt_yandex'          => ( ! empty( $opt['yandexverify'] ) ) ? 1 : 0,
		'permalinks_clean'    => ( $opt['cleanpermalinks'] == 1 ) ? 1 : 0
	);

	return $options;
}

add_filter( 'yoast_tracking_filters', 'wpseo_tracking_additions' );