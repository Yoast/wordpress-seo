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
	/**
	 * @var    object    Instance of this class.
	 */
	public static $instance;
	/**
	 * @var boolean Boolean indicating whether output buffering has been started.
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
	 * Holds the pages meta description.
	 *
	 * @var string
	 */
	private $metadesc = null;
	/**
	 * Holds the generated title for the page.
	 *
	 * @var string
	 */
	private $title = null;
	/** @var WPSEO_Frontend_Page_Type */
	protected $frontend_page_type;

	/** @var WPSEO_WooCommerce_Shop_Page */
	protected $woocommerce_shop_page;

	/**
	 * Class constructor.
	 *
	 * Adds and removes a lot of filters.
	 */
	protected function __construct() {

		add_action( 'wp_head', array( $this, 'front_page_specific_init' ), 0 );
		add_action( 'wp_head', array( $this, 'head' ), 1 );

		// The head function here calls action wpseo_head, to which we hook all our functionality.
		add_action( 'wpseo_head', array( $this, 'debug_mark' ), 2 );
		add_action( 'wpseo_head', array( $this, 'metadesc' ), 6 );
		add_action( 'wpseo_head', array( $this, 'robots' ), 10 );
		add_action( 'wpseo_head', array( $this, 'canonical' ), 20 );
		add_action( 'wpseo_head', array( $this, 'adjacent_rel_links' ), 21 );
		add_action( 'wpseo_head', array( $this, 'publisher' ), 22 );

		// Remove actions that we will handle through our wpseo_head call, and probably change the output of.
		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		remove_action( 'wp_head', 'noindex', 1 );

		// When using WP 4.4, just use the new hook.
		add_filter( 'pre_get_document_title', array( $this, 'title' ), 15 );
		add_filter( 'wp_title', array( $this, 'title' ), 15, 3 );

		add_filter( 'thematic_doctitle', array( $this, 'title' ), 15 );

		add_action( 'wp', array( $this, 'page_redirect' ), 99 );

		add_action( 'template_redirect', array( $this, 'noindex_feed' ) );

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
		$this->frontend_page_type    = new WPSEO_Frontend_Page_Type();

		$integrations = array(
			new WPSEO_Frontend_Primary_Category(),
			new WPSEO_JSON_LD(),
			new WPSEO_Remove_Reply_To_Com(),
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
		foreach ( get_class_vars( __CLASS__ ) as $name => $default ) {
			switch ( $name ) {
				// Clear the class instance to be re-initialized.
				case 'instance':
					self::$instance = null;
					break;

				// Exclude these properties from being reset.
				case 'woocommerce_shop_page':
				case 'frontend_page_type':
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
	 * Used for static home and posts pages as well as singular titles.
	 *
	 * @param object|null $object If filled, object to get the title for.
	 *
	 * @return string
	 */
	public function get_content_title( $object = null ) {
		if ( $object === null ) {
			$object = $GLOBALS['wp_query']->get_queried_object();
		}

		$title = $this->get_seo_title( $object );
		if ( $title !== '' ) {
			return $title;
		}

		$post_type = ( isset( $object->post_type ) ? $object->post_type : $object->query_var );

		return $this->get_title_from_options( 'title-' . $post_type, $object );
	}

	/**
	 * Retrieves the SEO title set in the SEO widget.
	 *
	 * @param null $object Object to retrieve the title from.
	 *
	 * @return string The SEO title for the specified object, or queried object if not supplied.
	 */
	public function get_seo_title( $object = null ) {
		if ( $object === null ) {
			$object = $GLOBALS['wp_query']->get_queried_object();
		}

		if ( ! is_object( $object ) ) {
			return $this->get_title_from_options( 'title-404-wpseo' );
		}

		$title = $this->get_seo_meta_value( 'title', $object->ID );

		if ( $title !== '' ) {
			return $this->replace_vars( $title, $object );
		}

		return $title;
	}

	/**
	 * Used for category, tag, and tax titles.
	 *
	 * @return string
	 */
	public function get_taxonomy_title() {
		$object = $GLOBALS['wp_query']->get_queried_object();

		$title = WPSEO_Taxonomy_Meta::get_term_meta( $object, $object->taxonomy, 'title' );

		if ( is_string( $title ) && $title !== '' ) {
			return $this->replace_vars( $title, $object );
		}

		return $this->get_title_from_options( 'title-tax-' . $object->taxonomy, $object );
	}

	/**
	 * Used for author titles.
	 *
	 * @return string
	 */
	public function get_author_title() {
		$author_id = get_query_var( 'author' );
		$title     = trim( get_the_author_meta( 'wpseo_title', $author_id ) );

		if ( $title !== '' ) {
			return $this->replace_vars( $title, array() );
		}

		return $this->get_title_from_options( 'title-author-wpseo' );
	}

	/**
	 * Simple function to use to pull data from $options.
	 *
	 * All titles pulled from options will be run through the $this->replace_vars function.
	 *
	 * @param string       $index      Name of the page to get the title from the settings for.
	 * @param object|array $var_source Possible object to pull variables from.
	 *
	 * @return string
	 */
	public function get_title_from_options( $index, $var_source = array() ) {
		$template = WPSEO_Options::get( $index, '' );
		if ( $template === '' ) {
			if ( is_singular() ) {
				return $this->replace_vars( '%%title%% %%sep%% %%sitename%%', $var_source );
			}

			return '';
		}

		return $this->replace_vars( $template, $var_source );
	}

	/**
	 * Get the default title for the current page.
	 *
	 * This is the fallback title generator used when a title hasn't been set for the specific content, taxonomy, author
	 * details, or in the options. It scrubs off any present prefix before or after the title (based on $seplocation) in
	 * order to prevent duplicate seperations from appearing in the title (this happens when a prefix is supplied to the
	 * wp_title call on singular pages).
	 *
	 * @param string $sep         The separator used between variables.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       Possible title that's already set.
	 *
	 * @return string
	 */
	public function get_default_title( $sep, $seplocation, $title = '' ) {
		if ( 'right' === $seplocation ) {
			$regex = '`\s*' . preg_quote( trim( $sep ), '`' ) . '\s*`u';
		}
		else {
			$regex = '`^\s*' . preg_quote( trim( $sep ), '`' ) . '\s*`u';
		}
		$title = preg_replace( $regex, '', $title );

		if ( ! is_string( $title ) || ( is_string( $title ) && $title === '' ) ) {
			$title = WPSEO_Utils::get_site_name();
			$title = $this->add_paging_to_title( $sep, $seplocation, $title );
			$title = $this->add_to_title( $sep, $seplocation, $title, wp_strip_all_tags( get_bloginfo( 'description' ), true ) );

			return $title;
		}

		$title = $this->add_paging_to_title( $sep, $seplocation, $title );
		$title = $this->add_to_title( $sep, $seplocation, $title, wp_strip_all_tags( get_bloginfo( 'name' ), true ) );

		return $title;
	}

	/**
	 * This function adds paging details to the title.
	 *
	 * @param string $sep         Separator used in the title.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       The title to append the paging info to.
	 *
	 * @return string
	 */
	public function add_paging_to_title( $sep, $seplocation, $title ) {
		global $wp_query;

		if ( ! empty( $wp_query->query_vars['paged'] ) && $wp_query->query_vars['paged'] > 1 ) {
			return $this->add_to_title( $sep, $seplocation, $title, $wp_query->query_vars['paged'] . '/' . $wp_query->max_num_pages );
		}

		return $title;
	}

	/**
	 * Add part to title, while ensuring that the $seplocation variable is respected.
	 *
	 * @param string $sep         Separator used in the title.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       The title to append the title_part to.
	 * @param string $title_part  The part to append to the title.
	 *
	 * @return string
	 */
	public function add_to_title( $sep, $seplocation, $title, $title_part ) {
		if ( 'right' === $seplocation ) {
			return $title . $sep . $title_part;
		}

		return $title_part . $sep . $title;
	}

	/**
	 * Main title function.
	 *
	 * @param string $title              Title that might have already been set.
	 * @param string $separator          Separator determined in theme (unused).
	 * @param string $separator_location Whether the separator should be left or right.
	 *
	 * @return string
	 */
	public function title( $title, $separator = '', $separator_location = '' ) {
		if ( is_null( $this->title ) ) {
			$this->title = $this->generate_title( $title, $separator_location );
		}

		return $this->title;
	}

	/**
	 * Main title generation function.
	 *
	 * @param string $title              Title that might have already been set.
	 * @param string $separator_location Whether the separator should be left or right.
	 *
	 * @return string
	 */
	private function generate_title( $title, $separator_location ) {

		if ( is_feed() ) {
			return $title;
		}

		$separator = $this->replace_vars( '%%sep%%', array() );
		$separator = ' ' . trim( $separator ) . ' ';

		if ( '' === trim( $separator_location ) ) {
			$separator_location = ( is_rtl() ) ? 'left' : 'right';
		}

		// This needs to be kept track of in order to generate
		// default titles for singular pages.
		$original_title = $title;

		// This flag is used to determine if any additional
		// processing should be done to the title after the
		// main section of title generation completes.
		$modified_title = true;

		// This variable holds the page-specific title part
		// that is used to generate default titles.
		$title_part = '';

		if ( $this->frontend_page_type->is_home_static_page() ) {
			$title = $this->get_content_title();
		}
		elseif ( $this->frontend_page_type->is_home_posts_page() ) {
			$title = $this->get_title_from_options( 'title-home-wpseo' );
		}
		elseif ( $this->woocommerce_shop_page->is_shop_page() ) {
			$post  = get_post( $this->woocommerce_shop_page->get_shop_page_id() );
			$title = $this->get_seo_title( $post );

			if ( ! is_string( $title ) || $title === '' ) {
				$title = $this->get_post_type_archive_title( $separator, $separator_location );
			}
		}
		elseif ( $this->frontend_page_type->is_simple_page() ) {
			$post  = get_post( $this->frontend_page_type->get_simple_page_id() );
			$title = $this->get_content_title( $post );

			if ( ! is_string( $title ) || '' === $title ) {
				$title_part = $original_title;
			}
		}
		elseif ( is_search() ) {
			$title = $this->get_title_from_options( 'title-search-wpseo' );

			if ( ! is_string( $title ) || '' === $title ) {
				/* translators: %s expands to the search phrase. */
				$title_part = sprintf( __( 'Search for "%s"', 'wordpress-seo' ), esc_html( get_search_query() ) );
			}
		}
		elseif ( is_category() || is_tag() || is_tax() ) {
			$title = $this->get_taxonomy_title();

			if ( ! is_string( $title ) || '' === $title ) {
				if ( is_category() ) {
					$title_part = single_cat_title( '', false );
				}
				elseif ( is_tag() ) {
					$title_part = single_tag_title( '', false );
				}
				else {
					$title_part = single_term_title( '', false );
					if ( $title_part === '' ) {
						$term       = $GLOBALS['wp_query']->get_queried_object();
						$title_part = $term->name;
					}
				}
			}
		}
		elseif ( is_author() ) {
			$title = $this->get_author_title();

			if ( ! is_string( $title ) || '' === $title ) {
				$title_part = get_the_author_meta( 'display_name', get_query_var( 'author' ) );
			}
		}
		elseif ( is_post_type_archive() ) {
			$title = $this->get_post_type_archive_title( $separator, $separator_location );
		}
		elseif ( is_archive() ) {
			$title = $this->get_title_from_options( 'title-archive-wpseo' );

			// @todo [JRF => Yoast] Should these not use the archive default if no title found ?
			// WPSEO_Options::get_default( 'wpseo_titles', 'title-archive-wpseo' )
			// Replacement would be needed!
			if ( empty( $title ) ) {
				if ( is_month() ) {
					/* translators: %s expands to a time period, i.e. month name, year or specific date. */
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), single_month_title( ' ', false ) );
				}
				elseif ( is_year() ) {
					/* translators: %s expands to a time period, i.e. month name, year or specific date. */
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), get_query_var( 'year' ) );
				}
				elseif ( is_day() ) {
					/* translators: %s expands to a time period, i.e. month name, year or specific date. */
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), get_the_date() );
				}
				else {
					$title_part = __( 'Archives', 'wordpress-seo' );
				}
			}
		}
		elseif ( is_404() ) {

			$title = $this->get_title_from_options( 'title-404-wpseo' );

			// @todo [JRF => Yoast] Should these not use the 404 default if no title found ?
			// WPSEO_Options::get_default( 'wpseo_titles', 'title-404-wpseo' )
			// Replacement would be needed!
			if ( empty( $title ) ) {
				$title_part = __( 'Page not found', 'wordpress-seo' );
			}
		}
		else {
			// In case the page type is unknown, leave the title alone.
			$modified_title = false;

			// If you would like to generate a default title instead,
			// the following code could be used
			// $title_part = $title;
			// instead of the line above.
		}

		if ( ( $modified_title && empty( $title ) ) || ! empty( $title_part ) ) {
			$title = $this->get_default_title( $separator, $separator_location, $title_part );
		}

		if ( defined( 'ICL_LANGUAGE_CODE' ) && false !== strpos( $title, ICL_LANGUAGE_CODE ) ) {
			$title = str_replace( ' @' . ICL_LANGUAGE_CODE, '', $title );
		}

		/**
		 * Filter: 'wpseo_title' - Allow changing the Yoast SEO <title> output.
		 *
		 * @api string $title The page title being put out.
		 */

		return esc_html( wp_strip_all_tags( stripslashes( apply_filters( 'wpseo_title', $title ) ), true ) );
	}

	/**
	 * Function used when title needs to be force overridden.
	 *
	 * @return string
	 */
	public function force_wp_title() {
		global $wp_query;
		$old_wp_query = null;

		if ( ! $wp_query->is_main_query() ) {
			$old_wp_query = $wp_query;
			wp_reset_query();
		}

		$title = $this->title( '' );

		if ( ! empty( $old_wp_query ) ) {
			$GLOBALS['wp_query'] = $old_wp_query;
			unset( $old_wp_query );
		}

		return $title;
	}

	/**
	 * Outputs or returns the debug marker, which is also used for title replacement when force rewrite is active.
	 *
	 * @param bool $echo Deprecated. Since 5.9. Whether or not to echo the debug marker.
	 *
	 * @return string The marker that will be echoed.
	 */
	public function debug_mark( $echo = true ) {
		$marker = $this->get_debug_mark();
		if ( $echo === false ) {
			_deprecated_argument( 'WPSEO_Frontend::debug_mark', '5.9', 'WPSEO_Frontend::get_debug_mark' );

			return $marker;
		}

		echo "\n${marker}\n";

		return '';
	}

	/**
	 * Returns the debug marker, which is also used for title replacement when force rewrite is active.
	 *
	 * @return string The generated marker.
	 */
	public function get_debug_mark() {
		return sprintf(
			'<!-- This site is optimized with the %1$s %2$s - https://yoast.com/wordpress/plugins/seo/ -->',
			esc_html( $this->head_product_name() ),
			/**
			 * Filter: 'wpseo_hide_version' - can be used to hide the Yoast SEO version in the debug marker (only available in Yoast SEO Premium).
			 *
			 * @api bool
			 */
			( ( apply_filters( 'wpseo_hide_version', false ) && $this->is_premium() ) ? '' : 'v' . WPSEO_VERSION )
		);
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

		echo $this->show_closing_debug_mark();

		if ( ! empty( $old_wp_query ) ) {
			$GLOBALS['wp_query'] = $old_wp_query;
			unset( $old_wp_query );
		}
	}

	/**
	 * Output the meta robots value.
	 *
	 * @return string
	 */
	public function robots() {
		global $wp_query, $post;

		$robots           = array();
		$robots['index']  = 'index';
		$robots['follow'] = 'follow';
		$robots['other']  = array();

		if ( ( is_object( $post ) && is_singular() ) || $this->woocommerce_shop_page->is_shop_page() ) {
			$private = 'private' === $post->post_status;
			$noindex = ! WPSEO_Post_Type::is_post_type_indexable( $post->post_type );

			if ( $noindex || $private ) {
				$robots['index'] = 'noindex';
			}

			$robots = $this->robots_for_single_post( $robots );
		}
		else {
			if ( is_search() || is_404() ) {
				$robots['index'] = 'noindex';
			}
			elseif ( is_tax() || is_tag() || is_category() ) {
				$term = $wp_query->get_queried_object();
				if ( is_object( $term ) && ( WPSEO_Options::get( 'noindex-tax-' . $term->taxonomy, false ) ) ) {
					$robots['index'] = 'noindex';
				}

				// Three possible values, index, noindex and default, do nothing for default.
				$term_meta = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'noindex' );
				if ( is_string( $term_meta ) && 'default' !== $term_meta ) {
					$robots['index'] = $term_meta;
				}

				if ( $this->is_multiple_terms_query() ) {
					$robots['index'] = 'noindex';
				}
			}
			elseif ( is_author() ) {
				if ( WPSEO_Options::get( 'noindex-author-wpseo', false ) ) {
					$robots['index'] = 'noindex';
				}
				$curauth = $wp_query->get_queried_object();
				if ( WPSEO_Options::get( 'noindex-author-noposts-wpseo', false ) && count_user_posts( $curauth->ID, 'any' ) === 0 ) {
					$robots['index'] = 'noindex';
				}
				if ( get_user_meta( $curauth->ID, 'wpseo_noindex_author', true ) === 'on' ) {
					$robots['index'] = 'noindex';
				}
			}
			elseif ( is_date() && WPSEO_Options::get( 'noindex-archive-wpseo', false ) ) {
				$robots['index'] = 'noindex';
			}
			elseif ( is_home() ) {
				$page_for_posts = get_option( 'page_for_posts' );
				if ( $page_for_posts ) {
					$robots = $this->robots_for_single_post( $robots, $page_for_posts );
				}
				unset( $page_for_posts );
			}
			elseif ( is_post_type_archive() ) {
				$post_type = $this->get_queried_post_type();

				if ( WPSEO_Options::get( 'noindex-ptarchive-' . $post_type, false ) ) {
					$robots['index'] = 'noindex';
				}
			}

			unset( $robot );
		}

		// Force override to respect the WP settings.
		if ( '0' === (string) get_option( 'blog_public' ) || isset( $_GET['replytocom'] ) ) {
			$robots['index'] = 'noindex';
		}

		$robotsstr = $robots['index'] . ',' . $robots['follow'];

		if ( $robots['other'] !== array() ) {
			$robots['other'] = array_unique( $robots['other'] ); // @todo Most likely no longer needed, needs testing.
			$robotsstr      .= ',' . implode( ',', $robots['other'] );
		}

		$robotsstr = preg_replace( '`^index,follow,?`', '', $robotsstr );
		$robotsstr = str_replace( array( 'noodp,', 'noodp' ), '', $robotsstr );

		/**
		 * Filter: 'wpseo_robots' - Allows filtering of the meta robots output of Yoast SEO.
		 *
		 * @api string $robotsstr The meta robots directives to be echoed.
		 */
		$robotsstr = apply_filters( 'wpseo_robots', $robotsstr );

		if ( is_string( $robotsstr ) && $robotsstr !== '' ) {
			echo '<meta name="robots" content="', esc_attr( $robotsstr ), '"/>', "\n";
		}

		// If a page has a noindex, it should _not_ have a canonical, as these are opposing indexing directives.
		if ( strpos( $robotsstr, 'noindex' ) !== false ) {
			remove_action( 'wpseo_head', array( $this, 'canonical' ), 20 );
		}

		return $robotsstr;
	}

	/**
	 * Determine $robots values for a single post.
	 *
	 * @param array $robots  Robots data array.
	 * @param int   $post_id The post ID for which to determine the $robots values, defaults to current post.
	 *
	 * @return    array
	 */
	public function robots_for_single_post( $robots, $post_id = 0 ) {
		$noindex = $this->get_seo_meta_value( 'meta-robots-noindex', $post_id );
		if ( $noindex === '1' ) {
			$robots['index'] = 'noindex';
		}
		elseif ( $noindex === '2' ) {
			$robots['index'] = 'index';
		}

		if ( $this->get_seo_meta_value( 'meta-robots-nofollow', $post_id ) === '1' ) {
			$robots['follow'] = 'nofollow';
		}

		$meta_robots_adv = $this->get_seo_meta_value( 'meta-robots-adv', $post_id );

		if ( $meta_robots_adv !== '' && ( $meta_robots_adv !== '-' && $meta_robots_adv !== 'none' ) ) {
			$meta_robots_adv = explode( ',', $meta_robots_adv );
			foreach ( $meta_robots_adv as $robot ) {
				$robots['other'][] = $robot;
			}
			unset( $robot );
		}
		unset( $meta_robots_adv );

		return $robots;
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
			elseif ( $this->frontend_page_type->is_posts_page() ) {

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
		// Don't do this for Genesis, as the way Genesis handles homepage functionality is different and causes issues sometimes.
		/**
		 * Filter 'wpseo_genesis_force_adjacent_rel_home' - Allows devs to allow echoing rel="next" / rel="prev" by Yoast SEO on Genesis installs.
		 *
		 * @api bool $unsigned Whether or not to rel=next / rel=prev .
		 */
		if ( is_home() && function_exists( 'genesis' ) && apply_filters( 'wpseo_genesis_force_adjacent_rel_home', false ) === false ) {
			return;
		}

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
		if ( ! is_singular() || $this->frontend_page_type->is_home_static_page() ) {
			$base = trailingslashit( $GLOBALS['wp_rewrite']->pagination_base );
		}
		return $base;
	}

	/**
	 * Output the rel=publisher code on every page of the site.
	 *
	 * @return boolean Boolean indicating whether the publisher link was printed.
	 */
	public function publisher() {
		$publisher = WPSEO_Options::get( 'plus-publisher', '' );
		if ( $publisher !== '' ) {
			echo '<link rel="publisher" href="', esc_url( $publisher ), '"/>', "\n";

			return true;
		}

		return false;
	}

	/**
	 * Outputs the meta description element or returns the description text.
	 *
	 * @param bool $echo Echo or return output flag.
	 *
	 * @return string
	 */
	public function metadesc( $echo = true ) {
		if ( is_null( $this->metadesc ) ) {
			$this->generate_metadesc();
		}

		if ( $echo === false ) {
			return $this->metadesc;
		}

		if ( is_string( $this->metadesc ) && $this->metadesc !== '' ) {
			echo '<meta name="description" content="', esc_attr( wp_strip_all_tags( stripslashes( $this->metadesc ) ) ), '"/>', "\n";
			return '';
		}

		if ( current_user_can( 'wpseo_manage_options' ) && is_singular() ) {
			echo '<!-- ';
			printf(
				/* Translators: %1$s resolves to the SEO menu item, %2$s resolves to the Search Appearance submenu item. */
				esc_html__( 'Admin only notice: this page does not show a meta description because it does not have one, either write it for this page specifically or go into the [%1$s - %2$s] menu and set up a template.', 'wordpress-seo' ),
				__( 'SEO', 'wordpress-seo' ),
				__( 'Search Appearance', 'wordpress-seo' )
			);
			echo ' -->' . "\n";
		}
	}

	/**
	 * Generates the meta description text.
	 */
	private function generate_metadesc() {
		global $post, $wp_query;

		$metadesc          = '';
		$metadesc_override = false;
		$post_type         = '';
		$template          = '';

		if ( is_object( $post ) && ( isset( $post->post_type ) && $post->post_type !== '' ) ) {
			$post_type = $post->post_type;
		}

		if ( $this->woocommerce_shop_page->is_shop_page() ) {
			$post      = get_post( $this->woocommerce_shop_page->get_shop_page_id() );
			$post_type = $this->get_queried_post_type();

			if ( ( $metadesc === '' && $post_type !== '' ) && WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type, '' ) !== '' ) {
				$template = WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type );
				$term     = $post;
			}
			$metadesc_override = $this->get_seo_meta_value( 'metadesc', $post->ID );
		}
		elseif ( $this->frontend_page_type->is_simple_page() ) {
			$post      = get_post( $this->frontend_page_type->get_simple_page_id() );
			$post_type = isset( $post->post_type ) ? $post->post_type : '';

			if ( ( $metadesc === '' && $post_type !== '' ) && WPSEO_Options::get( 'metadesc-' . $post_type, '' ) !== '' ) {
				$template = WPSEO_Options::get( 'metadesc-' . $post_type );
				$term     = $post;
			}

			if ( is_object( $post ) ) {
				$metadesc_override = $this->get_seo_meta_value( 'metadesc', $post->ID );
			}
		}
		else {
			if ( is_search() ) {
				$metadesc = '';
			}
			elseif ( $this->frontend_page_type->is_home_posts_page() ) {
				$template = WPSEO_Options::get( 'metadesc-home-wpseo' );
				$term     = array();

				if ( empty( $template ) ) {
					$template = get_bloginfo( 'description' );
				}
			}
			elseif ( $this->frontend_page_type->is_home_static_page() ) {
				$metadesc = $this->get_seo_meta_value( 'metadesc' );
				if ( ( $metadesc === '' && $post_type !== '' ) && WPSEO_Options::get( 'metadesc-' . $post_type, '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-' . $post_type );
				}
			}
			elseif ( is_category() || is_tag() || is_tax() ) {
				$term              = $wp_query->get_queried_object();
				$metadesc_override = WPSEO_Taxonomy_Meta::get_term_meta( $term, $term->taxonomy, 'desc' );
				if ( is_object( $term ) && isset( $term->taxonomy ) && WPSEO_Options::get( 'metadesc-tax-' . $term->taxonomy, '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-tax-' . $term->taxonomy );
				}
			}
			elseif ( is_author() ) {
				$author_id = get_query_var( 'author' );
				$metadesc  = get_the_author_meta( 'wpseo_metadesc', $author_id );
				if ( ( ! is_string( $metadesc ) || $metadesc === '' ) && WPSEO_Options::get( 'metadesc-author-wpseo', '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-author-wpseo' );
				}
			}
			elseif ( is_post_type_archive() ) {
				$post_type = $this->get_queried_post_type();
				if ( WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type, '' ) !== '' ) {
					$template = WPSEO_Options::get( 'metadesc-ptarchive-' . $post_type );
				}
			}
			elseif ( is_archive() ) {
				$template = WPSEO_Options::get( 'metadesc-archive-wpseo' );
			}

			// If we're on a paginated page, and the template doesn't change for paginated pages, bail.
			if ( ( ! is_string( $metadesc ) || $metadesc === '' ) && get_query_var( 'paged' ) && get_query_var( 'paged' ) > 1 && $template !== '' ) {
				if ( strpos( $template, '%%page' ) === false ) {
					$metadesc = '';
				}
			}
		}

		$post_data = $post;

		if ( is_string( $metadesc_override ) && '' !== $metadesc_override ) {
			$metadesc = $metadesc_override;
			if ( isset( $term ) ) {
				$post_data = $term;
			}
		}
		elseif ( ( ! is_string( $metadesc ) || '' === $metadesc ) && '' !== $template ) {
			if ( ! isset( $term ) ) {
				$term = $wp_query->get_queried_object();
			}

			$metadesc  = $template;
			$post_data = $term;
		}

		$metadesc = $this->replace_vars( $metadesc, $post_data );

		/**
		 * Filter: 'wpseo_metadesc' - Allow changing the Yoast SEO meta description sentence.
		 *
		 * @api string $metadesc The description sentence.
		 */
		$this->metadesc = apply_filters( 'wpseo_metadesc', trim( $metadesc ) );
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
				wp_redirect( $redir, 301 );
				exit;
			}
		}

		return false;
	}

	/**
	 * Outputs noindex values for the current page.
	 */
	public function noindex_page() {
		remove_action( 'wpseo_head', array( $this, 'canonical' ), 20 );
		echo '<meta name="robots" content="noindex" />', "\n";
	}

	/**
	 * Send a Robots HTTP header preventing URL from being indexed in the search results while allowing search engines
	 * to follow the links in the object at the URL.
	 *
	 * @since 1.1.7
	 * @return boolean Boolean indicating whether the noindex header was sent.
	 */
	public function noindex_feed() {

		if ( ( is_feed() || is_robots() ) && headers_sent() === false ) {
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
		wp_redirect( $attachment_url, 301 );
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

		// Only replace the debug marker when it is hooked.
		if ( $this->show_debug_marker() ) {
			$title      = $this->title( '' );
			$debug_mark = $this->get_debug_mark();

			// Find all titles, strip them out and add the new one in within the debug marker, so it's easily identified whether a site uses force rewrite.
			$content = preg_replace( '/<title.*?\/title>/i', '', $content );
			$content = str_replace( $debug_mark, $debug_mark . "\n" . '<title>' . esc_html( $title ) . '</title>', $content );
		}

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
	 * Function used in testing whether the title should be force rewritten or not.
	 *
	 * @param string $title Title string.
	 *
	 * @return string
	 */
	public function title_test_helper( $title ) {
		WPSEO_Options::set( 'title_test', ( WPSEO_Options::get( 'title_test' ) + 1 ) );

		// Prevent this setting from being on forever when something breaks, as it breaks caching.
		if ( WPSEO_Options::get( 'title_test' ) > 5 ) {
			WPSEO_Options::set( 'title_test', 0 );

			remove_filter( 'wpseo_title', array( $this, 'title_test_helper' ) );

			return $title;
		}

		if ( ! defined( 'DONOTCACHEPAGE' ) ) {
			define( 'DONOTCACHEPAGE', true );
		}
		if ( ! defined( 'DONOTCACHCEOBJECT' ) ) {
			define( 'DONOTCACHCEOBJECT', true );
		}
		if ( ! defined( 'DONOTMINIFY' ) ) {
			define( 'DONOTMINIFY', true );
		}

		if ( $_SERVER['HTTP_USER_AGENT'] === "WordPress/{$GLOBALS['wp_version']}; " . get_bloginfo( 'url' ) . ' - Yoast' ) {
			return 'This is a Yoast Test Title';
		}

		return $title;
	}

	/**
	 * Get the product name in the head section.
	 *
	 * @return string
	 */
	private function head_product_name() {
		if ( $this->is_premium() ) {
			return 'Yoast SEO Premium plugin';
		}

		return 'Yoast SEO plugin';
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
		wp_safe_redirect( $location, $status );
		exit;
	}

	/**
	 * Checks if the debug mark action has been added.
	 *
	 * @return bool True when the action exists.
	 */
	protected function show_debug_marker() {
		return has_action( 'wpseo_head', array( $this, 'debug_mark' ) ) !== false;
	}

	/**
	 * Shows the closing debug mark.
	 *
	 * @return string The closing debug mark comment.
	 */
	protected function show_closing_debug_mark() {
		if ( ! $this->show_debug_marker() ) {
			return '';
		}

		return sprintf(
			"<!-- / %s. -->\n\n",
			esc_html( $this->head_product_name() )
		);
	}

	/**
	 * Builds the title for a post type archive.
	 *
	 * @param string $separator          The title separator.
	 * @param string $separator_location The location of the title separator.
	 *
	 * @return string The title to use on a post type archive.
	 */
	protected function get_post_type_archive_title( $separator, $separator_location ) {
		$post_type = $this->get_queried_post_type();

		$title = $this->get_title_from_options( 'title-ptarchive-' . $post_type );

		if ( ! is_string( $title ) || '' === $title ) {
			$post_type_obj = get_post_type_object( $post_type );
			$title_part    = '';

			if ( isset( $post_type_obj->labels->menu_name ) ) {
				$title_part = $post_type_obj->labels->menu_name;
			}
			elseif ( isset( $post_type_obj->name ) ) {
				$title_part = $post_type_obj->name;
			}

			$title = $this->get_default_title( $separator, $separator_location, $title_part );
		}

		return $title;
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
	 * Outputs or returns the debug marker, which is also used for title replacement when force rewrite is active.
	 *
	 * @deprecated 4.4
	 * @codeCoverageIgnore
	 *
	 * @param bool $echo Whether or not to echo the debug marker.
	 *
	 * @return string
	 */
	public function debug_marker( $echo = false ) {
		if ( function_exists( 'wp_get_current_user' ) && current_user_can( 'manage_options' ) ) {
			_deprecated_function( 'WPSEO_Frontend::debug_marker', '4.4', 'WPSEO_Frontend::debug_mark' );
		}

		return $this->debug_mark( $echo );
	}

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

		return $this->frontend_page_type->is_home_posts_page();
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

		return $this->frontend_page_type->is_home_static_page();
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

		return $this->frontend_page_type->is_posts_page();
	}
}
