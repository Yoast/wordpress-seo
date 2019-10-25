<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Main frontend class for Yoast SEO, responsible for the SEO output as well as removing
 * default WordPress output.
 */
class WPSEO_Frontend {

	const METADESC_PRIORITY = 6;

	/**
	 * Instance of this class.
	 *
	 * @var object
	 */
	public static $instance;

	/**
	 * Toggle indicating whether output buffering has been started.
	 *
	 * @var boolean
	 */
	private $ob_started = false;

	/**
	 * Holds the canonical URL for the current page.
	 *
	 * @var string
	 */
	private $canonical = null;

	/**
	 * Holds the canonical URL for the current page that cannot be overriden by a manual canonical input.
	 *
	 * @var string
	 */
	private $canonical_no_override = null;

	/**
	 * Holds the canonical URL for the current page without pagination.
	 *
	 * @var string
	 */
	private $canonical_unpaged = null;

	/**
	 * An instance of the WPSEO_WooCommerce_Shop_Page class.
	 *
	 * @var WPSEO_WooCommerce_Shop_Page
	 */
	protected $woocommerce_shop_page;

	/**
	 * Class constructor.
	 *
	 * Adds and removes a lot of filters.
	 */
	protected function __construct() {
		add_action( 'wp_head', array( $this, 'front_page_specific_init' ), 0 );

		// The head function here calls action wpseo_head, to which we hook all our functionality.
		add_action( 'wpseo_head', array( $this, 'canonical' ), 20 );
		add_action( 'wpseo_head', array( $this, 'adjacent_rel_links' ), 21 );

		// Remove actions that we will handle through our wpseo_head call, and probably change the output of.
		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		remove_action( 'wp_head', 'noindex', 1 );

		add_filter( 'thematic_doctitle', array( $this, 'title' ), 15 );

		add_action( 'wp', array( $this, 'page_redirect' ), 99 );

		add_action( 'template_redirect', array( $this, 'noindex_robots' ) );

		add_filter( 'loginout', array( $this, 'nofollow_link' ) );
		add_filter( 'register', array( $this, 'nofollow_link' ) );

		// Add support for shortcodes to category descriptions.
		add_filter( 'category_description', array( $this, 'custom_category_descriptions_add_shortcode_support' ) );

		// Fix the WooThemes woo_title() output.
		add_filter( 'woo_title', array( $this, 'fix_woo_title' ), 99 );

		if ( WPSEO_Options::get( 'disable-date', false )
			|| WPSEO_Options::get( 'disable-author', false )
			|| WPSEO_Options::get( 'disable-post_format', false )
		) {
			add_action( 'wp', array( $this, 'archive_redirect' ) );
		}
		add_action( 'template_redirect', array( $this, 'attachment_redirect' ), 1 );

		add_filter( 'the_content_feed', array( $this, 'embed_rssfooter' ) );
		add_filter( 'the_excerpt_rss', array( $this, 'embed_rssfooter_excerpt' ) );

		// For WordPress functions below 4.4.
		if ( WPSEO_Options::get( 'forcerewritetitle', false ) && ! current_theme_supports( 'title-tag' ) ) {
			add_action( 'template_redirect', array( $this, 'force_rewrite_output_buffer' ), 99999 );
			add_action( 'wp_footer', array( $this, 'flush_cache' ), - 1 );
		}

		if ( WPSEO_Options::get( 'title_test', 0 ) > 0 ) {
			add_filter( 'wpseo_title', array( $this, 'title_test_helper' ) );
		}

		$this->woocommerce_shop_page = new WPSEO_WooCommerce_Shop_Page();

		$integrations = array(
			new WPSEO_Frontend_Primary_Category(),
			// new WPSEO_Schema(), // -- Has been moved to SRC directory.
			new WPSEO_Handle_404(),
			// new WPSEO_Remove_Reply_To_Com(), HAS BEEN MOVED TO SRC DIRECTORY!
			new WPSEO_OpenGraph_OEmbed(),
			$this->woocommerce_shop_page,
		);

		foreach ( $integrations as $integration ) {
			$integration->register_hooks();
		}
	}

	/**
	 * Initialize the functions that only need to run on the frontpage.
	 */
	public function front_page_specific_init() {
		if ( ! is_front_page() ) {
			return;
		}

		add_action( 'wpseo_head', array( $this, 'webmaster_tools_authentication' ), 90 );
	}

