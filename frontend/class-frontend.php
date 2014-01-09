<?php
/**
 * @package Frontend
 *
 * Main frontend code.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Main frontend class for WordPress SEO, responsible for the SEO output as well as removing default WordPress output.
 *
 * @package WPSEO_Frontend
 */
class WPSEO_Frontend {

	/**
	 * @var array Holds the plugins options.
	 */
	var $options = array();

	/**
	 * Class constructor
	 *
	 * Adds and removes a lot of filters.
	 */
	function __construct() {

		$this->options = get_wpseo_options();

		add_action( 'wp_head', array( $this, 'head' ), 1 );

		// The head function here calls action wpseo_head, to which we hook all our functionality
		add_action( 'wpseo_head', array( $this, 'debug_marker' ), 2 );
		add_action( 'wpseo_head', array( $this, 'robots' ), 6 );
		add_action( 'wpseo_head', array( $this, 'metadesc' ), 10 );
		add_action( 'wpseo_head', array( $this, 'metakeywords' ), 11 );
		add_action( 'wpseo_head', array( $this, 'canonical' ), 20 );
		add_action( 'wpseo_head', array( $this, 'adjacent_rel_links' ), 21 );
		add_action( 'wpseo_head', array( $this, 'author' ), 22 );
		add_action( 'wpseo_head', array( $this, 'publisher' ), 23 );
		add_action( 'wpseo_head', array( $this, 'webmaster_tools_authentication' ), 90 );

		// Remove actions that we will handle through our wpseo_head call, and probably change the output of
		remove_action( 'wp_head', 'rel_canonical' );
		remove_action( 'wp_head', 'index_rel_link' );
		remove_action( 'wp_head', 'start_post_rel_link' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );

		add_filter( 'wp_title', array( $this, 'title' ), 15, 3 );
		add_filter( 'thematic_doctitle', array( $this, 'title' ), 15 );

		add_action( 'wp', array( $this, 'page_redirect' ), 99, 1 );

		add_action( 'template_redirect', array( $this, 'noindex_feed' ) );

		add_filter( 'loginout', array( $this, 'nofollow_link' ) );
		add_filter( 'register', array( $this, 'nofollow_link' ) );

		if ( isset( $this->options['hide-rsdlink'] ) && $this->options['hide-rsdlink'] )
			remove_action( 'wp_head', 'rsd_link' );

		if ( isset( $this->options['hide-wlwmanifest'] ) && $this->options['hide-wlwmanifest'] )
			remove_action( 'wp_head', 'wlwmanifest_link' );

		if ( isset( $this->options['hide-shortlink'] ) && $this->options['hide-shortlink'] ) {
			remove_action( 'wp_head', 'wp_shortlink_wp_head' );
			remove_action( 'template_redirect', 'wp_shortlink_header' );
		}
		if ( isset( $this->options['hide-feedlinks'] ) && $this->options['hide-feedlinks'] ) {
			// @todo: add option to display just normal feed and hide comment feed.
			remove_action( 'wp_head', 'feed_links', 2 );
			remove_action( 'wp_head', 'feed_links_extra', 3 );
		}

		if ( ( isset( $this->options['disable-date'] ) && $this->options['disable-date'] ) ||
				( isset( $this->options['disable-author'] ) && $this->options['disable-author'] ) ||
				( isset( $this->options['disable-post_formats'] ) && $this->options['disable-post_formats'] )
		)
			add_action( 'wp', array( $this, 'archive_redirect' ) );

		if ( isset( $this->options['redirectattachment'] ) && $this->options['redirectattachment'] )
			add_action( 'template_redirect', array( $this, 'attachment_redirect' ), 1 );

		if ( isset( $this->options['trailingslash'] ) && $this->options['trailingslash'] )
			add_filter( 'user_trailingslashit', array( $this, 'add_trailingslash' ), 10, 2 );

		if ( isset( $this->options['cleanpermalinks'] ) && $this->options['cleanpermalinks'] )
			add_action( 'template_redirect', array( $this, 'clean_permalink' ), 1 );

		if ( isset( $this->options['cleanreplytocom'] ) && $this->options['cleanreplytocom'] )
			add_filter( 'comment_reply_link', array( $this, 'remove_reply_to_com' ) );

		add_filter( 'the_content_feed', array( $this, 'embed_rssfooter' ) );
		add_filter( 'the_excerpt_rss', array( $this, 'embed_rssfooter_excerpt' ) );

		if ( isset( $this->options['forcerewritetitle'] ) && $this->options['forcerewritetitle'] ) {
			add_action( 'get_header', array( $this, 'force_rewrite_output_buffer' ) );
			add_action( 'wp_footer', array( $this, 'flush_cache' ) );
		}

		if ( isset( $this->options['title_test'] ) && $this->options['title_test'] )
			add_filter( 'wpseo_title', array( $this, 'title_test_helper' ) );

		if ( isset( $_GET['replytocom'] ) ) {
			remove_action( 'wp_head', 'wp_no_robots' );
			add_action( 'template_redirect', array( $this, 'replytocom_redirect' ), 1 );
		}
	}

	/**
	 * Determine whether the current page is the homepage and shows posts.
	 *
	 * @return bool
	 */
	function is_home_posts_page() {
		return ( is_home() && 'page' != get_option( 'show_on_front' ) );
	}

	/**
	 * Determine whether the current page is a static homepage.
	 *
	 * @return bool
	 */
	function is_home_static_page() {
		return ( is_front_page() && 'page' == get_option( 'show_on_front' ) && is_page( get_option( 'page_on_front' ) ) );
	}

	/**
	 * Determine whether this is the posts page, regardless of whether it's the frontpage or not.
	 *
	 * @return bool
	 */
	function is_posts_page() {
		return ( is_home() && 'page' == get_option( 'show_on_front' ) );
	}

	/**
	 * Used for static home and posts pages as well as singular titles.
	 *
	 * @param object|null $object if filled, object to get the title for
	 *
	 * @return string
	 */
	function get_content_title( $object = null ) {
		if ( is_null( $object ) ) {
			global $wp_query;
			$object = $wp_query->get_queried_object();
		}

		$title = wpseo_get_value( 'title', $object->ID );

		if ( ! empty( $title ) )
			return wpseo_replace_vars( $title, (array) $object );

		$post_type = ( isset( $object->post_type ) ? $object->post_type : $object->query_var );
		return $this->get_title_from_options( 'title-' . $post_type, $object );
	}

