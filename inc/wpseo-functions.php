<?php
/**
 * @package Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}



if ( ! function_exists( 'initialize_wpseo_front' ) ) {
	function initialize_wpseo_front() {
		$GLOBALS['wpseo_front'] = new WPSEO_Frontend;
	}
}


if ( ! function_exists( 'yoast_breadcrumb' ) ) {
	/**
	 * Template tag for breadcrumbs.
	 *
	 * @param string $before  What to show before the breadcrumb.
	 * @param string $after   What to show after the breadcrumb.
	 * @param bool   $display Whether to display the breadcrumb (true) or return it (false).
	 * @return string
	 */
	function yoast_breadcrumb( $before = '', $after = '', $display = true ) {
		if ( ! isset( $GLOBALS['wpseo_bc'] ) ) {
			$GLOBALS['wpseo_bc'] = new WPSEO_Breadcrumbs;
		}
		return $GLOBALS['wpseo_bc']->breadcrumb( $before, $after, $display );
	}
}



/**
 * @param string $string the string to replace the variables in.
 * @param array  $args   the object some of the replacement values might come from, could be a post, taxonomy or term.
 * @param array  $omit   variables that should not be replaced by this function.
 * @return string
 */
function wpseo_replace_vars( $string, $args, $omit = array() ) {

	$args = (array) $args;

	$string = strip_tags( $string );

	// Let's see if we can bail super early.
	if ( strpos( $string, '%%' ) === false )
		return trim( preg_replace( '`\s+`u', ' ', $string ) );

	global $sep;
	if ( ! isset( $sep ) || empty( $sep ) )
		$sep = '-';

	$simple_replacements = array(
		'%%sep%%'          => $sep,
		'%%sitename%%'     => get_bloginfo( 'name' ),
		'%%sitedesc%%'     => get_bloginfo( 'description' ),
		'%%currenttime%%'  => date( get_option( 'time_format' ) ),
		'%%currentdate%%'  => date( get_option( 'date_format' ) ),
		'%%currentday%%'   => date( 'j' ),
		'%%currentmonth%%' => date( 'F' ),
		'%%currentyear%%'  => date( 'Y' ),
	);

	foreach ( $simple_replacements as $var => $repl ) {
		$string = str_replace( $var, $repl, $string );
	}

	// Let's see if we can bail early.
	if ( strpos( $string, '%%' ) === false )
		return trim( preg_replace( '`\s+`u', ' ', $string ) );

	global $wp_query;

	$defaults = array(
		'ID'            => '',
		'name'          => '',
		'post_author'   => '',
		'post_content'  => '',
		'post_date'     => '',
		'post_excerpt'  => '',
		'post_modified' => '',
		'post_title'    => '',
		'taxonomy'      => '',
		'term_id'       => '',
		'term404'		=> '',
	);

	if ( isset( $args['post_content'] ) )
		$args['post_content'] = wpseo_strip_shortcode( $args['post_content'] );
	if ( isset( $args['post_excerpt'] ) )
		$args['post_excerpt'] = wpseo_strip_shortcode( $args['post_excerpt'] );

	$r = (object) wp_parse_args( $args, $defaults );

	$max_num_pages = 1;
	if ( ! is_single() ) {
		$pagenum = get_query_var( 'paged' );
		if ( $pagenum === 0 )
			$pagenum = 1;

		if ( isset( $wp_query->max_num_pages ) && $wp_query->max_num_pages != '' && $wp_query->max_num_pages != 0 )
			$max_num_pages = $wp_query->max_num_pages;
	}
	else {
		global $post;
		$pagenum       = get_query_var( 'page' );
		$max_num_pages = ( isset( $post->post_content ) ) ? substr_count( $post->post_content, '<!--nextpage-->' ) : 1;
		if ( $max_num_pages >= 1 )
			$max_num_pages++;
	}

	// Let's do date first as it's a bit more work to get right.
	if ( $r->post_date != '' ) {
		$date = mysql2date( get_option( 'date_format' ), $r->post_date );
	}
	else {
		if ( get_query_var( 'day' ) && get_query_var( 'day' ) != '' ) {
			$date = get_the_date();
		}
		else {
			if ( single_month_title( ' ', false ) && single_month_title( ' ', false ) != '' ) {
				$date = single_month_title( ' ', false );
			}
			else if ( get_query_var( 'year' ) != '' ) {
				$date = get_query_var( 'year' );
			}
			else {
				$date = '';
			}
		}
	}

	$replacements = array(
		'%%date%%'         => $date,
		'%%searchphrase%%' => esc_html( get_query_var( 's' ) ),
		'%%page%%'         => ( $max_num_pages > 1 && $pagenum > 1 ) ? sprintf( $sep . ' ' . __( 'Page %d of %d', 'wordpress-seo' ), $pagenum, $max_num_pages ) : '',
		'%%pagetotal%%'    => $max_num_pages,
		'%%pagenumber%%'   => $pagenum,
		'%%term404%%'	   => sanitize_text_field( str_replace( '-', ' ', $r->term404 ) ),
	);

	if ( isset( $r->ID ) ) {
		$replacements = array_merge(
			$replacements, array(
				'%%caption%%'      => $r->post_excerpt,
				'%%category%%'     => wpseo_get_terms( $r->ID, 'category' ),
				'%%excerpt%%'      => ( ! empty( $r->post_excerpt ) ) ? strip_tags( $r->post_excerpt ) : wp_html_excerpt( strip_shortcodes( $r->post_content ),155 ),
				'%%excerpt_only%%' => strip_tags( $r->post_excerpt ),
				'%%focuskw%%'      => WPSEO_Meta::get_value( 'focuskw', $r->ID ),
				'%%id%%'           => $r->ID,
				'%%modified%%'     => mysql2date( get_option( 'date_format' ), $r->post_modified ),
				'%%name%%'         => get_the_author_meta( 'display_name', ! empty( $r->post_author ) ? $r->post_author : get_query_var( 'author' ) ),
				'%%tag%%'          => wpseo_get_terms( $r->ID, 'post_tag' ),
				'%%title%%'        => stripslashes( $r->post_title ),
				'%%userid%%'       => ! empty( $r->post_author ) ? $r->post_author : get_query_var( 'author' ),
			)
		);
	}

	if ( ! empty( $r->taxonomy ) ) {
		$replacements = array_merge(
			$replacements, array(
				'%%category_description%%' => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
				'%%tag_description%%'      => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
				'%%term_description%%'     => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
				'%%term_title%%'           => $r->name,
			)
		);
	}

	foreach ( $replacements as $var => $repl ) {
		if ( ! in_array( $var, $omit ) ) {
			$string = str_replace( $var, $repl, $string );
		}
	}

	if ( strpos( $string, '%%' ) === false ) {
		$string = preg_replace( '`\s+`u', ' ', $string );
		return trim( $string );
	}

	if ( isset( $wp_query->query_vars['post_type'] ) && preg_match_all( '`%%pt_([^%]+)%%`u', $string, $matches, PREG_SET_ORDER ) ) {
		$pt        = get_post_type_object( $wp_query->query_vars['post_type'] );
		$pt_plural = $pt_singular = $pt->name;
		if ( isset( $pt->labels->singular_name ) ) {
			$pt_singular = $pt->labels->singular_name;
		}
		if ( isset( $pt->labels->name ) ) {
			$pt_plural = $pt->labels->name;
		}
		$string = str_replace( '%%pt_single%%', $pt_singular, $string );
		$string = str_replace( '%%pt_plural%%', $pt_plural, $string );
	}

	if ( preg_match_all( '`%%cf_([^%]+)%%`u', $string, $matches, PREG_SET_ORDER ) ) {
		global $post;
		foreach ( $matches as $match ) {
			$string = str_replace( $match[0], get_post_meta( $post->ID, $match[1], true ), $string );
		}
	}

	if ( preg_match_all( '`%%ct_desc_([^%]+)?%%`u', $string, $matches, PREG_SET_ORDER ) ) {
		global $post;
		foreach ( $matches as $match ) {
			$terms = get_the_terms( $post->ID, $match[1] );
			if ( is_array( $terms ) && $terms !== array() ) {
				$term   = current( $terms );
				$string = str_replace( $match[0], get_term_field( 'description', $term->term_id, $match[1] ), $string );
			}
			else {
				// Make sure that the variable is removed ?
				$string = str_replace( $match[0], '', $string );

				/* Check for WP_Error object (=invalid taxonomy entered) and if it's an error,
				 notify in admin dashboard */
				if ( is_wp_error( $terms ) && is_admin() ) {
					add_action( 'admin_notices', 'wpseo_invalid_custom_taxonomy' );
				}
			}
		}
	}

	if ( preg_match_all( '`%%ct_([^%]+)%%(single%%)?`u', $string, $matches, PREG_SET_ORDER ) ) {
		foreach ( $matches as $match ) {
			$single = false;
			if ( isset( $match[2] ) && $match[2] == 'single%%' ) {
				$single = true;
			}
			$ct_terms = wpseo_get_terms( $r->ID, $match[1], $single );

			$string = str_replace( $match[0], $ct_terms, $string );
		}
	}

	$string = preg_replace( '`\s+`u', ' ', $string );
	return trim( $string );
}


