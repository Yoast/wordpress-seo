<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Class WPSEO_Sitemaps.
 *
 * @todo This class could use a general description with some explanation on sitemaps. OR.
 */
class WPSEO_Sitemaps {

	/**
	 * Sitemap index identifier.
	 *
	 * @var string
	 */
	const SITEMAP_INDEX_TYPE = '1';

	/**
	 * Content of the sitemap to output.
	 *
	 * @var string
	 */
	protected $sitemap = '';

	/**
	 * Flag to indicate if this is an invalid or empty sitemap.
	 *
	 * @var bool
	 */
	public $bad_sitemap = false;

	/**
	 * Whether or not the XML sitemap was served from a transient or not.
	 *
	 * @var bool
	 */
	private $transient = false;

	/**
	 * HTTP protocol to use in headers.
	 *
	 * @since 3.2
	 *
	 * @var string
	 */
	protected $http_protocol = 'HTTP/1.1';

	/**
	 * Holds the n variable.
	 *
	 * @var int
	 */
	private $current_page = 1;

	/**
	 * The sitemaps router.
	 *
	 * @since 3.2
	 *
	 * @var WPSEO_Sitemaps_Router
	 */
	public $router;

	/**
	 * The sitemap renderer.
	 *
	 * @since 3.2
	 *
	 * @var WPSEO_Sitemaps_Renderer
	 */
	public $renderer;

	/**
	 * The sitemap providers.
	 *
	 * @since 3.2
	 *
	 * @var WPSEO_Sitemap_Provider[]
	 */
	public $providers;

	/**
	 * Class constructor.
	 */
	public function __construct() {

		add_action( 'after_setup_theme', [ $this, 'init_sitemaps_providers' ] );
		add_action( 'after_setup_theme', [ $this, 'reduce_query_load' ], 99 );
		add_action( 'pre_get_posts', [ $this, 'redirect' ], 1 );
		add_action( 'wpseo_ping_search_engines', [ __CLASS__, 'ping_search_engines' ] );

		$this->router   = new WPSEO_Sitemaps_Router();
		$this->renderer = new WPSEO_Sitemaps_Renderer();

		if ( ! empty( $_SERVER['SERVER_PROTOCOL'] ) ) {
			$this->http_protocol = sanitize_text_field( wp_unslash( $_SERVER['SERVER_PROTOCOL'] ) );
		}
	}

	/**
	 * Initialize sitemap providers classes.
	 *
	 * @since 5.3
	 */
	public function init_sitemaps_providers() {

		$this->providers = [
			new WPSEO_Post_Type_Sitemap_Provider(),
			new WPSEO_Taxonomy_Sitemap_Provider(),
			new WPSEO_Author_Sitemap_Provider(),
		];

		$external_providers = apply_filters( 'wpseo_sitemaps_providers', [] );

		foreach ( $external_providers as $provider ) {
			if ( is_object( $provider ) && $provider instanceof WPSEO_Sitemap_Provider ) {
				$this->providers[] = $provider;
			}
		}
	}