	/**
	 * Used for category, tag, and tax titles.
	 *
	 * @return string
	 */
	function get_taxonomy_title() {
		global $wp_query;
		$object = $wp_query->get_queried_object();

		$title = trim( wpseo_get_term_meta( $object, $object->taxonomy, 'title' ) );

		if ( ! empty( $title ) )
			return wpseo_replace_vars( $title, (array) $object );

		return $this->get_title_from_options( 'title-' . $object->taxonomy, $object );
	}

	/**
	 * Used for author titles.
	 *
	 * @return string
	 */
	function get_author_title() {
		$author_id = get_query_var( 'author' );
		$title     = get_the_author_meta( 'wpseo_title', $author_id );

		if ( ! empty( $title ) )
			return wpseo_replace_vars( $title, array() );

		return $this->get_title_from_options( 'title-author' );
	}

	/**
	 * Simple function to use to pull data from $options.
	 *
	 * All titles pulled from options will be run through the wpseo_replace_vars function.
	 *
	 * @param string       $index      name of the page to get the title from the settings for.
	 * @param object|array $var_source possible object to pul variables from.
	 *
	 * @return string
	 */
	function get_title_from_options( $index, $var_source = array() ) {
		if ( ! isset( $this->options[$index] ) || empty( $this->options[$index] ) ) {
			if ( is_singular() )
				return wpseo_replace_vars( '%%title%% %%sep%% %%sitename%%', (array) $var_source );
			else
				return '';
		}

		return wpseo_replace_vars( $this->options[$index], (array) $var_source );
	}

	/**
	 * Get the default title for the current page.
	 *
	 * This is the fallback title generator used when a title hasn't been set for the specific content, taxonomy, author
	 * details, or in the options. It scrubs off any present prefix before or after the title (based on $seplocation) in
	 * order to prevent duplicate seperations from appearing in the title (this happens when a prefix is supplied to the
	 * wp_title call on singular pages).
	 *
	 * @param string $sep         the separator used between variables
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       possible title that's already set
	 *
	 * @return string
	 */
	function get_default_title( $sep, $seplocation, $title = '' ) {
		if ( 'right' == $seplocation )
			$regex = '`\s*' . preg_quote( trim( $sep ), '`' ) . '\s*`u';
		else
			$regex = '`^\s*' . preg_quote( trim( $sep ), '`' ) . '\s*`u';
		$title = preg_replace( $regex, '', $title );

		if ( empty( $title ) ) {
			$title = get_bloginfo( 'name' );
			$title = $this->add_paging_to_title( $sep, $seplocation, $title );
			$title = $this->add_to_title( $sep, $seplocation, $title, get_bloginfo( 'description' ) );
			return $title;
		}

		$title = $this->add_paging_to_title( $sep, $seplocation, $title );
		$title = $this->add_to_title( $sep, $seplocation, $title, get_bloginfo( 'name' ) );
		return $title;
	}

	/**
	 * This function adds paging details to the title.
	 *
	 * @param string $sep         separator used in the title
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       the title to append the paging info to
	 *
	 * @return string
	 */
	function add_paging_to_title( $sep, $seplocation, $title ) {
		global $wp_query;

		if ( ! empty( $wp_query->query_vars['paged'] ) && $wp_query->query_vars['paged'] > 1 )
			return $this->add_to_title( $sep, $seplocation, $title, $wp_query->query_vars['paged'] . '/' . $wp_query->max_num_pages );

		return $title;
	}

	/**
	 * Add part to title, while ensuring that the $seplocation variable is respected.
	 *
	 * @param string $sep         separator used in the title
	 * @param string $seplocation Whether the separator should be left or right.
	 * @param string $title       the title to append the title_part to
	 * @param string $title_part  the part to append to the title
	 *
	 * @return string
	 */
	function add_to_title( $sep, $seplocation, $title, $title_part ) {
		if ( 'right' == $seplocation )
			return $title . $sep . $title_part;
		return $title_part . $sep . $title;
	}

