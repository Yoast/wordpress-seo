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
	 * Instance of this class.
	 *
	 * @var object
	 */
	public static $instance;

	/**
	 * Class constructor.
	 *
	 * Adds and removes a lot of filters.
	 */
	protected function __construct() {
		// Remove actions that we will handle through our wpseo_head call, and probably change the output of.
		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );
		remove_action( 'wp_head', 'noindex', 1 );

		$integrations = array(
			// new WPSEO_Schema(), // -- Has been moved to SRC directory.
			new WPSEO_Handle_404(),
			// new WPSEO_Remove_Reply_To_Com(), HAS BEEN MOVED TO SRC DIRECTORY!
			new WPSEO_OpenGraph_OEmbed(),
		);

		foreach ( $integrations as $integration ) {
			$integration->register_hooks();
		}
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

		return '';
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

		return false;
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
	 * Adds shortcode support to category descriptions.
	 *
	 * @deprecated xx.x
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $desc String to add shortcodes in.
	 *
	 * @return string Content with shortcodes filtered out.
	 */
	public function custom_category_descriptions_add_shortcode_support( $desc ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Main title function.
	 *
	 * @deprecated xx.x
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
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Outputs or returns the debug marker, which is also used for title replacement when force rewrite is active.
	 *
	 * @deprecated xx.x
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The marker that will be echoed.
	 */
	public function debug_mark() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Returns the debug marker, which is also used for title replacement when force rewrite is active.
	 *
	 * @deprecated xx.x
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The generated marker.
	 */
	public function get_debug_mark() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Outputs the meta robots value.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return string
	 */
	public function robots() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Retrieves the meta robots value.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return string
	 */
	public function get_robots() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Determines $robots values for a single post.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param array $robots  Robots data array.
	 * @param int   $post_id The post ID for which to determine the $robots values, defaults to current post.
	 *
	 * @return array
	 */
	public function robots_for_single_post( $robots, $post_id = 0 ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return array();
	}

	/**
	 * Outputs noindex values for the current page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 */
	public function noindex_page() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Used for static home and posts pages as well as singular titles.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param object|null $object If filled, object to get the title for.
	 *
	 * @return string
	 */
	public function get_content_title( $object = null ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Retrieves the SEO title set in the SEO widget.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param null $object Object to retrieve the title from.
	 *
	 * @return string The SEO title for the specified object, or queried object if not supplied.
	 */
	public function get_seo_title( $object = null ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Used for category, tag, and tax titles.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return string
	 */
	public function get_taxonomy_title() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Used for author titles.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return string
	 */
	public function get_author_title() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Simple function to use to pull data from $options.
	 *
	 * All titles pulled from options will be run through the $this->replace_vars function.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string       $index      Name of the page to get the title from the settings for.
	 * @param object|array $var_source Possible object to pull variables from.
	 *
	 * @return string
	 */
	public function get_title_from_options( $index, $var_source = array() ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

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
	 * @deprecated xx.x
	 *
	 * @param string $sep         The separator used between variables.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       Possible title that's already set.
	 *
	 * @return string
	 */
	public function get_default_title( $sep, $seplocation, $title = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * This function adds paging details to the title.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $sep         Separator used in the title.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       The title to append the paging info to.
	 *
	 * @return string
	 */
	public function add_paging_to_title( $sep, $seplocation, $title ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Add part to title, while ensuring that the $seplocation variable is respected.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $sep         Separator used in the title.
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       The title to append the title_part to.
	 * @param string $title_part  The part to append to the title.
	 *
	 * @return string
	 */
	public function add_to_title( $sep, $seplocation, $title, $title_part ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Function used when title needs to be force overridden.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return string
	 */
	public function force_wp_title() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Outputs the meta description element or returns the description text.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param bool $echo Echo or return output flag.
	 *
	 * @return string
	 */
	public function metadesc( $echo = true ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Override Woo's title with our own.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $title Title string.
	 *
	 * @return string
	 */
	public function fix_woo_title( $title ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Adds 'prev' and 'next' links to archives.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @link  http://googlewebmastercentral.blogspot.com/2011/09/pagination-with-relnext-and-relprev.html
	 * @since 1.0.3
	 */
	public function adjacent_rel_links() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * This function normally outputs the canonical but is also used in other places to retrieve
	 * the canonical URL for the current page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param bool $echo        Whether or not to output the canonical element.
	 * @param bool $un_paged    Whether or not to return the canonical with or without pagination added to the URL.
	 * @param bool $no_override Whether or not to return a manually overridden canonical.
	 *
	 * @return string $canonical
	 */
	public function canonical( $echo = true, $un_paged = false, $no_override = false ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}


	/**
	 * Initialize the functions that only need to run on the frontpage.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 */
	public function front_page_specific_init() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Output Webmaster Tools authentication strings.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 */
	public function webmaster_tools_authentication() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * When certain archives are disabled, this redirects those to the homepage.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return boolean False when no redirect was triggered.
	 */
	public function archive_redirect() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Based on the redirect meta value, this function determines whether it should redirect the current post / page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return boolean Whether or not the current post / page should be redirected.
	 */
	public function page_redirect() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * If the option to disable attachment URLs is checked, this performs the redirect to the attachment.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @return bool Returns success status.
	 */
	public function attachment_redirect() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}

	/**
	 * Performs the redirect from the attachment page to the image file itself.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $attachment_url The attachment image url.
	 *
	 * @return void
	 */
	public function do_attachment_redirect( $attachment_url ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Wraps wp_safe_redirect to allow testing for redirects.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   Status code to use.
	 */
	public function redirect( $location, $status = 302 ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Replaces the possible RSS variables with their actual values.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $content The RSS content that should have the variables replaced.
	 *
	 * @return string
	 */
	public function rss_replace_vars( $content ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return $content;
	}

	/**
	 * Sends a Robots HTTP header preventing URL from being indexed in the search results while allowing search engines
	 * to follow the links in the object at the URL.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @since 1.1.7
	 * @return boolean Boolean indicating whether the noindex header was sent.
	 */
	public function noindex_robots() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return false;
	}
	/**
	 * Adds rel="nofollow" to a link, only used for login / registration links.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $input The link element as a string.
	 *
	 * @return string
	 */
	public function nofollow_link( $input ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return '';
	}

	/**
	 * Adds the RSS footer (or header) to the full RSS feed item.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $content Feed item content.
	 *
	 * @return string
	 */
	public function embed_rssfooter( $content ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return $content;
	}

	/**
	 * Adds the RSS footer (or header) to the excerpt RSS feed item.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @param string $content Feed item excerpt.
	 *
	 * @return string
	 */
	public function embed_rssfooter_excerpt( $content ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return $content;
	}

	/**
	 * Adds the RSS footer and/or header to an RSS feed item.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated xx.x
	 *
	 * @since 1.4.14
	 *
	 * @param string $content Feed item content.
	 * @param string $context Feed item context, either 'excerpt' or 'full'.
	 *
	 * @return string
	 */
	public function embed_rss( $content, $context = 'full' ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );

		return $content;
	}

	/**
	 * Used in the force rewrite functionality this retrieves the output, replaces the title with the proper SEO
	 * title and then flushes the output.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function flush_cache() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Starts the output buffer so it can later be fixed by flush_cache().
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 */
	public function force_rewrite_output_buffer() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}
}