/**
 * Throw a notice about an invalid custom taxonomy used
 *
 * @since 1.4.14
 */
function wpseo_invalid_custom_taxonomy() {
	echo '<div class="error"><p>' . sprintf( __( 'The taxonomy you used in (one of your) %s variables is <strong>invalid</strong>. Please %sadjust your settings%s.' ), '%%ct_desc_&lt;custom-tax-name&gt;%%', '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#top#taxonomies' ) ) . '">', '</a>' ) . '</p></div>';
}



/**
 * Retrieve a post's terms, comma delimited.
 *
 * @param int    $id            ID of the post to get the terms for.
 * @param string $taxonomy      The taxonomy to get the terms for this post from.
 * @param bool   $return_single If true, return the first term.
 * @return string either a single term or a comma delimited string of terms.
 */
function wpseo_get_terms( $id, $taxonomy, $return_single = false ) {

	$output = '';

	// If we're on a specific tag, category or taxonomy page, use that.
	if ( is_category() || is_tag() || is_tax() ) {
		global $wp_query;
		$term   = $wp_query->get_queried_object();
		$output = $term->name;
	}
	else if ( ! empty( $id ) && ! empty( $taxonomy ) ) {
		$terms = get_the_terms( $id, $taxonomy );
		if ( $terms ) {
			foreach ( $terms as $term ) {
				if ( $return_single ) {
					$output = $term->name;
					break;
				}
				else {
					$output .= $term->name . ', ';
				}
			}
			$output = rtrim( trim( $output ), ',' );
		}
	}
	/**
	 * Allows filtering of the terms list used to replace %%category%%, %%tag%% and %%ct_<custom-tax-name>%% variables
	 * @api	string	$output	Comma-delimited string containing the terms
	 */
	return apply_filters( 'wpseo_terms', $output );
}


