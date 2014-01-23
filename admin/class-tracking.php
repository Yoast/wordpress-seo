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
		 * @var	object	Instance of this class
		 */
		public static $instance;


		/**
		 * Class constructor
		 */
		function __construct() {
			// Constructor is called from WP SEO
			if ( current_filter( 'yoast_tracking' ) ) {
				$this->tracking();
			}
			// Backward compatibility - constructor is called from other Yoast plugin
			else if ( ! has_action( 'yoast_tracking', array( $this, 'tracking' ) ) ) {
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
			// Start of Metrics
			global $blog_id, $wpdb;

			$hash = get_option( 'Yoast_Tracking_Hash' );

			if ( ! isset( $hash ) || ! $hash || empty( $hash ) ) {
				$hash = md5( site_url() );
				update_option( 'Yoast_Tracking_Hash', $hash );
			}

			$data = get_transient( 'yoast_tracking_cache' );
			if ( ! $data ) {

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

				$theme_data = wp_get_theme();
				$theme      = array(
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


				$plugins = array();
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
					'body' => $data,
				);
				wp_remote_post( 'https://tracking.yoast.com/', $args );

				// Store for a week, then push data again.
				set_transient( 'yoast_tracking_cache', true, 7 * 60 * 60 * 24 );
			}
		}
	} /* End of class */
} /* End of class-exists wrapper */

/**
 * Adds tracking parameters for WP SEO settings. Outside of the main class as the class could also be in use in other plugins.
 *
 * @param array $options
 * @return array
 */
function wpseo_tracking_additions( $options ) {
	$opt = WPSEO_Options::get_all();

	$options['wpseo'] = array(
		'xml_sitemaps'        => ( $opt['enablexmlsitemap'] === true ) ? 1 : 0,
		'force_rewrite'       => ( $opt['forcerewritetitle'] === true ) ? 1 : 0,
		'opengraph'           => ( $opt['opengraph'] === true ) ? 1 : 0,
		'twitter'             => ( $opt['twitter'] === true ) ? 1 : 0,
		'strip_category_base' => ( $opt['stripcategorybase'] === true ) ? 1 : 0,
		'on_front'            => get_option( 'show_on_front' ),
	);
	return $options;
}

add_filter( 'yoast_tracking_filters', 'wpseo_tracking_additions' );