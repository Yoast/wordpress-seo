<?php
/**
 * @package Internals
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Get the value from the post custom values
 *
 * @param string $val    name of the value to get
 * @param int    $postid post ID of the post to get the value for
 * @return bool|mixed
 */
function wpseo_get_value( $val, $postid = 0 ) {
	$postid = absint( $postid );
	if ( $postid === 0 ) {
		global $post;
		if ( isset( $post ) && isset( $post->post_status ) && $post->post_status != 'auto-draft')
			$postid = $post->ID;
		else
			return false;
	}
	$custom = get_post_custom( $postid );
	if ( !empty( $custom['_yoast_wpseo_' . $val][0] ) )
		return maybe_unserialize( $custom['_yoast_wpseo_' . $val][0] );
	else
		return false;
}

/**
 * @param string $meta   the meta to change
 * @param mixed  $val    the value to set the meta to
 * @param int    $postid the ID of the post to change the meta for.
 */
function wpseo_set_value( $meta, $val, $postid ) {
	update_post_meta( $postid, '_yoast_wpseo_' . $meta, $val );
}

/**
 * Retrieve an array of all the options the plugin uses. It can't use only one due to limitations of the options API.
 *
 * @return array of options.
 */
function get_wpseo_options_arr() {
	$optarr = array( 'wpseo', 'wpseo_permalinks', 'wpseo_titles', 'wpseo_rss', 'wpseo_internallinks', 'wpseo_xml', 'wpseo_social' );
	return apply_filters( 'wpseo_options', $optarr );
}

/**
 * Retrieve all the options for the SEO plugin in one go.
 *
 * @return array of options
 */