/**
 * Strip out the shortcodes with a filthy regex, because people don't properly register their shortcodes.
 *
 * @param string $text input string that might contain shortcodes
 * @return string $text string without shortcodes
 */
function wpseo_strip_shortcode( $text ) {
	return preg_replace( '`\[[^\]]+\]`s', '', $text );
}

/**
 * Redirect /sitemap.xml to /sitemap_index.xml
 */
function wpseo_xml_redirect_sitemap() {
	global $wp_query;
	
	$current_url  = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] == 'on' ) ? 'https://' : 'http://';
	$current_url .= $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];

	// must be 'sitemap.xml' and must be 404
	if ( home_url( '/sitemap.xml' ) == $current_url && $wp_query->is_404 ) {
		wp_redirect( home_url( '/sitemap_index.xml' ) );
	}
}

/**
 * Initialize sitemaps. Add sitemap rewrite rules and query var
 */
function wpseo_xml_sitemaps_init() {
	$options = get_option( 'wpseo_xml' );
	if ( $options['enablexmlsitemap'] !== true )
		return;

	// redirects sitemap.xml to sitemap_index.xml
	add_action( 'template_redirect', 'wpseo_xml_redirect_sitemap', 0 );

	if ( ! is_object( $GLOBALS['wp'] ) ) {
		return;
	}

	$GLOBALS['wp']->add_query_var( 'sitemap' );
	$GLOBALS['wp']->add_query_var( 'sitemap_n' );
	$GLOBALS['wp']->add_query_var( 'xslt' );
	add_rewrite_rule( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' );
	add_rewrite_rule( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' );
	add_rewrite_rule( 'sitemap\.xslt$', 'index.php?xslt=1', 'top' );
}
add_action( 'init', 'wpseo_xml_sitemaps_init', 1 );

/**
 * Notify search engines of the updated sitemap.
 */
function wpseo_ping_search_engines( $sitemapurl = null ) {
	$options = get_option( 'wpseo_xml' );
	$base    = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '';
	if ( $sitemapurl == null ) {
		$sitemapurl = urlencode( home_url( $base . 'sitemap_index.xml' ) );
	}

	// Always ping Google and Bing, optionally ping Ask and Yahoo!
	wp_remote_get( 'http://www.google.com/webmasters/tools/ping?sitemap=' . $sitemapurl );
	wp_remote_get( 'http://www.bing.com/webmaster/ping.aspx?sitemap=' . $sitemapurl );

	if ( $options['xml_ping_yahoo'] === true ) {
		wp_remote_get( 'http://search.yahooapis.com/SiteExplorerService/V1/updateNotification?appid=3usdTDLV34HbjQpIBuzMM1UkECFl5KDN7fogidABihmHBfqaebDuZk1vpLDR64I-&url=' . $sitemapurl );
	}

	if ( $options['xml_ping_ask'] === true ) {
		wp_remote_get( 'http://submissions.ask.com/ping?sitemap=' . $sitemapurl );
	}
}
add_action( 'wpseo_ping_search_engines', 'wpseo_ping_search_engines' );


function wpseo_store_tracking_response() {
	if ( ! wp_verify_nonce( $_POST['nonce'], 'wpseo_activate_tracking' ) )
		die();

	$options = get_option( 'wpseo' );
	$options['tracking_popup_done'] = true;

	if ( $_POST['allow_tracking'] == 'yes' ) {
		$options['yoast_tracking'] = true;
	}
	else {
		$options['yoast_tracking'] = false;
	}

	update_option( 'wpseo', $options );
}
add_action( 'wp_ajax_wpseo_allow_tracking', 'wpseo_store_tracking_response' );

/**
 * WPML plugin support: Set titles for custom types / taxonomies as translatable.
 * It adds new keys to a wpml-config.xml file for a custom post type title, metadesc, title-ptarchive and metadesc-ptarchive fields translation.
 * Documentation: http://wpml.org/documentation/support/language-configuration-files/
 * 
 * @global $sitepress
 * @param array $config
 * @return array
 */
function wpseo_wpml_config( $config ) {
	global $sitepress;

	if ( ( is_array( $config ) && isset( $config['wpml-config']['admin-texts']['key'] ) ) && ( is_array( $config['wpml-config']['admin-texts']['key'] ) && $config['wpml-config']['admin-texts']['key'] !== array() ) ) {
		$admin_texts = $config['wpml-config']['admin-texts']['key'];
		foreach ( $admin_texts as $k => $val ) {
			if ( $val['attr']['name'] === 'wpseo_titles' ) {
				$translate_cp = array_keys( $sitepress->get_translatable_documents() );
				if ( is_array( $translate_cp ) && $translate_cp !== array() ) {
					foreach ( $translate_cp as $post_type ) {
						$admin_texts[$k]['key'][]['attr']['name'] = 'title-'. $post_type;
						$admin_texts[$k]['key'][]['attr']['name'] = 'metadesc-'. $post_type;
						$admin_texts[$k]['key'][]['attr']['name'] = 'metakey-'. $post_type;
						$admin_texts[$k]['key'][]['attr']['name'] = 'title-ptarchive-'. $post_type;
						$admin_texts[$k]['key'][]['attr']['name'] = 'metadesc-ptarchive-'. $post_type;
						$admin_texts[$k]['key'][]['attr']['name'] = 'metakey-ptarchive-'. $post_type;

						$translate_tax = $sitepress->get_translatable_taxonomies( false, $post_type );
						if ( is_array( $translate_tax ) && $translate_tax !== array() ) {
							foreach ( $translate_tax as $taxonomy ) {
								$admin_texts[$k]['key'][]['attr']['name'] = 'title-tax-'. $taxonomy;
								$admin_texts[$k]['key'][]['attr']['name'] = 'metadesc-tax-'. $taxonomy;
								$admin_texts[$k]['key'][]['attr']['name'] = 'metakey-tax-'. $taxonomy;
							}
						}
					}
				}
				break;
			}
		}
		$config['wpml-config']['admin-texts']['key'] = $admin_texts;
	}

	return $config;
}
add_filter( 'icl_wpml_config_array', 'wpseo_wpml_config' );


/**
 * Generate an HTML sitemap
 *
 * @param array $atts The attributes passed to the shortcode.
 *
 * @return string
 */
function wpseo_sitemap_handler( $atts ) {

	$atts = shortcode_atts(
		array(
			'authors'  => true,
			'pages'    => true,
			'posts'    => true,
			'archives' => true,
		),
		$atts
	);

	$display_authors  = ( $atts['authors'] === 'no' ) ? false : true;
	$display_pages    = ( $atts['pages'] === 'no' ) ? false : true;
	$display_posts    = ( $atts['posts'] === 'no' ) ? false : true;
	$display_archives = ( $atts['archives'] === 'no' ) ? false : true;

	$options = WPSEO_Options::get_all();

	// Delete the transient if any of these are no
	if ( $display_authors === 'no' || $display_pages === 'no' || $display_posts === 'no' ) {
		delete_transient( 'html-sitemap' );
	}

	// Get any existing copy of our transient data
	if ( false !== ( $output = get_transient( 'html-sitemap' ) ) ) {
		// $output .= 'CACHE'; // debug
		// return $output;
	}

	$output = '';

	// create author list
	if ( $display_authors ) {
		$output .= '<h2 id="authors">' . __( 'Authors', 'wordpress-seo' ) . '</h2><ul>';
		// use echo => false b/c shortcode format screws up
		$author_list = wp_list_authors(
			array(
				'exclude_admin' => false,
				'echo'          => false,
			)
		);
		$output .= $author_list;
		$output .= '</ul>';
	}

	// create page list
	if ( $display_pages ) {
		$output .= '<h2 id="pages">' . __( 'Pages', 'wordpress-seo' ) . '</h2><ul>';

		// Some query magic to retrieve all pages that should be excluded, while preventing noindex pages that are set to
		// "always" include in HTML sitemap from being excluded.
		// @todo check query efficiency using EXPLAIN

		$exclude_query  = "SELECT DISTINCT( post_id ) FROM {$GLOBALS['wpdb']->postmeta}
			WHERE ( ( meta_key = '" . WPSEO_Meta::$meta_prefix . "sitemap-html-include' AND meta_value = 'never' )
			  OR ( meta_key = '" . WPSEO_Meta::$meta_prefix . "meta-robots-noindex' AND meta_value = '1' ) )
			AND post_id NOT IN
				( SELECT pm2.post_id FROM {$GLOBALS['wpdb']->postmeta} pm2
						WHERE pm2.meta_key = '" . WPSEO_Meta::$meta_prefix . "sitemap-html-include' AND pm2.meta_value = 'always')
			ORDER BY post_id ASC";
		$excluded_pages = $GLOBALS['wpdb']->get_results( $exclude_query );

		$exclude = array();
		foreach ( $excluded_pages as $page ) {
			$exclude[] = $page->post_id;
		}
		unset( $excluded_pages, $page );

		/**
		 * This filter allows excluding more pages should you wish to from the HTML sitemap.
		 */
		$exclude = implode( ',', apply_filters( 'wpseo_html_sitemap_page_exclude', $exclude ) );

		$page_list = wp_list_pages(
			array(
				'exclude'  => $exclude,
				'title_li' => '',
				'echo'     => false,
			)
		);

		$output .= $page_list;
		$output .= '</ul>';
	}

	// create post list
	if ( $display_posts ) {
		$output .= '<h2 id="posts">' . __( 'Posts', 'wordpress-seo' ) . '</h2><ul>';
		// Add categories you'd like to exclude in the exclude here
		// possibly have this controlled by shortcode params
		$cats = get_categories( 'exclude=' );
		foreach ( $cats as $cat ) {
			$output .= '<li><h3>' . $cat->cat_name . '</h3>';
			$output .= '<ul>';

			$args = array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'cat'            => $cat->cat_ID,

				'meta_query'     => array(
					'relation' => 'OR',
					// include if this key doesn't exists
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
						'value'   => '', // This is ignored, but is necessary...
						'compare' => 'NOT EXISTS',
					),
					// OR if key does exists include if it is not 1
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
						'value'   => '1',
						'compare' => '!=',
					),
					// OR this key overrides it
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'sitemap-html-include',
						'value'   => 'always',
						'compare' => '=',
					),
				),
			);

			$posts = get_posts( $args );

			foreach ( $posts as $post ) {
				$category = get_the_category( $post->ID );

				// Only display a post link once, even if it's in multiple categories
				if ( $category[0]->cat_ID == $cat->cat_ID ) {
					$output .= '<li><a href="' . esc_url( get_permalink( $post->ID ) ) . '">' . get_the_title( $post->ID ) . '</a></li>';
				}
			}

			$output .= '</ul>';
			$output .= '</li>';
		}
	}
	$output .= '</ul>';

	// get all public non-builtin post types
	$args       = array(
		'public'   => true,
		'_builtin' => false,
	);
	$post_types = get_post_types( $args, 'object' );

	// create an noindex array of post types and taxonomies
	$noindex = array();
	foreach ( $options as $key => $value ) {
		if ( strpos( $key, 'noindex-' ) === 0 && $value === true )
			$noindex[] = $key;
	}

	// create custom post type list
	foreach ( $post_types as $post_type ) {
		if ( is_object( $post_type ) && ! in_array( 'noindex-' . $post_type->name, $noindex ) ) {
			$output .= '<h2 id="' . $post_type->name . '">' . __( $post_type->label, 'wordpress-seo' ) . '</h2><ul>';
			$output .= create_type_sitemap_template( $post_type );
			$output .= '</ul>';
		}
	}

	// $output = '';
	// create archives list
	if ( $display_archives ) {
		$output .= '<h2 id="archives">' . __( 'Archives', 'wordpress-seo' ) . '</h2><ul>';

		foreach ( $post_types as $post_type ) {
			if ( is_object( $post_type ) && $post_type->has_archive && ! in_array( 'noindex-ptarchive-' . $post_type->name, $noindex ) ) {
				$output .= '<a href="' . esc_url( get_post_type_archive_link( $post_type->name ) ) . '">' . $post_type->labels->name . '</a>';

				$output .= create_type_sitemap_template( $post_type );
			}
		}
		$output .= '</ul>';
	}

	set_transient( 'html-sitemap', $output, 60 );
	return $output;
}