	/**
	 * Main title function.
	 *
	 * @param string $title       Title that might have already been set.
	 * @param string $sepinput    Separator determined in theme.
	 * @param string $seplocation Whether the separator should be left or right.
	 *
	 * @return string
	 */
	function title( $title, $sepinput = '-', $seplocation = '' ) {
		global $sep;

		$sep = $sepinput;

		if ( is_feed() )
			return $title;

		// This needs to be kept track of in order to generate
		// default titles for singular pages.
		$original_title = $title;

		// This conditional ensures that sites that use of wp_title(''); as the plugin
		// used to suggest will still work properly with these changes.
		if ( '' == trim( $sep ) && '' == $seplocation ) {
			$sep         = '-';
			$seplocation = 'right';
		} // In the event that $seplocation is left empty, the direction will be
		// determined by whether the site is in rtl mode or not. This is based
		// upon my findings that rtl sites tend to reverse the flow of the site titles.
		else if ( '' == $seplocation )
			$seplocation = ( is_rtl() ) ? 'left' : 'right';

		$sep = ' ' . trim( $sep ) . ' ';

		// This flag is used to determine if any additional
		// processing should be done to the title after the
		// main section of title generation completes.
		$modified_title = true;

		// This variable holds the page-specific title part
		// that is used to generate default titles.
		$title_part = '';

		if ( $this->is_home_static_page() ) {
			$title = $this->get_content_title();
		}
		else if ( $this->is_home_posts_page() ) {
			$title = $this->get_title_from_options( 'title-home' );
		}
		else if ( $this->is_posts_page() ) {
			$title = $this->get_content_title( get_post( get_option( 'page_for_posts' ) ) );
		}
		else if ( is_singular() ) {
			$title = $this->get_content_title();

			if ( empty( $title ) )
				$title_part = $original_title;
		}
		else if ( is_search() ) {
			$title = $this->get_title_from_options( 'title-search' );

			if ( empty( $title ) )
				$title_part = sprintf( __( 'Search for "%s"', 'wordpress-seo' ), esc_html( get_search_query() ) );
		}
		else if ( is_category() || is_tag() || is_tax() ) {
			$title = $this->get_taxonomy_title();

			if ( empty( $title ) ) {
				if ( is_category() )
					$title_part = single_cat_title( '', false );
				else if ( is_tag() )
					$title_part = single_tag_title( '', false );
				else if ( function_exists( 'single_term_title' ) ) {
					$title_part = single_term_title( '', false );
				}
				else {
					global $wp_query;
					$term       = $wp_query->get_queried_object();
					$title_part = $term->name;
				}
			}
		}
		else if ( is_author() ) {
			$title = $this->get_author_title();

			if ( empty( $title ) )
				$title_part = get_the_author_meta( 'display_name', get_query_var( 'author' ) );
		}
		else if ( function_exists( 'is_post_type_archive' ) && is_post_type_archive() ) {
			$post_type = get_query_var( 'post_type' );
			$title     = $this->get_title_from_options( 'title-ptarchive-' . $post_type );

			if ( empty( $title ) ) {
				$post_type_obj = get_post_type_object( $post_type );
				if ( isset( $post_type_obj->labels->menu_name ) )
					$title_part = $post_type_obj->labels->menu_name;
				else if ( isset( $post_type_obj->name ) )
					$title_part = $post_type_obj->name;
				else
					$title_part = ''; //To be determined what this should be
			}
		}
		else if ( is_archive() ) {
			$title = $this->get_title_from_options( 'title-archive' );

			if ( empty( $title ) ) {
				if ( is_month() )
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), single_month_title( ' ', false ) );
				else if ( is_year() )
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), get_query_var( 'year' ) );
				else if ( is_day() )
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), get_the_date() );
				else
					$title_part = __( 'Archives', 'wordpress-seo' );
			}
		}
		else if ( is_404() ) {

			if ( 0 !== get_query_var( 'year' ) || ( 0 !== get_query_var( 'monthnum' ) || 0 !== get_query_var( 'day' ) ) ) {

				if ( 0 !== get_query_var( 'day' ) ) {

					global $post;
					$original_p      = $post;
					$post->post_date = sprintf( "%04d-%02d-%02d 00:00:00", get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
					$title_part      = sprintf( __( '%s Archives', 'wordpress-seo' ), get_the_date() );
					$post            = $original_p;
				}
				else if ( 0 !== get_query_var( 'monthnum' ) ) {
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), single_month_title( ' ', false ) );
				}
				else if ( 0 !== get_query_var( 'year' ) ) {
					$title_part = sprintf( __( '%s Archives', 'wordpress-seo' ), get_query_var( 'year' ) );
				}
				else {
					$title_part = __( 'Archives', 'wordpress-seo' );
				}
			}
			else {
				$title = $this->get_title_from_options( 'title-404' );

				if ( empty( $title ) )
					$title_part = __( 'Page not found', 'wordpress-seo' );
			}
		}
		else {
			// In case the page type is unknown, leave the title alone.
			$modified_title = false;

			// If you would like to generate a default title instead,
			// the following code could be used instead of the line above:
			// $title_part = $title;
		}

		if ( ( $modified_title && empty( $title ) ) || ! empty( $title_part ) )
			$title = $this->get_default_title( $sep, $seplocation, $title_part );

		if ( defined( 'ICL_LANGUAGE_CODE' ) && false !== strpos( $title, ICL_LANGUAGE_CODE ) )
			$title = str_replace( ' @' . ICL_LANGUAGE_CODE, '', $title );

		return esc_html( strip_tags( stripslashes( apply_filters( 'wpseo_title', $title ) ) ) );
	}

	/**
	 * Function used when title needs to be force overridden.
	 *
	 * @return string
	 */
	function force_wp_title() {
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
	 * @param bool $echo Whether or not to echo the debug marker.
	 *
	 * @return string
	 */
	public function debug_marker( $echo = true ) {
		$marker = "<!-- This site is optimized with the Yoast WordPress SEO plugin v" . WPSEO_VERSION . " - http://yoast.com/wordpress/seo/ -->";
		if ( $echo === false )
			return $marker;
		else
			echo "\n${marker}\n";
	}

	/**
	 * Output Webmaster Tools authentication strings
	 */
	public function webmaster_tools_authentication() {
		if ( is_front_page() ) {
			if ( ! empty( $this->options['googleverify'] ) ) {
				$google_meta = $this->options['googleverify'];
				if ( strpos( $google_meta, 'content' ) ) {
					preg_match( '`content="([^"]+)"`', $google_meta, $match );
					$google_meta = $match[1];
				}
				echo "<meta name=\"google-site-verification\" content=\"$google_meta\" />\n";
			}

			if ( ! empty( $this->options['msverify'] ) ) {
				$bing_meta = $this->options['msverify'];
				if ( strpos( $bing_meta, 'content' ) ) {
					preg_match( '`content="([^"]+)"`', $bing_meta, $match );
					$bing_meta = $match[1];
				}
				echo "<meta name=\"msvalidate.01\" content=\"$bing_meta\" />\n";
			}

			if ( ! empty( $this->options['alexaverify'] ) ) {
				echo "<meta name=\"alexaVerifyID\" content=\"" . esc_attr( $this->options['alexaverify'] ) . "\" />\n";
			}
		}
	}

	/**
	 * Main wrapper function attached to wp_head. This combines all the output on the frontend of the WP SEO plugin.
	 */
	public function head() {
		global $wp_query;

		$old_wp_query = null;

		if ( ! $wp_query->is_main_query() ) {
			$old_wp_query = $wp_query;
			wp_reset_query();
		}

		do_action( 'wpseo_head' );

		echo "<!-- / Yoast WordPress SEO plugin. -->\n\n";

		if ( ! empty( $old_wp_query ) ) {
			$GLOBALS['wp_query'] = $old_wp_query;
			unset( $old_wp_query );
		}

		return;
	}

	/**
	 * Output the meta robots value.
	 */
	public function robots() {
		global $wp_query;

		$robots           = array();
		$robots['index']  = 'index';
		$robots['follow'] = 'follow';
		$robots['other']  = array();

		if ( is_singular() ) {
			global $post;
			if ( isset( $this->options['noindex-' . $post->post_type] ) && $this->options['noindex-' . $post->post_type] )
				$robots['index'] = 'noindex';
			if ( (int) wpseo_get_value( 'meta-robots-noindex' ) === 1 )
				$robots['index'] = 'noindex';
			if ( wpseo_get_value( 'meta-robots-nofollow' ) )
				$robots['follow'] = 'nofollow';
			if ( wpseo_get_value( 'meta-robots-adv' ) && wpseo_get_value( 'meta-robots-adv' ) != 'none' ) {
				foreach ( explode( ',', wpseo_get_value( 'meta-robots-adv' ) ) as $r ) {
					$robots['other'][] = $r;
				}
			}
		}
		else {
			if ( is_search() ) {
				$robots['index'] = 'noindex';
			}
			else if ( is_tax() || is_tag() || is_category() ) {
				$term = $wp_query->get_queried_object();
				if ( isset( $this->options['noindex-' . $term->taxonomy] ) && $this->options['noindex-' . $term->taxonomy] )
					$robots['index'] = 'noindex';

				// Three possible values, index, noindex and default, do nothing for default
				$term_meta = wpseo_get_term_meta( $term, $term->taxonomy, 'noindex' );
				if ( 'noindex' == $term_meta || 'on' == $term_meta ) // on is for backwards compatibility
					$robots['index'] = 'noindex';

				if ( 'index' == $term_meta )
					$robots['index'] = 'index';
			}
			else if (
					( is_author() && isset( $this->options['noindex-author'] ) && $this->options['noindex-author'] ) ||
					( is_date() && isset( $this->options['noindex-archive'] ) && $this->options['noindex-archive'] ) ||
					( is_home() && get_query_var( 'paged' ) > 1 )
			) {
				$robots['index'] = 'noindex';
			}
			else if ( function_exists( 'is_post_type_archive' ) && is_post_type_archive() ) {
				$post_type = get_query_var( 'post_type' );
				if ( isset( $this->options['noindex-ptarchive-' . $post_type] ) && $this->options['noindex-ptarchive-' . $post_type] )
					$robots['index'] = 'noindex';
			}

			if ( isset( $wp_query->query_vars['paged'] ) && ( $wp_query->query_vars['paged'] && $wp_query->query_vars['paged'] > 1 ) && ( isset( $this->options['noindex-subpages'] ) && $this->options['noindex-subpages'] ) ) {
				$robots['index']  = 'noindex';
				$robots['follow'] = 'follow';
			}
		}

		foreach ( array( 'noodp', 'noydir' ) as $robot ) {
			if ( isset( $this->options[$robot] ) && $this->options[$robot] ) {
				$robots['other'][] = $robot;
			}
		}

		$robotsstr = $robots['index'] . ',' . $robots['follow'];

		$robots['other'] = array_unique( $robots['other'] );
		foreach ( $robots['other'] as $robot ) {
			$robotsstr .= ',' . $robot;
		}

		$robotsstr = preg_replace( '`^index,follow,?`', '', $robotsstr );

		$robotsstr = apply_filters( 'wpseo_robots', $robotsstr );

		if ( $robotsstr != '' )
			echo '<meta name="robots" content="' . esc_attr( $robotsstr ) . '"/>' . "\n";
	}

	/**
	 * This function normally outputs the canonical but is also used in other places to retrieve the canonical URL
	 * for the current page.
	 *
	 * @param bool $echo    Whether or not to output the canonical element.
	 * @param bool $un_paged Whether or not to return the canonical with or without pagination added to the URL.
	 * @param bool $no_override Whether or not to return a manually overridden canonical
	 *
	 * @return string $canonical
	 */
	public function canonical( $echo = true, $un_paged = false, $no_override = false ) {
		$canonical = false;
		$skip_pagination = false;

		// Set decent canonicals for homepage, singulars and taxonomy pages
		if ( is_singular() ) {
			if ( ! $no_override && wpseo_get_value( 'canonical' ) && wpseo_get_value( 'canonical' ) != '' ) {
				$canonical = wpseo_get_value( 'canonical' );
				$skip_pagination = true;
			} else {
				$obj       = get_queried_object();
				$canonical = get_permalink( $obj->ID );

				// Fix paginated pages canonical, but only if the page is truly paginated.
				if ( get_query_var( 'page' ) > 1 ) {
					global $wp_rewrite;
					$numpages = substr_count( $obj->post_content, '<!--nextpage-->' ) + 1;
					if ( $numpages && get_query_var( 'page' ) <= $numpages ) {
						if ( ! $wp_rewrite->using_permalinks() ) {
							$canonical = add_query_arg( 'page', get_query_var( 'page' ), $canonical );
						}
						else {
							$canonical = user_trailingslashit( trailingslashit( $canonical ) . get_query_var( 'page' ) );
						}
					}
				}
			}
		}
		else {
			if ( is_search() ) {
				$canonical = get_search_link();
			}
			else if ( is_front_page() ) {
				$canonical = home_url( '/' );
			}
			else if ( $this->is_posts_page() ) {
				$canonical = get_permalink( get_option( 'page_for_posts' ) );
			}
			else if ( is_tax() || is_tag() || is_category() ) {
				$term      = get_queried_object();
				if ( ! $no_override ) {
					$canonical = wpseo_get_term_meta( $term, $term->taxonomy, 'canonical' );
					if ( $canonical )
						$skip_pagination = true;
				}
				if ( ! $canonical )
					$canonical = get_term_link( $term, $term->taxonomy );
			}
			else if ( function_exists( 'get_post_type_archive_link' ) && is_post_type_archive() ) {
				$canonical = get_post_type_archive_link( get_query_var( 'post_type' ) );
			}
			else if ( is_author() ) {
				$canonical = get_author_posts_url( get_query_var( 'author' ), get_query_var( 'author_name' ) );
			}
			else if ( is_archive() ) {
				if ( is_date() ) {
					if ( is_day() ) {
						$canonical = get_day_link( get_query_var( 'year' ), get_query_var( 'monthnum' ), get_query_var( 'day' ) );
					}
					else if ( is_month() ) {
						$canonical = get_month_link( get_query_var( 'year' ), get_query_var( 'monthnum' ) );
					}
					else if ( is_year() ) {
						$canonical = get_year_link( get_query_var( 'year' ) );
					}
				}
			}

			if ( $canonical && $un_paged )
				return $canonical;

			if ( $canonical && ! $skip_pagination && get_query_var( 'paged' ) > 1 ) {
				global $wp_rewrite;
				if ( ! $wp_rewrite->using_permalinks() ) {
					$canonical = add_query_arg( 'paged', get_query_var( 'paged' ), $canonical );
				}
				else {
					if ( is_front_page() ) {
						$base      = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '/';
						$canonical = home_url( $base );
					}
					$canonical = user_trailingslashit( trailingslashit( $canonical ) . trailingslashit( $wp_rewrite->pagination_base ) . get_query_var( 'paged' ) );
				}
			}
		}

		if ( $canonical && isset( $this->options['force_transport'] ) && 'default' != $this->options['force_transport'] ) {
			$canonical = preg_replace( '`^http[s]?`', $this->options['force_transport'], $canonical );
		}

		$canonical = apply_filters( 'wpseo_canonical', $canonical );

		if ( $canonical && ! is_wp_error( $canonical ) ) {
			if ( $echo !== false )
				echo '<link rel="canonical" href="' . esc_url( $canonical, null, 'other' ) . '" />' . "\n";
			else
				return $canonical;
		}
		else {
			return false;
		}
	}

	/**
	 * Adds 'prev' and 'next' links to archives.
	 *
	 * @link  http://googlewebmastercentral.blogspot.com/2011/09/pagination-with-relnext-and-relprev.html
	 * @since 1.0.3
	 */
	public function adjacent_rel_links() {
		// Don't do this for Genesis, as the way Genesis handles homepage functionality is different and causes issues sometimes.
		if ( is_home() && function_exists( 'genesis' ) && apply_filters( 'wpseo_genesis_force_adjacent_rel_home', false ) === false )
			return;

		global $wp_query;

		if ( ! is_singular() ) {
			$url = $this->canonical( false, true, true );

			if ( is_string( $url ) && $url !== '' ) {
				$paged = get_query_var( 'paged' );

				if ( 0 == $paged )
					$paged = 1;

				if ( $paged == 2 )
					$this->adjacent_rel_link( "prev", $url, $paged - 1, true );

				// Make sure to use index.php when needed, done after paged == 2 check so the prev links to homepage will not have index.php erroneously.
				if ( is_front_page() ) {
					$base = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '/';
					$url  = home_url( $base );
				}

				if ( $paged > 2 )
					$this->adjacent_rel_link( "prev", $url, $paged - 1, true );

				if ( $paged < $wp_query->max_num_pages )
					$this->adjacent_rel_link( "next", $url, $paged + 1, true );
			}
		}
		else {
			$numpages = 0;
			if ( isset( $wp_query->post->post_content ) ) {
				$numpages = substr_count( $wp_query->post->post_content, '<!--nextpage-->' ) + 1;
			}
			if ( $numpages > 1 ) {
				$page = get_query_var( 'page' );
				if ( ! $page )
					$page = 1;

				$url = get_permalink( $wp_query->post->ID );

				// If the current page is the frontpage, pagination should use /base/
				if ( $this->is_home_static_page() )
					$usebase = true;
				else
					$usebase = false;

				if ( $page > 1 )
					$this->adjacent_rel_link( "prev", $url, $page - 1, $usebase, 'single_paged' );
				if ( $page < $numpages )
					$this->adjacent_rel_link( "next", $url, $page + 1, $usebase, 'single_paged' );
			}
		}
	}

	/**
	 * Get adjacent pages link for archives
	 *
	 * @param string  $rel                  Link relationship, prev or next.
	 * @param string  $url                  the unpaginated URL of the current archive.
	 * @param string  $page                 the page number to add on to $url for the $link tag.
	 * @param boolean $incl_pagination_base whether or not to include /page/ or not.
	 *
	 * @return string $link link element
	 *
	 * @since 1.0.2
	 */
	private function adjacent_rel_link( $rel, $url, $page, $incl_pagination_base ) {
		global $wp_rewrite;
		if ( ! $wp_rewrite->using_permalinks() ) {
			if ( $page > 1 )
				$url = add_query_arg( 'paged', $page, $url );
		}
		else {
			if ( $page > 1 ) {
				$base = '';
				if ( $incl_pagination_base )
					$base = trailingslashit( $wp_rewrite->pagination_base );
				$url = user_trailingslashit( trailingslashit( $url ) . $base . $page );
			}
		}
		$link = apply_filters( "wpseo_" . $rel . "_rel_link", "<link rel=\"$rel\" href=\"$url\" />\n" );

		if ( $link )
			echo $link;
	}

	/**
	 * Output the rel=publisher code on every page of the site.
	 */
	public function publisher() {
		if ( isset( $this->options['plus-publisher'] ) && ! empty( $this->options['plus-publisher'] ) )
			echo '<link rel="publisher" href="' . esc_attr( $this->options['plus-publisher'] ) . '"/>' . "\n";
	}

	/**
	 * Outputs the rel=author
	 */
	public function author() {
		$gplus = false;

		if ( is_home() || is_front_page() ) {
			if ( isset( $this->options['plus-author'] ) && $this->options['plus-author'] != - 1 )
				$gplus = get_the_author_meta( 'googleplus', $this->options['plus-author'] );

		}
		else if ( is_singular() ) {
			global $post;
			$gplus = get_the_author_meta( 'googleplus', $post->post_author );

			// unset gplus when authorship is disabled for this post type
			if ( isset( $this->options['noauthorship-' . $post->post_type] ) && $this->options['noauthorship-' . $post->post_type] ) {
				$gplus = false;
			}
		}

		$gplus = apply_filters( 'wpseo_author_link', $gplus );

		if ( $gplus )
			echo '<link rel="author" href="' . $gplus . '"/>' . "\n";

	}

	/**
	 * Outputs the meta keywords element.
	 *
	 * @return string
	 */
	public function metakeywords() {
		global $wp_query;

		if ( ! isset( $this->options['usemetakeywords'] ) || ! $this->options['usemetakeywords'] )
			return;

		$metakey = '';

		if ( is_singular() ) {
			global $post;
			$metakey = wpseo_get_value( 'metakeywords' );
			if ( isset( $this->options['metakey-' . $post->post_type] ) && ( ! $metakey || empty( $metakey ) ) ) {
				$metakey = wpseo_replace_vars( $this->options['metakey-' . $post->post_type], (array) $post );
			}
		}
		else {
			if ( $this->is_home_posts_page() && isset( $this->options['metakey-home'] ) ) {
				$metakey = wpseo_replace_vars( $this->options['metakey-home'], array() );
			}
			else if ( $this->is_home_static_page() ) {
				global $post;
				$metakey = wpseo_get_value( 'metakey' );
				if ( ( $metakey == '' || ! $metakey ) && isset( $this->options['metakey-' . $post->post_type] ) )
					$metakey = wpseo_replace_vars( $this->options['metakey-' . $post->post_type], (array) $post );
			}
			else if ( is_category() || is_tag() || is_tax() ) {
				$term = $wp_query->get_queried_object();

				$metakey = wpseo_get_term_meta( $term, $term->taxonomy, 'metakey' );
				if ( ! $metakey && isset( $this->options['metakey-' . $term->taxonomy] ) )
					$metakey = wpseo_replace_vars( $this->options['metakey-' . $term->taxonomy], (array) $term );
			}
			else if ( is_author() ) {
				$author_id = get_query_var( 'author' );
				$metakey   = get_the_author_meta( 'metakey', $author_id );
				if ( ! $metakey && isset( $this->options['metakey-author'] ) )
					$metakey = wpseo_replace_vars( $this->options['metakey-author'], (array) $wp_query->get_queried_object() );
			}

		}

		$metakey = apply_filters( 'wpseo_metakey', trim( $metakey ) );

		if ( ! empty( $metakey ) )
			echo '<meta name="keywords" content="' . esc_attr( strip_tags( stripslashes( $metakey ) ) ) . '"/>' . "\n";

	}

	/**
	 * Outputs the meta description element or returns the description text.
	 *
	 * @param bool $echo Whether or not to echo the description.
	 *
	 * @return string
	 */
	public function metadesc( $echo = true ) {
		if ( get_query_var( 'paged' ) && get_query_var( 'paged' ) > 1 )
			return;

		global $post, $wp_query;

		$metadesc = '';
		if ( is_singular() ) {
			$metadesc = wpseo_get_value( 'metadesc' );
			if ( $metadesc == '' || ! $metadesc ) {
				if ( ( isset( $post ) && isset( $this->options['metadesc-' . $post->post_type] ) ) && $this->options['metadesc-' . $post->post_type] != '' )
					$metadesc = wpseo_replace_vars( $this->options['metadesc-' . $post->post_type], (array) $post );
			}
		}
		else {
			if ( is_search() ) {
				$metadesc = '';
			}
			else if ( $this->is_home_posts_page() && isset( $this->options['metadesc-home'] ) ) {
				$metadesc = wpseo_replace_vars( $this->options['metadesc-home'], array() );
			}
			else if ( $this->is_posts_page() ) {
				$metadesc = wpseo_get_value( 'metadesc', get_option( 'page_for_posts' ) );
				if ( ( $metadesc == '' || ! $metadesc ) && ( isset( $post ) && isset( $this->options['metadesc-' . $post->post_type] ) ) ) {
					$page     = get_post( get_option( 'page_for_posts' ) );
					$metadesc = wpseo_replace_vars( $this->options['metadesc-' . $post->post_type], (array) $page );
				}
			}
			else if ( $this->is_home_static_page() ) {
				global $post;
				$metadesc = wpseo_get_value( 'metadesc' );
				if ( ( $metadesc == '' || ! $metadesc ) && ( isset( $post ) && isset( $this->options['metadesc-' . $post->post_type] ) ) )
					$metadesc = wpseo_replace_vars( $this->options['metadesc-' . $post->post_type], (array) $post );
			}
			else if ( is_category() || is_tag() || is_tax() ) {
				$term = $wp_query->get_queried_object();

				$metadesc = wpseo_get_term_meta( $term, $term->taxonomy, 'desc' );
				if ( ! $metadesc && isset( $this->options['metadesc-' . $term->taxonomy] ) )
					$metadesc = wpseo_replace_vars( $this->options['metadesc-' . $term->taxonomy], (array) $term );
			}
			else if ( is_author() ) {
				$author_id = get_query_var( 'author' );
				$metadesc  = get_the_author_meta( 'wpseo_metadesc', $author_id );
				if ( ! $metadesc && isset( $this->options['metadesc-author'] ) )
					$metadesc = wpseo_replace_vars( $this->options['metadesc-author'], (array) $wp_query->get_queried_object() );
			}
			else if ( function_exists( 'is_post_type_archive' ) && is_post_type_archive() ) {
				$post_type = get_query_var( 'post_type' );
				if ( isset( $this->options['metadesc-ptarchive-' . $post_type] ) && '' != $this->options['metadesc-ptarchive-' . $post_type] ) {
					$metadesc = wpseo_replace_vars( $this->options['metadesc-ptarchive-' . $post_type], (array) $wp_query->get_queried_object() );
				}
			}
			else if ( is_archive() ) {
				if ( isset( $this->options['metadesc-archive'] ) && '' != $this->options['metadesc-archive'] ) {
					$metadesc = wpseo_replace_vars( $this->options['metadesc-archive'], (array) $wp_query->get_queried_object() );
				}
			}
		}

		$metadesc = apply_filters( 'wpseo_metadesc', trim( $metadesc ) );

		if ( $echo !== false ) {
			if ( ! empty( $metadesc ) )
				echo '<meta name="description" content="' . esc_attr( strip_tags( stripslashes( $metadesc ) ) ) . '"/>' . "\n";
			else if ( current_user_can( 'manage_options' ) && is_singular() )
				echo '<!-- ' . __( 'Admin only notice: this page doesn\'t show a meta description because it doesn\'t have one, either write it for this page specifically or go into the SEO -> Titles menu and set up a template.', 'wordpress-seo' ) . ' -->' . "\n";
		}
		else {
			return $metadesc;
		}

	}

	/**
	 * Based on the redirect meta value, this function determines whether it should redirect the current post / page.
	 *
	 * @return mixed
	 */
	function page_redirect() {
		if ( is_singular() ) {
			global $post;
			if ( ! isset( $post ) )
				return;
			$redir = wpseo_get_value( 'redirect', $post->ID );
			if ( ! empty( $redir ) ) {
				wp_redirect( $redir, 301 );
				exit;
			}
		}
	}

	/**
	 * Outputs noindex values for the current page.
	 */
	public function noindex_page() {
		echo '<meta name="robots" content="noindex" />' . "\n";
	}

	/**
	 * Send a Robots HTTP header preventing feeds from being indexed in the search results while allowing search engines to follow the links in the feed.
	 *
	 * @since 1.1.7
	 */
	public function noindex_feed() {
		if ( is_feed() && headers_sent() === false )
			header( "X-Robots-Tag: noindex,follow", true );
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
	 */
	function archive_redirect() {
		global $wp_query;

		if (
				( isset( $this->options['disable-date'] ) && $this->options['disable-date'] && $wp_query->is_date ) ||
				( isset( $this->options['disable-author'] ) && $this->options['disable-author'] && $wp_query->is_author ) ||
				( isset( $this->options['disable-post_formats'] ) && $this->options['disable-post_formats'] && $wp_query->is_tax( 'post_format' ) )
		) {
			wp_safe_redirect( get_bloginfo( 'url' ), 301 );
			exit;
		}
	}

	/**
	 * If the option to redirect attachments to their parent is checked, this performs the redirect.
	 *
	 * An extra check is done for when the attachment has no parent.
	 */
	function attachment_redirect() {
		global $post;
		if ( is_attachment() && isset( $post->post_parent ) && is_numeric( $post->post_parent ) && $post->post_parent != 0 ) {
			wp_safe_redirect( get_permalink( $post->post_parent ), 301 );
			exit;
		}
	}

	/**
	 * Trailing slashes for everything except is_single().
	 *
	 * Thanks to Mark Jaquith for this code.
	 *
	 * @param string $url
	 * @param string $type
	 *
	 * @return string
	 */
	function add_trailingslash( $url, $type ) {
		if ( 'single' === $type || 'single_paged' === $type ) {
			return $url;
		}
		else {
			return trailingslashit( $url );
		}
	}

	/**
	 * Removes the ?replytocom variable from the link, replacing it with a #comment-<number> anchor.
	 *
	 * @todo Should this function also allow for relative urls ?
	 *
	 * @param string $link The comment link as a string.
	 *
	 * @return string
	 */
	public function remove_reply_to_com( $link ) {
		return preg_replace( '`href=(["\'])(?:.*(?:\?|&|&#038;)replytocom=(\d+)#respond)`', 'href=$1#comment-$2', $link );
	}

	/**
	 * Redirect out the ?replytocom variables when cleanreplytocom is enabled
	 *
	 * @since 1.4.13
	 */
	function replytocom_redirect() {
		if ( ! isset( $this->options['cleanreplytocom'] ) || ! $this->options['cleanreplytocom'] )
			return;

		if ( isset( $_GET['replytocom'] ) && is_singular() ) {
			global $post;
			$url          = get_permalink( $post->ID );
			$hash         = $_GET['replytocom'];
			$query_string = remove_query_arg( 'replytocom', $_SERVER['QUERY_STRING'] );
			if ( ! empty( $query_string ) )
				$url .= '?' . $query_string;
			$url .= '#comment-' . $hash;
			wp_safe_redirect( $url, 301 );
			exit;
		}
	}

	/**
	 * Removes unneeded query variables from the URL.
	 */
	public function clean_permalink() {
		if ( is_robots() || get_query_var( 'sitemap' ) )
			return;

		global $wp_query;

		// Recreate current URL
		$cururl = 'http';
		if ( isset( $_SERVER["HTTPS"] ) && $_SERVER["HTTPS"] == "on" ) {
			$cururl .= "s";
		}
		$cururl .= "://";
		if ( $_SERVER["SERVER_PORT"] != "80" && $_SERVER["SERVER_PORT"] != "443")
			$cururl .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
		else
			$cururl .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

		$properurl = '';

		if ( is_singular() ) {
			global $post;
			if ( empty( $post ) )
				$post = $wp_query->get_queried_object();

			$properurl = get_permalink( $post->ID );

			$page = get_query_var( 'page' );
			if ( $page && $page != 1 ) {
				$post       = get_post( $post->ID );
				$page_count = substr_count( $post->post_content, '<!--nextpage-->' );
				if ( $page > ( $page_count + 1 ) )
					$properurl = user_trailingslashit( trailingslashit( $properurl ) . ( $page_count + 1 ) );
				else
					$properurl = user_trailingslashit( trailingslashit( $properurl ) . $page );
			}

			// Fix reply to comment links, whoever decided this should be a GET variable?
			$result = preg_match( '`(\?replytocom=[^&]+)`', $_SERVER["REQUEST_URI"], $matches );
			if ( $result )
				$properurl .= str_replace( '?replytocom=', '#comment-', $matches[0] );

			// Prevent cleaning out posts & page previews for people capable of viewing them
			if ( isset( $_GET['preview'] ) && isset( $_GET['preview_nonce'] ) && current_user_can( 'edit_post' ) )
				$properurl = '';
		}
		else if ( is_front_page() ) {
			if ( $this->is_home_posts_page() ) {
				$properurl = get_bloginfo( 'url' ) . '/';
			}
			elseif ( $this->is_home_static_page() ) {
				global $post;
				$properurl = get_permalink( $post->ID );
			}
		}
		else if ( is_category() || is_tag() || is_tax() ) {
			$term = $wp_query->get_queried_object();
			if ( is_feed() )
				$properurl = get_term_feed_link( $term->term_id, $term->taxonomy );
			else
				$properurl = get_term_link( $term, $term->taxonomy );
		}
		else if ( is_search() ) {
			$s         = preg_replace( '`(%20|\+)`', ' ', get_search_query() );
			$properurl = get_bloginfo( 'url' ) . '/?s=' . rawurlencode( $s );
		}
		else if ( is_404() ) {
			if ( function_exists( 'is_multisite' ) && is_multisite() && ! is_subdomain_install() && is_main_site() ) {
				if ( $cururl == get_bloginfo( 'url' ) . '/blog/' || $cururl == get_bloginfo( 'url' ) . '/blog' ) {
					if ( $this->is_home_static_page() )
						$properurl = get_permalink( get_option( 'page_for_posts' ) );
					else
						$properurl = get_bloginfo( 'url' ) . '/';
				}
			}
		}

		if ( ! empty( $properurl ) && $wp_query->query_vars['paged'] != 0 && $wp_query->post_count != 0 ) {
			if ( is_search() ) {
				$properurl = get_bloginfo( 'url' ) . '/page/' . $wp_query->query_vars['paged'] . '/?s=' . rawurlencode( get_search_query() );
			}
			else {
				$properurl = user_trailingslashit( trailingslashit( $properurl ) . 'page/' . $wp_query->query_vars['paged'] );
			}
		}

		// Prevent cleaning out the WP Subscription managers interface for everyone
		foreach ( array( 'wp-subscription-manager' ) as $get ) {
			if ( isset( $_GET[$get] ) ) {
				$properurl = '';
			}
		}

		// Allow plugins to register their own variables not to clean
		$whitelisted_extravars = apply_filters( 'wpseo_whitelist_permalink_vars', array() );

		if ( isset( $this->options['cleanpermalink-googlesitesearch'] ) && $this->options['cleanpermalink-googlesitesearch'] ) {
			// Prevent cleaning out Google Site searches
			$whitelisted_extravars = array_merge( $whitelisted_extravars, array( 'q', 'cx', 'debug', 'cof', 'ie', 'sa' ) );
		}

		if ( isset( $this->options['cleanpermalink-googlecampaign'] ) && $this->options['cleanpermalink-googlecampaign'] ) {
			// Prevent cleaning out Google Analytics campaign variables
			$whitelisted_extravars = array_merge( $whitelisted_extravars, array( 'utm_campaign', 'utm_medium', 'utm_source', 'utm_content', 'utm_term' ) );
		}

		if ( isset( $this->options['cleanpermalink-extravars'] ) && strlen( $this->options['cleanpermalink-extravars'] ) > 0 ) {
			$whitelisted_extravars = array_merge( $whitelisted_extravars, explode( ',', $this->options['cleanpermalink-extravars'] ) );
		}

		foreach ( $whitelisted_extravars as $get ) {
			if ( isset( $_GET[trim( $get )] ) ) {
				$properurl = '';
			}
		}

		if ( ! empty( $properurl ) && $cururl != $properurl ) {
			wp_safe_redirect( $properurl, 301 );
			exit;
		}
	}

	/**
	 * Replaces the possible RSS variables with their actual values.
	 *
	 * @param string $content The RSS content that should have the variables replaced.
	 *
	 * @return string
	 */
	function rss_replace_vars( $content ) {
		global $post;

		/**
		 * @param bool $unsigned Whether or not to follow the links in RSS feed, defaults to true.
		 *
		 * @since 1.4.20
		 */
		$no_follow      = apply_filters( 'nofollow_rss_links', true );
		$no_follow_attr = '';
		if ( $no_follow )
			$no_follow_attr = 'rel="nofollow" ';

		$author_link   = '<a rel="' . ( ( $no_follow ) ? 'nofollow ' : '' ) . 'author" href="' . get_author_posts_url( $post->post_author ) . '">' . get_the_author() . '</a>';
		$post_link     = '<a ' . $no_follow_attr . 'href="' . get_permalink() . '">' . get_the_title() . "</a>";
		$blog_link     = '<a ' . $no_follow_attr . 'href="' . get_bloginfo( 'url' ) . '">' . get_bloginfo( 'name' ) . '</a>';
		$blog_desc_link = '<a ' . $no_follow_attr . 'href="' . get_bloginfo( 'url' ) . '">' . get_bloginfo( 'name' ) . ' - ' . get_bloginfo( 'description' ) . '</a>';

		$content = stripslashes( trim( $content ) );
		$content = str_replace( "%%AUTHORLINK%%", $author_link, $content );
		$content = str_replace( "%%POSTLINK%%", $post_link, $content );
		$content = str_replace( "%%BLOGLINK%%", $blog_link, $content );
		$content = str_replace( "%%BLOGDESCLINK%%", $blog_desc_link, $content );
		return $content;
	}

	/**
	 * Adds the RSS footer (or header) to the full RSS feed item.
	 *
	 * @param string $content Feed item content.
	 *
	 * @return string
	 */
	function embed_rssfooter( $content ) {
		if ( is_feed() ) {
			$content = $this->embed_rss( $content, 'full' );
		}
		return $content;
	}

	/**
	 * Adds the RSS footer (or header) to the excerpt RSS feed item.
	 *
	 * @param string $content Feed item excerpt.
	 *
	 * @return string
	 */
	function embed_rssfooter_excerpt( $content ) {
		if ( is_feed() ) {
			$content = $this->embed_rss( $content, 'excerpt' );
		}
		return $content;
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
	function embed_rss( $content, $context = 'full' ) {
		if ( is_feed() ) {

			$before = '';
			$after  = '';

			if ( isset( $this->options['rssbefore'] ) && trim( $this->options['rssbefore'] ) !== '' ) {
				$before = $this->rss_replace_vars( $this->options['rssbefore'] );
				$before = ( $before !== '' ) ? '<p>' . $before . '</p>' : '';
			}
			if ( isset( $this->options['rssafter'] ) && trim( $this->options['rssafter'] ) !== '' ) {
				$after = $this->rss_replace_vars( $this->options['rssafter'] );
				$after = ( $after !== '' ) ? '<p>' . $after . '</p>' : '';
			}
			if ( $before !== '' || $after !== '' ) {
				if ( ( isset( $context ) && $context === 'excerpt' ) && trim( $content ) !== '' ) {
					$content = '<p>' . $content . '</p>';
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
	function flush_cache() {
		global $wp_query, $wpseo_ob, $sep;

		if ( ! $wpseo_ob )
			return;

		$content = ob_get_contents();

		$old_wp_query = $wp_query;

		wp_reset_query();

		$title = $this->title( '', $sep );

		// Find all titles, strip them out and add the new one in within the debug marker, so it's easily identified whether a site uses force rewrite.
		if ( preg_match_all( '`<title>(.*)?<\/title>`i', $content, $matches ) ) {
			$count = count( $matches[0] );
			if ( $count > 0 ) {
				$i = 0;
				while ( $count > $i ) {
					$content = str_replace( $matches[0][$i], '', $content );
					$i ++;
				}
			}
		}
		$content = str_replace( $this->debug_marker( false ), $this->debug_marker( false ) . "\n" . '<title>' . $title . '</title>', $content );

		ob_end_clean();

		$GLOBALS['wp_query'] = $old_wp_query;

		echo $content;
	}

	/**
	 * Starts the output buffer so it can later be fixed by flush_cache()
	 */
	function force_rewrite_output_buffer() {
		global $wpseo_ob;
		$wpseo_ob = true;
		ob_start();
	}

	/**
	 * Function used in testing whether the title should be force rewritten or not.
	 *
	 * @param string $title
	 *
	 * @return string
	 */
	function title_test_helper( $title ) {
		$this->options['title_test']++;
		update_option( 'wpseo_titles', $this->options );

		// Prevent this setting from being on forever when something breaks, as it breaks caching.
		if ( $this->options['title_test'] > 10 ) {
			unset( $this->options['title_test'] );
			update_option( 'wpseo_titles', $this->options );
			return $title;
		}

		if ( ! defined( 'DONOTCACHEPAGE' ) )
			define( 'DONOTCACHEPAGE', true );

		if ( ! defined( 'DONOTCACHCEOBJECT' ) )
			define( 'DONOTCACHCEOBJECT', true );

		if ( ! defined( 'DONOTMINIFY' ) )
			define( 'DONOTMINIFY', true );

		global $wp_version;
		if ( $_SERVER['HTTP_USER_AGENT'] == "WordPress/${wp_version}; " . get_bloginfo( 'url' ) . " - Yoast" )
			return 'This is a Yoast Test Title';
		return $title;
	}

}

function initialize_wpseo_front() {
	global $wpseo_front;
	$wpseo_front = new WPSEO_Frontend;
}

add_action( 'init', 'initialize_wpseo_front' );