	/**
	 * Resets the entire class so canonicals, titles etc can be regenerated.
	 */
	public function reset() {
		self::$instance = null;
		foreach ( get_class_vars( __CLASS__ ) as $name => $default ) {
			switch ( $name ) {
				// Clear the class instance to be re-initialized.
				case 'instance':
					self::$instance = null;
					break;

				// Exclude these properties from being reset.
				case 'woocommerce_shop_page':
				case 'default_title':
					break;

				// Reset property to the class default.
				default:
					$this->$name = $default;
					break;
			}
		}
		WPSEO_Options::ensure_options_exist();
	}

	/**
	 * Get the singleton instance of this class.
	 *
	 * @return WPSEO_Frontend
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Override Woo's title with our own.
	 *
	 * @param string $title Title string.
	 *
	 * @return string
	 */
	public function fix_woo_title( $title ) {
		return $this->title( $title );
	}

	/**
	 * Output Webmaster Tools authentication strings.
	 */
	public function webmaster_tools_authentication() {
		// Baidu.
		$this->webmaster_tools_helper( 'baiduverify', 'baidu-site-verification' );

		// Bing.
		$this->webmaster_tools_helper( 'msverify', 'msvalidate.01' );

		// Google.
		$this->webmaster_tools_helper( 'googleverify', 'google-site-verification' );

		// Pinterest.
		$this->webmaster_tools_helper( 'pinterestverify', 'p:domain_verify' );

		// Yandex.
		$this->webmaster_tools_helper( 'yandexverify', 'yandex-verification' );
	}

	/**
	 * Helper function for authentication.
	 *
	 * @param string $option_key Option key.
	 * @param string $tag_name   The tag name.
	 *
	 * @return void
	 */
	private function webmaster_tools_helper( $option_key, $tag_name ) {
		$auth = WPSEO_Options::get( $option_key, '' );
		if ( $auth !== '' ) {
			printf( '<meta name="%1$s" content="%2$s" />' . "\n", $tag_name, $auth );
		}
	}

	/**
	 * Main wrapper function attached to wp_head. This combines all the output on the frontend of the Yoast SEO plugin.
	 */
	public function head() {
		global $wp_query;

		$old_wp_query = null;

		if ( ! $wp_query->is_main_query() ) {
			$old_wp_query = $wp_query;
			wp_reset_query();
		}

		/**
		 * Action: 'wpseo_head' - Allow other plugins to output inside the Yoast SEO section of the head section.
		 */
		do_action( 'wpseo_head' );

		if ( ! empty( $old_wp_query ) ) {
			$GLOBALS['wp_query'] = $old_wp_query;
			unset( $old_wp_query );
		}
	}

	/**
	 * This function normally outputs the canonical but is also used in other places to retrieve
	 * the canonical URL for the current page.
	 *
	 * @param bool $echo        Whether or not to output the canonical element.
	 * @param bool $un_paged    Whether or not to return the canonical with or without pagination added to the URL.
	 * @param bool $no_override Whether or not to return a manually overridden canonical.
	 *
	 * @return string $canonical
	 */
	public function canonical( $echo = true, $un_paged = false, $no_override = false ) {
		if ( is_null( $this->canonical ) ) {
			$this->generate_canonical();
		}

		$canonical = $this->canonical;

		if ( $un_paged ) {
			$canonical = $this->canonical_unpaged;
		}
		elseif ( $no_override ) {
			$canonical = $this->canonical_no_override;
		}

		if ( $echo === false ) {
			return $canonical;
		}

		if ( is_string( $canonical ) && '' !== $canonical ) {
			echo '<link rel="canonical" href="' . esc_url( $canonical, null, 'other' ) . '" />' . "\n";
		}
	}