add_shortcode( 'wpseo_sitemap', 'wpseo_sitemap_handler' );


/**
 * @param $post_type
 *
 * @return string
 */
function create_type_sitemap_template( $post_type ) {
	// $output = '<h2 id="' . $post_type->name . '">' . __( $post_type->label, 'wordpress-seo' ) . '</h2><ul>';

	$output = '';
	// Get all registered taxonomy of this post type
	$taxs = get_object_taxonomies( $post_type->name, 'object' );

	// Build the taxonomy tree
	$walker = new Sitemap_Walker;
	foreach ( $taxs as $key => $tax ) {
		if ( $tax->public !== 1 )
			continue;

		$args  = array(
			'post_type' => $post_type->name,
			'tax_query' => array(
				array(
					'taxonomy' => $key,
					'field'    => 'id',
					'terms'    => -1,
					'operator' => 'NOT',
				),
			),
		);
		$query = new WP_Query( $args );

		$title_li = $query->have_posts() ? $tax->labels->name : '';

		$output .= wp_list_categories(
			array(
				'title_li'         => $title_li,
				'echo'             => false,
				'taxonomy'         => $key,
				'show_option_none' => '',
				// 'hierarchical' => 0, // uncomment this for a flat list

				'walker'           => $walker,
				'post_type'        => $post_type->name, // arg used by the Walker class
			)
		);
	}

	$output .= '<br />';
	return $output;
}