function get_wpseo_options() {
	static $options;

	if ( !isset( $options ) ) {
		$options = array();
		foreach ( get_wpseo_options_arr() as $opt ) {
			$options = array_merge( $options, (array) get_option( $opt ) );
		}
	}

	return $options;
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
		return trim( preg_replace( '/\s+/u', ' ', $string ) );

	global $sep;
	if ( !isset( $sep ) || empty( $sep ) )
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
		return trim( preg_replace( '/\s+/u', ' ', $string ) );

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
	if ( !is_single() ) {
		$pagenum = get_query_var( 'paged' );
		if ( $pagenum === 0 )
			$pagenum = 1;

		if ( isset( $wp_query->max_num_pages ) && $wp_query->max_num_pages != '' && $wp_query->max_num_pages != 0 )
			$max_num_pages = $wp_query->max_num_pages;
	} else {
		global $post;
		$pagenum       = get_query_var( 'page' );
		$max_num_pages = ( isset( $post->post_content ) ) ? substr_count( $post->post_content, '<!--nextpage-->' ) : 1;
		if ( $max_num_pages >= 1 )
			$max_num_pages++;
	}

	// Let's do date first as it's a bit more work to get right.
	if ( $r->post_date != '' ) {
		$date = mysql2date( get_option( 'date_format' ), $r->post_date );
	} else {
		if ( get_query_var( 'day' ) && get_query_var( 'day' ) != '' ) {
			$date = get_the_date();
		} else {
			if ( single_month_title( ' ', false ) && single_month_title( ' ', false ) != '' ) {
				$date = single_month_title( ' ', false );
			} else if ( get_query_var( 'year' ) != '' ) {
				$date = get_query_var( 'year' );
			} else {
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
		'%%term404%%'	   => sanitize_text_field ( str_replace( '-', ' ', $r->term404 ) ),
	);

	if ( isset( $r->ID ) ) {
		$replacements = array_merge( $replacements, array(
			'%%caption%%'      => $r->post_excerpt,
			'%%category%%'     => wpseo_get_terms( $r->ID, 'category' ),
			'%%excerpt%%'      => ( !empty( $r->post_excerpt ) ) ? strip_tags( $r->post_excerpt ) : wp_html_excerpt( strip_shortcodes( $r->post_content ),155 ),
			'%%excerpt_only%%' => strip_tags( $r->post_excerpt ),
			'%%focuskw%%'      => wpseo_get_value( 'focuskw', $r->ID ),
			'%%id%%'           => $r->ID,
			'%%modified%%'     => mysql2date( get_option( 'date_format' ), $r->post_modified ),
			'%%name%%'         => get_the_author_meta( 'display_name', !empty( $r->post_author ) ? $r->post_author : get_query_var( 'author' ) ),
			'%%tag%%'          => wpseo_get_terms( $r->ID, 'post_tag' ),
			'%%title%%'        => stripslashes( $r->post_title ),
			'%%userid%%'       => !empty( $r->post_author ) ? $r->post_author : get_query_var( 'author' ),
		) );
	}

	if ( !empty( $r->taxonomy ) ) {
		$replacements = array_merge( $replacements, array(
			'%%category_description%%' => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
			'%%tag_description%%'      => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
			'%%term_description%%'     => trim( strip_tags( get_term_field( 'description', $r->term_id, $r->taxonomy ) ) ),
			'%%term_title%%'           => $r->name,
		) );
	}

	foreach ( $replacements as $var => $repl ) {
		if ( !in_array( $var, $omit ) )
			$string = str_replace( $var, $repl, $string );
	}

	if ( strpos( $string, '%%' ) === false ) {
		$string = preg_replace( '/\s+/u', ' ', $string );
		return trim( $string );
	}

	if ( isset( $wp_query->query_vars['post_type'] ) && preg_match_all( '/%%pt_([^%]+)%%/u', $string, $matches, PREG_SET_ORDER ) ) {
		$pt        = get_post_type_object( $wp_query->query_vars['post_type'] );
		$pt_plural = $pt_singular = $pt->name;
		if ( isset( $pt->labels->singular_name ) )
			$pt_singular = $pt->labels->singular_name;
		if ( isset( $pt->labels->name ) )
			$pt_plural = $pt->labels->name;
		$string = str_replace( '%%pt_single%%', $pt_singular, $string );
		$string = str_replace( '%%pt_plural%%', $pt_plural, $string );
	}

	if ( preg_match_all( '/%%cf_([^%]+)%%/u', $string, $matches, PREG_SET_ORDER ) ) {
		global $post;
		foreach ( $matches as $match ) {
			$string = str_replace( $match[0], get_post_meta( $post->ID, $match[1], true ), $string );
		}
	}

	if ( preg_match_all( '/%%ct_desc_([^%]+)?%%/u', $string, $matches, PREG_SET_ORDER ) ) {
		global $post;
		foreach ( $matches as $match ) {
			$terms  = get_the_terms( $post->ID, $match[1] );
			if( is_array( $terms ) && count( $terms ) > 0 ) {
				$string = str_replace( $match[0], get_term_field( 'description', $terms[0]->term_id, $match[1] ), $string );
			}
			else {
				// Make sure that the variable is removed
				$string = str_replace( $match[0], '', $string );

				/* Check for WP_Error object (=invalid taxonomy entered) and if it's an error,
				 notify in admin dashboard */
				if( is_wp_error( $terms ) && is_admin() ) {
					add_action( 'wpseo_all_admin_notices', 'wpseo_invalid_custom_taxonomy' );
				}
			}
		}
	}

	if ( preg_match_all( '/%%ct_([^%]+)%%(single%%)?/u', $string, $matches, PREG_SET_ORDER ) ) {
		foreach ( $matches as $match ) {
			$single = false;
			if ( isset( $match[2] ) && $match[2] == 'single%%' )
				$single = true;
			$ct_terms = wpseo_get_terms( $r->ID, $match[1], $single );

			$string = str_replace( $match[0], $ct_terms, $string );
		}
	}

	$string = preg_replace( '/\s+/u', ' ', $string );
	return trim( $string );
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
	// If we're on a specific tag, category or taxonomy page, return that and bail.
	if ( is_category() || is_tag() || is_tax() ) {
		global $wp_query;
		$term = $wp_query->get_queried_object();
		return $term->name;
	}

	if ( empty( $id ) || empty( $taxonomy ) )
		return '';

	$output = '';
	$terms  = get_the_terms( $id, $taxonomy );
	if ( $terms ) {
		foreach ( $terms as $term ) {
			if ( $return_single )
				return $term->name;
			$output .= $term->name . ', ';
		}
		return rtrim( trim( $output ), ',' );
	}
	return '';
}

/**
 * Retrieve a taxonomy term's meta value.
 *
 * @param string|object $term     term to get the meta value for
 * @param string        $taxonomy name of the taxonomy to which the term is attached
 * @param string        $meta     meta value to get
 * @return bool|mixed value when the meta exists, false when it does not
 */
function wpseo_get_term_meta( $term, $taxonomy, $meta ) {
	if ( is_string( $term ) )
		$term = get_term_by( 'slug', $term, $taxonomy );

	if ( is_object( $term ) )
		$term = $term->term_id;
	else
		return false;

	$tax_meta = get_option( 'wpseo_taxonomy_meta' );
	if ( isset( $tax_meta[$taxonomy][$term] ) )
		$tax_meta = $tax_meta[$taxonomy][$term];
	else
		return false;

	return ( isset( $tax_meta['wpseo_' . $meta] ) ) ? $tax_meta['wpseo_' . $meta] : false;
}


/**
 * Strip out the shortcodes with a filthy regex, because people don't properly register their shortcodes.
 *
 * @param string $text input string that might contain shortcodes
 * @return string $text string without shortcodes
 */
function wpseo_strip_shortcode( $text ) {
	return preg_replace( '|\[[^\]]+\]|s', '', $text );
}

/**
 * Redirect /sitemap.xml to /sitemap_index.xml
 */
function wpseo_xml_redirect_sitemap() {
	global $wp_query;
	
	$current_url =( isset($_SERVER["HTTPS"] ) && $_SERVER["HTTPS"]=='on' ) ? 'https://' : 'http://';
	$current_url .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];

	// must be 'sitemap.xml' and must be 404
	if ( home_url( '/sitemap.xml' ) == $current_url && $wp_query->is_404) {
		wp_redirect( home_url( '/sitemap_index.xml' ) );
	}
}

/**
 * Initialize sitemaps. Add sitemap rewrite rules and query var
 */
function wpseo_xml_sitemaps_init() {
	$options = get_option( 'wpseo_xml' );
	if ( !isset( $options['enablexmlsitemap'] ) || !$options['enablexmlsitemap'] )
		return;

	// redirects sitemap.xml to sitemap_index.xml
	add_action( 'template_redirect', 'wpseo_xml_redirect_sitemap', 0 );

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
	$options    = get_option( 'wpseo_xml' );
	$base       = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '';
	if ( $sitemapurl  == null )
		$sitemapurl = urlencode( home_url( $base . 'sitemap_index.xml' ) );

	// Always ping Google and Bing, optionally ping Ask and Yahoo!
	wp_remote_get( 'http://www.google.com/webmasters/tools/ping?sitemap=' . $sitemapurl );
	wp_remote_get( 'http://www.bing.com/webmaster/ping.aspx?sitemap=' . $sitemapurl );

	if ( isset( $options['xml_ping_yahoo'] ) && $options['xml_ping_yahoo'] )
		wp_remote_get( 'http://search.yahooapis.com/SiteExplorerService/V1/updateNotification?appid=3usdTDLV34HbjQpIBuzMM1UkECFl5KDN7fogidABihmHBfqaebDuZk1vpLDR64I-&url=' . $sitemapurl );

	if ( isset( $options['xml_ping_ask'] ) && $options['xml_ping_ask'] )
		wp_remote_get( 'http://submissions.ask.com/ping?sitemap=' . $sitemapurl );
}
add_action( 'wpseo_ping_search_engines', 'wpseo_ping_search_engines' );

function wpseo_store_tracking_response() {
	if ( ! wp_verify_nonce( $_POST['nonce'], 'wpseo_activate_tracking' ) )
		die();

	$options = get_option( 'wpseo' );
	$options['tracking_popup'] = 'done';

	if ( $_POST['allow_tracking'] == 'yes' )
		$options['yoast_tracking'] = true;

	update_option( 'wpseo', $options );
}
add_action('wp_ajax_wpseo_allow_tracking', 'wpseo_store_tracking_response');