	/**
	 * This function normally outputs the canonical but is also used in other places to retrieve
	 * the canonical URL for the current page.
	 *
	 * @return void
	 */
	private function generate_canonical() {
		$canonical          = false;
		$canonical_override = false;

		// Set decent canonicals for homepage, singulars and taxonomy pages.
		if ( is_singular() ) {
			$obj       = get_queried_object();
			$canonical = get_permalink( $obj->ID );

			$this->canonical_unpaged = $canonical;

			$canonical_override = $this->get_seo_meta_value( 'canonical' );

			// Fix paginated pages canonical, but only if the page is truly paginated.
			if ( get_query_var( 'page' ) > 1 ) {
				$num_pages = ( substr_count( $obj->post_content, '<!--nextpage-->' ) + 1 );
				if ( $num_pages && get_query_var( 'page' ) <= $num_pages ) {
					if ( ! $GLOBALS['wp_rewrite']->using_permalinks() ) {
						$canonical = add_query_arg( 'page', get_query_var( 'page' ), $canonical );
					}
					else {
						$canonical = user_trailingslashit( trailingslashit( $canonical ) . get_query_var( 'page' ) );
					}
				}
			}
		}
		else {
			if ( is_search() ) {
				$search_query = get_search_query();

				// Regex catches case when /search/page/N without search term is itself mistaken for search term. R.
				if ( ! empty( $search_query ) && ! preg_match( '|^page/\d+$|', $search_query ) ) {
					$canonical = get_search_link();
				}
			}
			elseif ( is_front_page() ) {
				$canonical = WPSEO_Utils::home_url();
			}
			elseif ( WPSEO_Frontend_Page_Type::is_posts_page() ) {

				$posts_page_id = get_option( 'page_for_posts' );
				$canonical     = $this->get_seo_meta_value( 'canonical', $posts_page_id );

				if ( empty( $canonical ) ) {
					$canonical = get_permalink( $posts_page_id );
				}
			}
			elseif ( is_tax() || is_tag() || is_category() ) {

				$term = get_queried_object();

				if ( ! empty( $term ) && ! $this->is_multiple_terms_query() ) {

					$canonical_override = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'canonical' );
					$term_link          = get_term_link( $term, $term->taxonomy );

					if ( ! is_wp_error( $term_link ) ) {
						$canonical = $term_link;
					}
				}
			}
			elseif ( is_post_type_archive() ) {
				$post_type = $this->get_queried_post_type();
				$canonical = get_post_type_archive_link( $post_type );
			}
			elseif ( is_author() ) {
				$canonical = get_author_posts_url( get_query_var( 'author' ), get_query_var( 'author_name' ) );
			}
			elseif ( is_archive() ) {
				if ( is_date() ) {
					if ( is_day() ) {
						$canonical = get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
					}
					elseif ( is_month() ) {
						$canonical = get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) );
					}
					elseif ( is_year() ) {
						$canonical = get_year_link( get_query_var( 'year' ) );
					}
				}
			}

			$this->canonical_unpaged = $canonical;

			if ( $canonical && get_query_var( 'paged' ) > 1 ) {
				global $wp_rewrite;
				if ( ! $wp_rewrite->using_permalinks() ) {
					if ( is_front_page() ) {
						$canonical = trailingslashit( $canonical );
					}
					$canonical = add_query_arg( 'paged', get_query_var( 'paged' ), $canonical );
				}
				else {
					if ( is_front_page() ) {
						$canonical = WPSEO_Sitemaps_Router::get_base_url( '' );
					}
					$canonical = user_trailingslashit( trailingslashit( $canonical ) . trailingslashit( $wp_rewrite->pagination_base ) . get_query_var( 'paged' ) );
				}
			}
		}

		$this->canonical_no_override = $canonical;

		if ( is_string( $canonical ) && $canonical !== '' ) {
			// Force canonical links to be absolute, relative is NOT an option.
			if ( WPSEO_Utils::is_url_relative( $canonical ) === true ) {
				$canonical = $this->base_url( $canonical );
			}
		}

		if ( is_string( $canonical_override ) && $canonical_override !== '' ) {
			$canonical = $canonical_override;
		}

		/**
		 * Filter: 'wpseo_canonical' - Allow filtering of the canonical URL put out by Yoast SEO.
		 *
		 * @api string $canonical The canonical URL.
		 */
		$this->canonical = apply_filters( 'wpseo_canonical', $canonical );
	}

	/**
	 * Parse the home URL setting to find the base URL for relative URLs.
	 *
	 * @param string $path Optional path string.
	 *
	 * @return string
	 */
	private function base_url( $path = null ) {
		$url = get_option( 'home' );

		$parts = wp_parse_url( $url );

		$base_url = trailingslashit( $parts['scheme'] . '://' . $parts['host'] );

		if ( ! is_null( $path ) ) {
			$base_url .= ltrim( $path, '/' );
		}

		return $base_url;
	}

	/**
	 * Adds 'prev' and 'next' links to archives.
	 *
	 * @link  http://googlewebmastercentral.blogspot.com/2011/09/pagination-with-relnext-and-relprev.html
	 * @since 1.0.3
	 */
	public function adjacent_rel_links() {
		/**
		 * Filter: 'wpseo_disable_adjacent_rel_links' - Allows disabling of Yoast adjacent links if this is being handled by other code.
		 *
		 * @api bool $links_generated Indicates if other code has handled adjacent links.
		 */
		if ( true === apply_filters( 'wpseo_disable_adjacent_rel_links', false ) ) {
			return;
		}

		if ( is_singular() ) {
			$this->rel_links_single();
			return;
		}

		$this->rel_links_archive();
	}

	/**
	 * Output the rel next/prev links for a single post / page.
	 *
	 * @return void
	 */
	protected function rel_links_single() {
		$num_pages = 1;

		$queried_object = get_queried_object();
		if ( ! empty( $queried_object ) ) {
			$num_pages = ( substr_count( $queried_object->post_content, '<!--nextpage-->' ) + 1 );
		}

		if ( $num_pages === 1 ) {
			return;
		}

		$page = max( 1, (int) get_query_var( 'page' ) );
		$url  = get_permalink( get_queried_object_id() );

		if ( $page > 1 ) {
			$this->adjacent_rel_link( 'prev', $url, ( $page - 1 ), 'page' );
		}

		if ( $page < $num_pages ) {
			$this->adjacent_rel_link( 'next', $url, ( $page + 1 ), 'page' );
		}
	}

	/**
	 * Output the rel next/prev links for an archive page.
	 */
	protected function rel_links_archive() {
		$url = $this->canonical( false, true, true );

		if ( ! is_string( $url ) || $url === '' ) {
			return;
		}

		$paged = max( 1, (int) get_query_var( 'paged' ) );

		if ( $paged === 2 ) {
			$this->adjacent_rel_link( 'prev', $url, ( $paged - 1 ) );
		}

		// Make sure to use index.php when needed, done after paged == 2 check so the prev links to homepage will not have index.php erroneously.
		if ( is_front_page() ) {
			$url = WPSEO_Sitemaps_Router::get_base_url( '' );
		}

		if ( $paged > 2 ) {
			$this->adjacent_rel_link( 'prev', $url, ( $paged - 1 ) );
		}

		if ( $paged < $GLOBALS['wp_query']->max_num_pages ) {
			$this->adjacent_rel_link( 'next', $url, ( $paged + 1 ) );
		}
	}

	/**
	 * Get adjacent pages link for archives.
	 *
	 * @since 1.0.2
	 * @since 7.1    Added $query_arg parameter for single post/page pagination.
	 *
	 * @param string $rel       Link relationship, prev or next.
	 * @param string $url       The un-paginated URL of the current archive.
	 * @param string $page      The page number to add on to $url for the $link tag.
	 * @param string $query_arg Optional. The argument to use to set for the page to load.
	 *
	 * @return void
	 */
	private function adjacent_rel_link( $rel, $url, $page, $query_arg = 'paged' ) {
		global $wp_rewrite;
		if ( ! $wp_rewrite->using_permalinks() ) {
			if ( $page > 1 ) {
				$url = add_query_arg( $query_arg, $page, $url );
			}
		}
		else {
			if ( $page > 1 ) {
				$url = user_trailingslashit( trailingslashit( $url ) . $this->get_pagination_base() . $page );
			}
		}

		/**
		 * Filter: 'wpseo_adjacent_rel_url' - Allow changing the URL for rel output by Yoast SEO.
		 *
		 * @api string $url The URL that's going to be output for $rel.
		 *
		 * @param string $rel Link relationship, prev or next.
		 */
		$url = apply_filters( 'wpseo_adjacent_rel_url', $url, $rel );

		/**
		 * Filter: 'wpseo_' . $rel . '_rel_link' - Allow changing link rel output by Yoast SEO.
		 *
		 * @api string $unsigned The full `<link` element.
		 */
		$link = apply_filters( 'wpseo_' . $rel . '_rel_link', '<link rel="' . esc_attr( $rel ) . '" href="' . esc_url( $url ) . "\" />\n" );

		if ( is_string( $link ) && $link !== '' ) {
			echo $link;
		}
	}

	/**
	 * Return the base for pagination.
	 *
	 * @return string The pagination base.
	 */
	private function get_pagination_base() {
		// If the current page is the frontpage, pagination should use /base/.
		$base = '';
		if ( ! is_singular() || WPSEO_Frontend_Page_Type::is_home_static_page() ) {
			$base = trailingslashit( $GLOBALS['wp_rewrite']->pagination_base );
		}
		return $base;
	}

	/**
	 * Based on the redirect meta value, this function determines whether it should redirect the current post / page.
	 *
	 * @return boolean
	 */
	public function page_redirect() {
		if ( is_singular() ) {
			global $post;
			if ( ! isset( $post ) || ! is_object( $post ) ) {
				return false;
			}

			$redir = $this->get_seo_meta_value( 'redirect', $post->ID );
			if ( $redir !== '' ) {
				header( 'X-Redirect-By: Yoast SEO' );
				wp_redirect( $redir, 301, 'Yoast SEO' );
				exit;
			}
		}

		return false;
	}

	/**
	 * Send a Robots HTTP header preventing URL from being indexed in the search results while allowing search engines
	 * to follow the links in the object at the URL.
	 *
	 * @since 1.1.7
	 * @return boolean Boolean indicating whether the noindex header was sent.
	 */
	public function noindex_robots() {

		if ( ( is_robots() ) && headers_sent() === false ) {
			header( 'X-Robots-Tag: noindex, follow', true );

			return true;
		}

		return false;
	}

	/**
	 * Adds rel="nofollow" to a link, only used for login / registration links.
	 *
	 * @param string $input The link element as a string.
	 *
	 * @return string
	 */
	public function nofollow_link( $input ) {
		return str_replace( '<a ', '<a rel="nofollow" ', $input );
	}

	/**
	 * When certain archives are disabled, this redirects those to the homepage.
	 *
	 * @return boolean False when no redirect was triggered.
	 */
	public function archive_redirect() {
		global $wp_query;

		if (
			( WPSEO_Options::get( 'disable-date', false ) && $wp_query->is_date ) ||
			( WPSEO_Options::get( 'disable-author', false ) && $wp_query->is_author ) ||
			( WPSEO_Options::get( 'disable-post_format', false ) && $wp_query->is_tax( 'post_format' ) )
		) {
			$this->redirect( get_bloginfo( 'url' ), 301 );

			return true;
		}

		return false;
	}

	/**
	 * If the option to disable attachment URLs is checked, this performs the redirect to the attachment.
	 *
	 * @return bool Returns succes status.
	 */
	public function attachment_redirect() {
		if ( WPSEO_Options::get( 'disable-attachment', false ) === false ) {
			return false;
		}
		if ( ! is_attachment() ) {
			return false;
		}

		/**
		 * Allow the developer to change the target redirection URL for attachments.
		 *
		 * @api   string $attachment_url The attachment URL for the queried object.
		 * @api   object $queried_object The queried object.
		 *
		 * @since 7.5.3
		 */
		$url = apply_filters( 'wpseo_attachment_redirect_url', wp_get_attachment_url( get_queried_object_id() ), get_queried_object() );


		if ( ! empty( $url ) ) {
			$this->do_attachment_redirect( $url );

			return true;
		}

		return false;
	}

	/**
	 * Performs the redirect from the attachment page to the image file itself.
	 *
	 * @param string $attachment_url The attachment image url.
	 *
	 * @return void
	 */
	public function do_attachment_redirect( $attachment_url ) {
		header( 'X-Redirect-By: Yoast SEO' );
		wp_redirect( $attachment_url, 301, 'Yoast SEO' );
		exit;
	}

	/**
	 * Replaces the possible RSS variables with their actual values.
	 *
	 * @param string $content The RSS content that should have the variables replaced.
	 *
	 * @return string
	 */
	public function rss_replace_vars( $content ) {
		global $post;

		/**
		 * Allow the developer to determine whether or not to follow the links in the bits Yoast SEO adds to the RSS feed, defaults to true.
		 *
		 * @api   bool $unsigned Whether or not to follow the links in RSS feed, defaults to true.
		 *
		 * @since 1.4.20
		 */
		$no_follow      = apply_filters( 'nofollow_rss_links', true );
		$no_follow_attr = '';
		if ( $no_follow === true ) {
			$no_follow_attr = 'rel="nofollow" ';
		}

		$author_link = '';
		if ( is_object( $post ) ) {
			$author_link = '<a ' . $no_follow_attr . 'href="' . esc_url( get_author_posts_url( $post->post_author ) ) . '">' . esc_html( get_the_author() ) . '</a>';
		}

		$post_link      = '<a ' . $no_follow_attr . 'href="' . esc_url( get_permalink() ) . '">' . esc_html( get_the_title() ) . '</a>';
		$blog_link      = '<a ' . $no_follow_attr . 'href="' . esc_url( get_bloginfo( 'url' ) ) . '">' . esc_html( get_bloginfo( 'name' ) ) . '</a>';
		$blog_desc_link = '<a ' . $no_follow_attr . 'href="' . esc_url( get_bloginfo( 'url' ) ) . '">' . esc_html( get_bloginfo( 'name' ) ) . ' - ' . esc_html( get_bloginfo( 'description' ) ) . '</a>';

		$content = stripslashes( trim( $content ) );
		$content = str_replace( '%%AUTHORLINK%%', $author_link, $content );
		$content = str_replace( '%%POSTLINK%%', $post_link, $content );
		$content = str_replace( '%%BLOGLINK%%', $blog_link, $content );
		$content = str_replace( '%%BLOGDESCLINK%%', $blog_desc_link, $content );

		return $content;
	}

	/**
	 * Adds the RSS footer (or header) to the full RSS feed item.
	 *
	 * @param string $content Feed item content.
	 *
	 * @return string
	 */
	public function embed_rssfooter( $content ) {
		return $this->embed_rss( $content, 'full' );
	}

	/**
	 * Adds the RSS footer (or header) to the excerpt RSS feed item.
	 *
	 * @param string $content Feed item excerpt.
	 *
	 * @return string
	 */
	public function embed_rssfooter_excerpt( $content ) {
		return $this->embed_rss( $content, 'excerpt' );
	}

	/**
	 * Adds the RSS footer and/or header to an RSS feed item.
	 *
	 * @since 1.4.14
	 *
	 * @param string $content Feed item content.
	 * @param string $context Feed item context, either 'excerpt' or 'full'.
	 *
	 * @return string
	 */
	public function embed_rss( $content, $context = 'full' ) {

		/**
		 * Filter: 'wpseo_include_rss_footer' - Allow the RSS footer to be dynamically shown/hidden.
		 *
		 * @api boolean $show_embed Indicates if the RSS footer should be shown or not.
		 *
		 * @param string $context The context of the RSS content - 'full' or 'excerpt'.
		 */
		if ( ! apply_filters( 'wpseo_include_rss_footer', true, $context ) ) {
			return $content;
		}

		if ( is_feed() ) {
			$before = '';
			$after  = '';

			if ( WPSEO_Options::get( 'rssbefore', '' ) !== '' ) {
				$before = wpautop( $this->rss_replace_vars( WPSEO_Options::get( 'rssbefore' ) ) );
			}
			if ( WPSEO_Options::get( 'rssafter', '' ) !== '' ) {
				$after = wpautop( $this->rss_replace_vars( WPSEO_Options::get( 'rssafter' ) ) );
			}
			if ( $before !== '' || $after !== '' ) {
				if ( ( isset( $context ) && $context === 'excerpt' ) && trim( $content ) !== '' ) {
					$content = wpautop( $content );
				}
				$content = $before . $content . $after;
			}
		}

		return $content;
	}

	/**
	 * Used in the force rewrite functionality this retrieves the output, replaces the title with the proper SEO
	 * title and then flushes the output.
	 */
	public function flush_cache() {

		global $wp_query;

		if ( $this->ob_started !== true ) {
			return false;
		}

		$content = ob_get_clean();

		$old_wp_query = $wp_query;

		wp_reset_query();

		$GLOBALS['wp_query'] = $old_wp_query;

		echo $content;

		return true;
	}

	/**
	 * Starts the output buffer so it can later be fixed by flush_cache().
	 */
	public function force_rewrite_output_buffer() {
		$this->ob_started = true;
		ob_start();
	}

	/**
	 * Check if this plugin is the premium version of WPSEO.
	 *
	 * @return bool
	 */
	protected function is_premium() {
		return WPSEO_Utils::is_yoast_seo_premium();
	}

	/**
	 * Check if term archive query is for multiple terms (/term-1,term2/ or /term-1+term-2/).
	 *
	 * @return bool
	 */
	protected function is_multiple_terms_query() {
		global $wp_query;

		if ( ! is_tax() && ! is_tag() && ! is_category() ) {
			return false;
		}

		$term          = get_queried_object();
		$queried_terms = $wp_query->tax_query->queried_terms;

		if ( empty( $queried_terms[ $term->taxonomy ]['terms'] ) ) {
			return false;
		}

		return count( $queried_terms[ $term->taxonomy ]['terms'] ) > 1;
	}

	/**
	 * Wraps wp_safe_redirect to allow testing for redirects.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   Status code to use.
	 */
	public function redirect( $location, $status = 302 ) {
		header( 'X-Redirect-By: Yoast SEO' );
		wp_safe_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}

	/**
	 * Retrieves a template from the options.
	 *
	 * @param string $template The template to retrieve.
	 *
	 * @return string The set template.
	 */
	protected function get_template( $template ) {
		return WPSEO_Options::get( $template );
	}

	/**
	 * Retrieves the queried post type.
	 *
	 * @return string The queried post type.
	 */
	protected function get_queried_post_type() {
		$post_type = get_query_var( 'post_type' );
		if ( is_array( $post_type ) ) {
			$post_type = reset( $post_type );
		}

		return $post_type;
	}

	/**
	 * Retrieves the SEO Meta value for the supplied key and optional post.
	 *
	 * @param string $key     The key to retrieve.
	 * @param int    $post_id Optional. The post to retrieve the key for.
	 *
	 * @return string Meta value.
	 */
	protected function get_seo_meta_value( $key, $post_id = 0 ) {
		return WPSEO_Meta::get_value( $key, $post_id );
	}

	/**
	 * Replaces the dynamic variables in a string.
	 *
	 * @param string $string The string to replace the variables in.
	 * @param array  $args   The object some of the replacement values might come from,
	 *                       could be a post, taxonomy or term.
	 * @param array  $omit   Variables that should not be replaced by this function.
	 *
	 * @return string The replaced string.
	 */
	protected function replace_vars( $string, $args, $omit = array() ) {
		$replacer = new WPSEO_Replace_Vars();

		return $replacer->replace( $string, $args, $omit );
	}

	/**
	 * Adds shortcode support to category descriptions.
	 *
	 * @param string $desc String to add shortcodes in.
	 *
	 * @return string Content with shortcodes filtered out.
	 */
	public function custom_category_descriptions_add_shortcode_support( $desc ) {
		// Wrap in output buffering to prevent shortcodes that echo stuff instead of return from breaking things.
		ob_start();
		$desc = do_shortcode( $desc );
		ob_end_clean();
		return $desc;
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Outputs the meta keywords element.
	 *
	 * @deprecated 6.3
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function metakeywords() {
		if ( function_exists( 'wp_get_current_user' ) && current_user_can( 'manage_options' ) ) {
			_deprecated_function( 'WPSEO_Frontend::metakeywords', '6.3' );
		}
	}

	/**
	 * Removes unneeded query variables from the URL.
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function clean_permalink() {
		// As this is a frontend method, we want to make sure it is not displayed for non-logged in users.
		if ( function_exists( 'wp_get_current_user' ) && current_user_can( 'manage_options' ) ) {
			_deprecated_function( 'WPSEO_Frontend::clean_permalink', '7.0' );
		}
	}

	/**
	 * Trailing slashes for everything except is_single().
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 */
	public function add_trailingslash() {
		// As this is a frontend method, we want to make sure it is not displayed for non-logged in users.
		if ( function_exists( 'wp_get_current_user' ) && current_user_can( 'manage_options' ) ) {
			_deprecated_function( 'WPSEO_Frontend::add_trailingslash', '7.0', null );
		}
	}

	/**
	 * Removes the ?replytocom variable from the link, replacing it with a #comment-<number> anchor.
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 *
	 * @param string $link The comment link as a string.
	 *
	 * @return string The modified link.
	 */
	public function remove_reply_to_com( $link ) {
		_deprecated_function( 'WPSEO_Frontend::remove_reply_to_com', '7.0', 'WPSEO_Remove_Reply_To_Com::remove_reply_to_com' );

		$remove_replytocom = new WPSEO_Remove_Reply_To_Com();
		return $remove_replytocom->remove_reply_to_com( $link );
	}

	/**
	 * Redirects out the ?replytocom variables.
	 *
	 * @deprecated 7.0
	 * @codeCoverageIgnore
	 *
	 * @return boolean True when redirect has been done.
	 */
	public function replytocom_redirect() {
		_deprecated_function( 'WPSEO_Frontend::replytocom_redirect', '7.0', 'WPSEO_Remove_Reply_To_Com::replytocom_redirect' );

		$remove_replytocom = new WPSEO_Remove_Reply_To_Com();
		return $remove_replytocom->replytocom_redirect();
	}

	/**
	 * Determine whether this is the homepage and shows posts.
	 *
	 * @deprecated 7.7
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not the current page is the homepage that displays posts.
	 */
	public function is_home_posts_page() {
		_deprecated_function( __FUNCTION__, '7.7', 'WPSEO_Frontend_Page_Type::is_home_posts_page' );

		return WPSEO_Frontend_Page_Type::is_home_posts_page();
	}

	/**
	 * Determine whether the this is the static frontpage.
	 *
	 * @deprecated 7.7
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not the current page is a static frontpage.
	 */
	public function is_home_static_page() {
		_deprecated_function( __FUNCTION__, '7.7', 'WPSEO_Frontend_Page_Type::is_home_static_page' );

		return WPSEO_Frontend_Page_Type::is_home_static_page();
	}

	/**
	 * Determine whether this is the posts page, when it's not the frontpage.
	 *
	 * @deprecated 7.7
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not it's a non-frontpage, posts page.
	 */
	public function is_posts_page() {
		_deprecated_function( __FUNCTION__, '7.7', 'WPSEO_Frontend_Page_Type::is_posts_page' );

		return WPSEO_Frontend_Page_Type::is_posts_page();
	}

	/**
	 * Function used in testing whether the title should be force rewritten or not.
	 *
	 * @deprecated 9.6
	 * @codeCoverageIgnore
	 *
	 * @param string $title Title string.
	 *
	 * @return string
	 */
	public function title_test_helper( $title ) {
		_deprecated_function( __METHOD__, 'WPSEO 9.6' );

		return $title;
	}

	/**
	 * Output the rel=publisher code on every page of the site.
	 *
	 * @deprecated 10.1.3
	 * @codeCoverageIgnore
	 *
	 * @return boolean Boolean indicating whether the publisher link was printed.
	 */
	public function publisher() {
		_deprecated_function( __METHOD__, 'WPSEO 10.1.3' );

		return false;
	}

	/**
	 * Main title function.
	 *
	 * @deprecated 12.7
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $title              Title that might have already been set.
	 * @param string $separator          Separator determined in theme (unused).
	 * @param string $separator_location Whether the separator should be left or right.
	 *
	 * @return string
	 */
	public function title( $title, $separator = '', $separator_location = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Outputs or returns the debug marker, which is also used for title replacement when force rewrite is active.
	 *
	 * @deprecated 12.7
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The marker that will be echoed.
	 */
	public function debug_mark() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Returns the debug marker, which is also used for title replacement when force rewrite is active.
	 *
	 * @deprecated 12.7
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The generated marker.
	 */
	public function get_debug_mark() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Outputs the meta robots value.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @return string
	 */
	public function robots() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Retrieves the meta robots value.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @return string
	 */
	public function get_robots() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Determines $robots values for a single post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @param array $robots  Robots data array.
	 * @param int   $post_id The post ID for which to determine the $robots values, defaults to current post.
	 *
	 * @return array
	 */
	public function robots_for_single_post( $robots, $post_id = 0 ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return array();
	}

	/**
	 * Outputs noindex values for the current page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 */
	public function noindex_page() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );
	}

	/**
	 * Used for static home and posts pages as well as singular titles.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @param object|null $object If filled, object to get the title for.
	 *
	 * @return string
	 */
	public function get_content_title( $object = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Retrieves the SEO title set in the SEO widget.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @param null $object Object to retrieve the title from.
	 *
	 * @return string The SEO title for the specified object, or queried object if not supplied.
	 */
	public function get_seo_title( $object = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Used for category, tag, and tax titles.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @return string
	 */
	public function get_taxonomy_title() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Used for author titles.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @return string
	 */
	public function get_author_title() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Simple function to use to pull data from $options.
	 *
	 * All titles pulled from options will be run through the $this->replace_vars function.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @param string       $index      Name of the page to get the title from the settings for.
	 * @param object|array $var_source Possible object to pull variables from.
	 *
	 * @return string
	 */
	public function get_title_from_options( $index, $var_source = array() ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Get the default title for the current page.
	 *
	 * This is the fallback title generator used when a title hasn't been set for the specific content, taxonomy, author
	 * details, or in the options. It scrubs off any present prefix before or after the title (based on $seplocation) in
	 * order to prevent duplicate seperations from appearing in the title (this happens when a prefix is supplied to the
	 * wp_title call on singular pages).
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @param string $sep         The separator used between variables.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       Possible title that's already set.
	 *
	 * @return string
	 */
	public function get_default_title( $sep, $seplocation, $title = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * This function adds paging details to the title.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @param string $sep         Separator used in the title.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       The title to append the paging info to.
	 *
	 * @return string
	 */
	public function add_paging_to_title( $sep, $seplocation, $title ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Add part to title, while ensuring that the $seplocation variable is respected.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @param string $sep         Separator used in the title.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       The title to append the title_part to.
	 * @param string $title_part  The part to append to the title.
	 *
	 * @return string
	 */
	public function add_to_title( $sep, $seplocation, $title, $title_part ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Function used when title needs to be force overridden.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 12.7
	 *
	 * @return string
	 */
	public function force_wp_title() {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}

	/**
	 * Outputs the meta description element or returns the description text.
	 *
	 * @param bool $echo Echo or return output flag.
	 *
	 * @return string
	 */
	public function metadesc( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.7' );

		return '';
	}
}