/********************** DEPRECATED FUNCTIONS **********************/


/**
 * Get the value from the post custom values
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::get_value()
 * @see WPSEO_Meta::get_value()
 *
 * @param string $val    name of the value to get
 * @param int    $postid post ID of the post to get the value for
 * @return bool|mixed
 */
function wpseo_get_value( $val, $postid = 0 ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::get_value()' );
	return WPSEO_Meta::get_value( $val, $postid );
}


/**
 * Save a custom meta value
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::set_value() or just use update_post_meta()
 * @see WPSEO_Meta::set_value()
 *
 * @param	string	$meta_key		the meta to change
 * @param	mixed	$meta_value		the value to set the meta to
 * @param	int		$post_id		the ID of the post to change the meta for.
 * @return	bool	whether the value was changed
 */
function wpseo_set_value( $meta_key, $meta_value, $post_id ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::set_value()' );
	return WPSEO_Meta::set_value( $meta_key, $meta_value, $post_id );
}


/**
 * Retrieve an array of all the options the plugin uses. It can't use only one due to limitations of the options API.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Options::get_option_names()
 * @see WPSEO_Options::get_option_names()
 *
 * @return array of options.
 */
function get_wpseo_options_arr() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::get_option_names()' );
	return WPSEO_Options::get_option_names();
}