	/**
	 * Check the current request URI, if we can determine it's probably an XML sitemap, kill loading the widgets.
	 */
	public function reduce_query_load() {
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return;
		}
		$request_uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
		$extension   = substr( $request_uri, -4 );
		if ( stripos( $request_uri, 'sitemap' ) !== false && in_array( $extension, [ '.xml', '.xsl' ], true ) ) {
			remove_all_actions( 'widgets_init' );
		}
	}

	/**
	 * Register your own sitemap. Call this during 'init'.
	 *
	 * @param string   $name              The name of the sitemap.
	 * @param callback $building_function Function to build your sitemap.
	 * @param string   $rewrite           Optional. Regular expression to match your sitemap with.
	 */
	public function register_sitemap( $name, $building_function, $rewrite = '' ) {
		add_action( 'wpseo_do_sitemap_' . $name, $building_function );
		if ( ! empty( $rewrite ) ) {
			add_rewrite_rule( $rewrite, 'index.php?sitemap=' . $name, 'top' );
		}
	}

	/**
	 * Register your own XSL file. Call this during 'init'.
	 *
	 * @since 1.4.23
	 *
	 * @param string   $name              The name of the XSL file.
	 * @param callback $building_function Function to build your XSL file.
	 * @param string   $rewrite           Optional. Regular expression to match your sitemap with.
	 */
	public function register_xsl( $name, $building_function, $rewrite = '' ) {
		add_action( 'wpseo_xsl_' . $name, $building_function );
		if ( ! empty( $rewrite ) ) {
			add_rewrite_rule( $rewrite, 'index.php?yoast-sitemap-xsl=' . $name, 'top' );
		}
	}

	/**
	 * Set the sitemap current page to allow creating partial sitemaps with WP-CLI
	 * in a one-off process.
	 *
	 * @param int $current_page The part that should be generated.
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
	 * @param bool $is_bad Is this a bad request. True or false.
	 */
	public function set_bad_sitemap( $is_bad ) {
		$this->bad_sitemap = (bool) $is_bad;
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

		$yoast_sitemap_xsl = get_query_var( 'yoast-sitemap-xsl' );

		if ( ! empty( $yoast_sitemap_xsl ) ) {
			/*
			 * This is a method to provide the XSL via the home_url.
			 * Needed when the site_url and home_url are not the same.
			 * Loading the XSL needs to come from the same domain, protocol and port as the XML.
			 *
			 * Whenever home_url and site_url are the same, the file can be loaded directly.
			 */
			$this->xsl_output( $yoast_sitemap_xsl );
			$this->sitemap_close();

			return;
		}

		$type = get_query_var( 'sitemap' );

		if ( empty( $type ) ) {
			return;
		}

		$this->set_n( get_query_var( 'sitemap_n' ) );

		$this->build_sitemap( $type );

		if ( $this->bad_sitemap ) {
			$query->set_404();
			status_header( 404 );

			return;
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

		/**
		 * Filter the type of sitemap to build.
		 *
		 * @param string $type Sitemap type, determined by the request.
		 */
		$type = apply_filters( 'wpseo_build_sitemap_post_type', $type );

		if ( $type === '1' ) {
			$this->build_root_map();

			return;
		}

		$entries_per_page = $this->get_entries_per_page();

		foreach ( $this->providers as $provider ) {
			if ( ! $provider->handles_type( $type ) ) {
				continue;
			}

			try {
				$links = $provider->get_sitemap_links( $type, $entries_per_page, $this->current_page );
			} catch ( OutOfBoundsException $exception ) {
				$this->bad_sitemap = true;

				return;
			}

			$this->sitemap = $this->renderer->get_sitemap( $links, $type, $this->current_page );

			return;
		}

		if ( has_action( 'wpseo_do_sitemap_' . $type ) ) {
			/**
			 * Fires custom handler, if hooked to generate sitemap for the type.
			 */
			do_action( 'wpseo_do_sitemap_' . $type );

			return;
		}

		$this->bad_sitemap = true;
	}

	/**
	 * Build the root sitemap (example.com/sitemap_index.xml) which lists sub-sitemaps for other content types.
	 */
	public function build_root_map() {

		$links            = [];
		$entries_per_page = $this->get_entries_per_page();

		foreach ( $this->providers as $provider ) {
			$links = array_merge( $links, $provider->get_index_links( $entries_per_page ) );
		}

		/**
		 * Filter the sitemap links array before the index sitemap is built.
		 *
		 * @param array  $links Array of sitemap links
		 */
		$links = apply_filters( 'wpseo_sitemap_index_links', $links );

		if ( empty( $links ) ) {
			$this->bad_sitemap = true;
			$this->sitemap     = '';

			return;
		}

		$this->sitemap = $this->renderer->get_index( $links );
	}

	/**
	 * Spits out the XSL for the XML sitemap.
	 *
	 * @since 1.4.13
	 *
	 * @param string $type Type to output.
	 */
	public function xsl_output( $type ) {

		if ( $type !== 'main' ) {

			/**
			 * Fires for the output of XSL for XML sitemaps, other than type "main".
			 */
			do_action( 'wpseo_xsl_' . $type );

			return;
		}

		header( $this->http_protocol . ' 200 OK', true, 200 );
		// Prevent the search engines from indexing the XML Sitemap.
		header( 'X-Robots-Tag: noindex, follow', true );
		header( 'Content-Type: text/xml' );

		// Make the browser cache this file properly.
		$expires = YEAR_IN_SECONDS;
		header( 'Pragma: public' );
		header( 'Cache-Control: max-age=' . $expires );
		header( 'Expires: ' . YoastSEO()->helpers->date->format_timestamp( ( time() + $expires ), 'D, d M Y H:i:s' ) . ' GMT' );

		// Don't use WP_Filesystem() here because that's not initialized yet. See https://yoast.atlassian.net/browse/QAK-2043.
		readfile( WPSEO_PATH . 'css/main-sitemap.xsl' );
	}

	/**
	 * Spit out the generated sitemap.
	 */
	public function output() {
		$this->send_headers();
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaping sitemap as either xml or html results in empty document.
		echo $this->renderer->get_output( $this->sitemap );
	}

	/**
	 * Notify search engines of the updated sitemap.
	 *
	 * @param string|null $url Optional URL to make the ping for.
	 */
	public static function ping_search_engines( $url = null ) {

		/**
		 * Filter: 'wpseo_allow_xml_sitemap_ping' - Check if pinging is not allowed (allowed by default)
		 *
		 * @api boolean $allow_ping The boolean that is set to true by default.
		 */
		if ( apply_filters( 'wpseo_allow_xml_sitemap_ping', true ) === false ) {
			return;
		}

		if ( get_option( 'blog_public' ) === '0' ) { // Don't ping if blog is not public.
			return;
		}

		if ( empty( $url ) ) {
			$url = rawurlencode( WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' ) );
		}

		// Ping Google and Bing.
		wp_remote_get( 'https://www.google.com/ping?sitemap=' . $url, [ 'blocking' => false ] );
		wp_remote_get( 'https://www.bing.com/ping?sitemap=' . $url, [ 'blocking' => false ] );
	}

	/**
	 * Get the maximum number of entries per XML sitemap.
	 *
	 * @return int The maximum number of entries.
	 */
	protected function get_entries_per_page() {
		/**
		 * Filter the maximum number of entries per XML sitemap.
		 *
		 * After changing the output of the filter, make sure that you disable and enable the
		 * sitemaps to make sure the value is picked up for the sitemap cache.
		 *
		 * @param int $entries The maximum number of entries per XML sitemap.
		 */
		$entries = (int) apply_filters( 'Yoast\WP\SEO\xml_sitemaps_entries_per_sitemap', 5000 );

		return $entries;
	}

	/**
	 * Get post statuses for post_type or the root sitemap.
	 *
	 * @since 10.2
	 *
	 * @param string $type Provide a type for a post_type sitemap, SITEMAP_INDEX_TYPE for the root sitemap.
	 *
	 * @return array List of post statuses.
	 */
	public static function get_post_statuses( $type = self::SITEMAP_INDEX_TYPE ) {
		/**
		 * Filter post status list for sitemap query for the post type.
		 *
		 * @param array  $post_statuses Post status list, defaults to array( 'publish' ).
		 * @param string $type          Post type or SITEMAP_INDEX_TYPE.
		 */
		$post_statuses = apply_filters( 'wpseo_sitemap_post_statuses', [ 'publish' ], $type );

		if ( ! is_array( $post_statuses ) || empty( $post_statuses ) ) {
			$post_statuses = [ 'publish' ];
		}

		if ( ( $type === self::SITEMAP_INDEX_TYPE || $type === 'attachment' )
			&& ! in_array( 'inherit', $post_statuses, true )
		) {
			$post_statuses[] = 'inherit';
		}

		return $post_statuses;
	}

	/**
	 * Sends all the required HTTP Headers.
	 */
	private function send_headers() {
		if ( headers_sent() ) {
			return;
		}

		$headers = [
			$this->http_protocol . ' 200 OK' => 200,
			// Prevent the search engines from indexing the XML Sitemap.
			'X-Robots-Tag: noindex, follow'  => '',
			'Content-Type: text/xml; charset=' . esc_attr( $this->renderer->get_output_charset() ) => '',
		];

		/**
		 * Filter the HTTP headers we send before an XML sitemap.
		 *
		 * @param array  $headers The HTTP headers we're going to send out.
		 */
		$headers = apply_filters( 'wpseo_sitemap_http_headers', $headers );

		foreach ( $headers as $header => $status ) {
			if ( is_numeric( $status ) ) {
				header( $header, true, $status );
				continue;
			}
			header( $header, true );
		}
	}
}
