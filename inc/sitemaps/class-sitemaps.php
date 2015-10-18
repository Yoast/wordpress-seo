<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Class WPSEO_Sitemaps
 *
 * TODO This class could use a general description with some explanation on sitemaps. OR.
 */
class WPSEO_Sitemaps {

	/** @var string $sitemap Content of the sitemap to output. */
	protected $sitemap = '';

	/** @var bool $bad_sitemap Flag to indicate if this is an invalid or empty sitemap. */
	public $bad_sitemap = false;

	/** @var bool $transient Whether or not the XML sitemap was served from a transient or not. */
	private $transient = false;

	/** @var int $max_entries The maximum number of entries per sitemap page. */
	private $max_entries;

	/** @var string $http_protocol HTTP protocol to use in headers. */
	protected $http_protocol = 'HTTP/1.1';

	/** @var int $current_page Holds the n variable. */
	private $current_page = 1;

	/** @var WPSEO_Sitemap_Timezone $timezone */
	private $timezone;

	/** @var WPSEO_Sitemaps_Router $router */
	public $router;

	/** @var WPSEO_Sitemaps_Renderer $renderer  */
	public $renderer;

	/** @var WPSEO_Sitemap_Provider[] $providers */
	public $providers;

	/**
	 * Class constructor
	 */
	public function __construct() {

		add_action( 'after_setup_theme', array( $this, 'reduce_query_load' ), 99 );
		add_action( 'pre_get_posts', array( $this, 'redirect' ), 1 );
		add_action( 'wpseo_hit_sitemap_index', array( $this, 'hit_sitemap_index' ) );

		$options           = WPSEO_Options::get_all();
		$this->max_entries = $options['entries-per-page'];
		$this->timezone    = new WPSEO_Sitemap_Timezone();
		$this->router      = new WPSEO_Sitemaps_Router();
		$this->renderer    = new WPSEO_Sitemaps_Renderer();
		$this->providers   = array( // TODO API for add/remove. R.
			new WPSEO_Post_Type_Sitemap_Provider(),
			new WPSEO_Taxonomy_Sitemap_Provider(),
			new WPSEO_Author_Sitemap_Provider(),
		);

		if ( ! empty( $_SERVER['SERVER_PROTOCOL'] ) ) {
			$this->http_protocol = sanitize_text_field( $_SERVER['SERVER_PROTOCOL'] );
		}
	}

	/**
	 * Check the current request URI, if we can determine it's probably an XML sitemap, kill loading the widgets
	 */
	public function reduce_query_load() {

		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return;
		}

		$request_uri = $_SERVER['REQUEST_URI'];
		$extension   = substr( $request_uri, -4 );