/**
 * Retrieve all the options for the SEO plugin in one go.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Options::get_all()
 * @see WPSEO_Options::get_all()
 *
 * @return array of options
 */
function get_wpseo_options() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::get_all()' );
	return WPSEO_Options::get_all();
}

/**
 * Used for imports, both in dashboard and import settings pages, this functions either copies
 * $old_metakey into $new_metakey or just plain replaces $old_metakey with $new_metakey
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::replace_meta()
 * @see WPSEO_Meta::replace_meta()
 *
 * @param string  $old_metakey The old name of the meta value.
 * @param string  $new_metakey The new name of the meta value, usually the WP SEO name.
 * @param bool    $replace     Whether to replace or to copy the values.
 */
function replace_meta( $old_metakey, $new_metakey, $replace = false ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::replace_meta()' );
	WPSEO_Meta::replace_meta( $old_metakey, $new_metakey, $replace );
}


/**
 * Retrieve a taxonomy term's meta value.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Taxonomy_Meta::get_term_meta()
 * @see WPSEO_Taxonomy_Meta::get_term_meta()
 *
 * @param string|object $term     term to get the meta value for
 * @param string        $taxonomy name of the taxonomy to which the term is attached
 * @param string        $meta     meta value to get
 * @return bool|mixed value when the meta exists, false when it does not
 */
function wpseo_get_term_meta( $term, $taxonomy, $meta ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Taxonomy_Meta::get_term_meta' );
	WPSEO_Taxonomy_Meta::get_term_meta( $term, $taxonomy, $meta );
}