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
		return trim( preg_replace( '`\s+`u', ' ', $string ) );

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
		$string = preg_replace( '`\s+`u', ' ', $string );
		return trim( $string );
	}

	if ( isset( $wp_query->query_vars['post_type'] ) && preg_match_all( '`%%pt_([^%]+)%%`u', $string, $matches, PREG_SET_ORDER ) ) {
		$pt        = get_post_type_object( $wp_query->query_vars['post_type'] );
		$pt_plural = $pt_singular = $pt->name;
		if ( isset( $pt->labels->singular_name ) )
			$pt_singular = $pt->labels->singular_name;
		if ( isset( $pt->labels->name ) )
			$pt_plural = $pt->labels->name;
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
			$terms  = get_the_terms( $post->ID, $match[1] );
			if( is_array( $terms ) && count( $terms ) > 0 ) {
				$term = current( $terms );
				$string = str_replace( $match[0], get_term_field( 'description', $term->term_id, $match[1] ), $string );
			}
			else {
				// Make sure that the variable is removed ?
				$string = str_replace( $match[0], '', $string );

				/* Check for WP_Error object (=invalid taxonomy entered) and if it's an error,
				 notify in admin dashboard */
				if( is_wp_error( $terms ) && is_admin() ) {
					add_action( 'admin_notices', 'wpseo_invalid_custom_taxonomy' );
				}
			}
		}
	}

	if ( preg_match_all( '`%%ct_([^%]+)%%(single%%)?`u', $string, $matches, PREG_SET_ORDER ) ) {
		foreach ( $matches as $match ) {
			$single = false;
			if ( isset( $match[2] ) && $match[2] == 'single%%' )
				$single = true;
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
	echo '<div class="error"><p>' . sprintf( __( 'The taxonomy you used in (one of your) %s variables is <strong>invalid</strong>. Please %sadjust your settings%s.' ), '%%ct_desc_<custom-tax-name>%%', '<a href="' . admin_url( 'admin.php?page=wpseo_titles#top#taxonomies' ) . '">', '</a>' ) . '</p></div>';
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
		$term = $wp_query->get_queried_object();
		$output = $term->name;
	}
	else if ( !empty( $id ) && !empty( $taxonomy ) ) {
		$terms  = get_the_terms( $id, $taxonomy );
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
	return preg_replace( '`\[[^\]]+\]`s', '', $text );
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

	if ( !is_object( $GLOBALS['wp'] ) ) {
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
		$options['yoast_tracking'] = 'on';

	update_option( 'wpseo', $options );
}
add_action('wp_ajax_wpseo_allow_tracking', 'wpseo_store_tracking_response');

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

    $admin_texts = &$config['wpml-config']['admin-texts']['key'];
    foreach( $admin_texts as $k => $val ){
        if ( $val['attr']['name'] == 'wpseo_titles' ) {
            $translate_cp = array_keys( $sitepress->get_translatable_documents() );
            foreach( $translate_cp as $post_type ) {
                $admin_texts[$k]['key'][]['attr']['name'] = 'title-'. $post_type;
                $admin_texts[$k]['key'][]['attr']['name'] = 'metadesc-'. $post_type;
                $admin_texts[$k]['key'][]['attr']['name'] = 'title-ptarchive-'. $post_type;
                $admin_texts[$k]['key'][]['attr']['name'] = 'metadesc-ptarchive-'. $post_type;
                $translate_tax = $sitepress->get_translatable_taxonomies(false, $post_type);
                foreach( $translate_tax as $taxonomy ) {
                    $admin_texts[$k]['key'][]['attr']['name'] = 'title-'. $taxonomy;
                    $admin_texts[$k]['key'][]['attr']['name'] = 'metadesc-'. $taxonomy;
                }
            }
            break;
        }
    }

    return $config;
}
add_filter( 'icl_wpml_config_array', 'wpseo_wpml_config' );


/**
 * (Un-)schedule the yoast tracking cronjob if the tracking option has changed
 * 
 * Needs to be done here, rather than in the Yoast_Tracking class as class-tracking.php may not be loaded
 *
 * @param	mixed	$disregard	Not needed - Option name if option was added, old value if option was updated
 * @param	array	$value		The new value of the option after add/update
 * @return	void
 */
public static function schedule_yoast_tracking( $disregard, $value ) {
	$current_schedule = wp_next_scheduled( 'yoast_tracking' );
	$tracking = ( isset( $value['yoast_tracking'] ) && $value['yoast_tracking'] ) ? true : false;

	if( $tracking === true && $current_schedule === false ) {
		// The tracking checks daily, but only sends new data every 7 days.
		wp_schedule_event( time(), 'daily', 'yoast_tracking' );
	}
	else if( $tracking === false && $current_schedule !== false ){
		wp_clear_scheduled_hook( 'yoast_tracking' );
	}
}
add_action( 'add_option_wpseo', 'schedule_yoast_tracking', 10, 2 );
add_action( 'update_option_wpseo', 'schedule_yoast_tracking', 10, 2 );