		if ( false !== stripos( $request_uri, 'sitemap' ) && in_array( $extension, array( '.xml', '.xsl' ) ) ) {
			remove_all_actions( 'widgets_init' );
		}
	}

	/**
	 * Register your own sitemap. Call this during 'init'.
	 *
	 * @param string   $name     The name of the sitemap.
	 * @param callback $function Function to build your sitemap.
	 * @param string   $rewrite  Optional. Regular expression to match your sitemap with.
	 */
	public function register_sitemap( $name, $function, $rewrite = '' ) {
		add_action( 'wpseo_do_sitemap_' . $name, $function );
		if ( ! empty( $rewrite ) ) {
			add_rewrite_rule( $rewrite, 'index.php?sitemap=' . $name, 'top' );
		}
	}

	/**
	 * Register your own XSL file. Call this during 'init'.
	 *
	 * @param string   $name     The name of the XSL file.
	 * @param callback $function Function to build your XSL file.
	 * @param string   $rewrite  Optional. Regular expression to match your sitemap with.
	 */
	public function register_xsl( $name, $function, $rewrite = '' ) {
		add_action( 'wpseo_xsl_' . $name, $function );
		if ( ! empty( $rewrite ) ) {
			add_rewrite_rule( $rewrite, 'index.php?xsl=' . $name, 'top' );
		}
	}

	/**
	 * Set the sitemap current page to allow creating partial sitemaps with wp-cli
	 * in a one-off process.
	 *
	 * @param integer $current_page The part that should be generated.
	 */
	public function set_n( $current_page ) {
		if ( is_scalar( $current_page ) && intval( $current_page ) > 0 ) {
			$this->current_page = intval( $current_page );
		}
	}

	/**
	 * Set the sitemap content to display after you have generated it.
	 *
	 * @param string $sitemap The generated sitemap to output.
	 */
	public function set_sitemap( $sitemap ) {
		$this->sitemap = $sitemap;
	}

	/**
	 * Set as true to make the request 404. Used stop the display of empty sitemaps or invalid requests.
	 *
	 * @param bool $bool Is this a bad request. True or false.
	 */
	public function set_bad_sitemap( $bool ) {
		$this->bad_sitemap = (bool) $bool;
	}

	/**
	 * Prevent stupid plugins from running shutdown scripts when we're obviously not outputting HTML.
	 *
	 * @since 1.4.16
	 */
	public function sitemap_close() {
		remove_all_actions( 'wp_footer' );
		die();
	}

	/**
	 * Hijack requests for potential sitemaps and XSL files.
	 *
	 * @param \WP_Query $query Main query instance.
	 */
	public function redirect( $query ) {

		if ( ! $query->is_main_query() ) {
			return;
		}

		$xsl = get_query_var( 'xsl' );

		if ( ! empty( $xsl ) ) {
			$this->xsl_output( $xsl );
			$this->sitemap_close();

			return;
		}

		$type = get_query_var( 'sitemap' );

		if ( empty( $type ) ) {
			return;
		}

		$this->set_n( get_query_var( 'sitemap_n' ) );

		/**
		 * Filter: 'wpseo_enable_xml_sitemap_transient_caching' - Allow disabling the transient cache
		 *
		 * @api bool $unsigned Enable cache or not, defaults to true
		 */
		$caching = apply_filters( 'wpseo_enable_xml_sitemap_transient_caching', true );

		if ( $caching ) {
			do_action( 'wpseo_sitemap_stylesheet_cache_' . $type, $this );
			$this->sitemap   = get_transient( 'wpseo_sitemap_cache_' . $type . '_' . $this->current_page );
			$this->transient = ! empty( $this->sitemap );
		}

		if ( empty( $this->sitemap ) ) {
			$this->build_sitemap( $type );
		}

		if ( $this->bad_sitemap ) {
			$query->set_404();
			status_header( 404 );

			return;
		}

		if ( $caching && ! $this->transient ) {
			set_transient( 'wpseo_sitemap_cache_' . $type . '_' . $this->current_page, $this->sitemap, DAY_IN_SECONDS );
		}

		$this->output();
		$this->sitemap_close();
	}

	/**
	 * Attempts to build the requested sitemap.
	 *
	 * Sets $bad_sitemap if this isn't for the root sitemap, a post type or taxonomy.
	 *
	 * @param string $type The requested sitemap's identifier.
	 */
	public function build_sitemap( $type ) {

		// TODO document filter. OR.
		$type = apply_filters( 'wpseo_build_sitemap_post_type', $type );

		if ( $type === '1' ) {
			$this->build_root_map();
			return;
		}

		foreach ( $this->providers as $provider ) {
			if ( ! $provider->handles_type( $type ) ) {
				continue;
			}

			$links = $provider->get_sitemap_links( $type, $this->max_entries, $this->current_page );

			if ( empty( $links ) ) {
				$this->bad_sitemap = true;

				return;
			}

			$this->sitemap = $this->renderer->get_sitemap( $links, $type, $this->current_page );

			return;
		}

		if ( has_action( 'wpseo_do_sitemap_' . $type ) ) {
			do_action( 'wpseo_do_sitemap_' . $type );
			return;
		}

		$this->bad_sitemap = true;
	}

	/**
	 * Build the root sitemap (example.com/sitemap_index.xml) which lists sub-sitemaps for other content types.
	 */
	public function build_root_map() {

		$links = array();

		foreach ( $this->providers as $provider ) {
			$links = array_merge( $links, $provider->get_index_links( $this->max_entries ) );
		}

		$this->sitemap = $this->renderer->get_index( $links );
	}

	/**
	 * Function to dynamically filter the change frequency.
	 *
	 * @param string $filter  Expands to wpseo_sitemap_$filter_change_freq, allowing for a change of the frequency for numerous specific URLs.
	 * @param string $default The default value for the frequency.
	 * @param string $url     The URL of the current entry.
	 *
	 * @return mixed|void
	 */
	static public function filter_frequency( $filter, $default, $url ) {
		/**
		 * Filter: 'wpseo_sitemap_' . $filter . '_change_freq' - Allow filtering of the specific change frequency
		 *
		 * @api string $default The default change frequency
		 */
		$change_freq = apply_filters( 'wpseo_sitemap_' . $filter . '_change_freq', $default, $url );

		if ( ! in_array( $change_freq, array(
			'always',
			'hourly',
			'daily',
			'weekly',
			'monthly',
			'yearly',
			'never',
		) )
		) {
			$change_freq = $default;
		}

		return $change_freq;
	}

	/**
	 * Spits out the XSL for the XML sitemap.
	 *
	 * @param string $type Type to output.
	 *
	 * @since 1.4.13
	 */
	public function xsl_output( $type ) {

		if ( $type !== 'main' ) {

			do_action( 'wpseo_xsl_' . $type ); // TODO document action. R.

			return;
		}

		header( $this->http_protocol . ' 200 OK', true, 200 );
		// Prevent the search engines from indexing the XML Sitemap.
		header( 'X-Robots-Tag: noindex, follow', true );
		header( 'Content-Type: text/xml' );

		// Make the browser cache this file properly.
		$expires = YEAR_IN_SECONDS;
		header( 'Pragma: public' );
		header( 'Cache-Control: maxage=' . $expires );
		header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', ( time() + $expires ) ) . ' GMT' );

		require_once( WPSEO_PATH . 'css/xml-sitemap-xsl.php' );
	}

	/**
	 * Spit out the generated sitemap and relevant headers and encoding information.
	 */
	public function output() {

		if ( ! headers_sent() ) {
			header( $this->http_protocol . ' 200 OK', true, 200 );
			// Prevent the search engines from indexing the XML Sitemap.
			header( 'X-Robots-Tag: noindex, follow', true );
			header( 'Content-Type: text/xml' );
		}

		echo $this->renderer->get_output( $this->sitemap, $this->transient );
	}

	/**
	 * Make a request for the sitemap index so as to cache it before the arrival of the search engines.
	 */
	public function hit_sitemap_index() {
		wp_remote_get( wpseo_xml_sitemaps_base_url( 'sitemap_index.xml' ) );
	}

	/**
	 * Get the GMT modification date for the last modified post in the post type.
	 *
	 * @param string|array $post_types Post type or array of types.
	 *
	 * @return string|false
	 */
	static public function get_last_modified_gmt( $post_types ) {

		global $wpdb;

		static $post_type_dates = array();

		if ( ! is_array( $post_types ) ) {
			$post_types = array( $post_types );
		}

		if ( empty( $post_type_dates ) ) {

			$sql             = "
				SELECT post_type, MAX(post_modified_gmt) AS date
				FROM $wpdb->posts
				WHERE post_status IN ('publish','inherit')
					AND post_type IN ('" . implode( "','", get_post_types( array( 'public' => true ) ) ) . "')
				GROUP BY post_type
				ORDER BY post_modified_gmt DESC
			";
			$results         = $wpdb->get_results( $sql );

			foreach ( $results as $obj ) {
				$post_type_dates[ $obj->post_type ] = $obj->date;
			}
			unset( $sql, $results, $obj );
		}

		$dates = array_intersect_key( $post_type_dates, array_flip( $post_types ) );

		return max( $dates );
	}

	/**
	 * Get the modification date for the last modified post in the post type.
	 *
	 * @param array $post_types Post types to get the last modification date for.
	 *
	 * @return string
	 */
	public function get_last_modified( $post_types ) {

		return $this->timezone->format_date( self::get_last_modified_gmt( $post_types ) );
	}

	/**
	 * Build the `<url>` tag for a given URL.
	 *
	 * @deprecated
	 *
	 * @param array $url Array of parts that make up this entry.
	 *
	 * @return string
	 */
	public function sitemap_url( $url ) {

		return $this->renderer->sitemap_url( $url );
	}

	/**
	 * Set a custom stylesheet for this sitemap. Set to empty to just remove the default stylesheet.
	 *
	 * @deprecated
	 *
	 * @param string $stylesheet Full xml-stylesheet declaration.
	 */
	public function set_stylesheet( $stylesheet ) {
		$this->renderer->set_stylesheet( $stylesheet );
	}
}
