<?php
/**
 * @package Internals
 */

require_once( WPSEO_PATH . 'inc/class-sitemap-walker.php' );

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Flush the rewrite rules.
 */
function wpseo_flush_rules() {
	global $wp_rewrite;
	$wp_rewrite->flush_rules();
}

/**
 * Runs on activation of the plugin.
 */
function wpseo_activate() {
	wpseo_defaults();

	wpseo_flush_rules();
	
	if ( ! method_exists( 'WPSEO_Options', 'schedule_yoast_tracking' ) )
		require_once( WPSEO_PATH . 'inc/class-wpseo-options.php' );
		
	WPSEO_Options::schedule_yoast_tracking( null, get_option( 'wpseo' ) );

//	wpseo_title_test(); // is already run in wpseo_defaults
//  wpseo_description_test(); // is already run in wpseo_defaults

	// Clear cache so the changes are obvious.
	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	}
	else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}

	do_action( 'wpseo_activate' );
}

/**
 * Set the default settings.
 *
 * This uses the currently available custom post types and taxonomies.
 *
 * @todo - check whether this is run from activation, if so, run maybe_upgrade() ?!
 */
function wpseo_defaults() {
	$options = get_option( 'wpseo' );
	if ( ! is_array( $options ) ) {
		$opt = array(
//			'disableadvanced_meta' => 'on',
			'version'              => WPSEO_VERSION,
		);
		update_option( 'wpseo', $opt );

		// Test theme on activate
		wpseo_description_test();
	}
	else {
		// Re-check theme on re-activate
		wpseo_description_test();
		return;
	}

	if ( ! is_array( get_option( 'wpseo_titles' ) ) ) {
/*		$opt = array(
/*			'title-home-wpseo'          => '%%sitename%% %%page%% %%sep%% %%sitedesc%%',
			'title-author-wpseo'        => sprintf( __( '%s, Author at %s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ',
			'title-archive-wpseo'       => '%%date%% %%page%% %%sep%% %%sitename%%',
			'title-search-wpseo'        => sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%',
			'title-404-wpseo'           => __( 'Page Not Found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%',

//			'noindex-archive-wpseo'     => 'on',
//			'noindex-tax-post_format' => 'on',
		);*/
/*		foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $pt ) {
			$opt['title-' . $pt->name] = '%%title%% %%page%% %%sep%% %%sitename%%';
			if ( $pt->has_archive )
				$opt['title-ptarchive-' . $pt->name] = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		foreach ( get_taxonomies( array( 'public' => true ) ) as $tax ) {
			$opt['title-tax-' . $tax] = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		update_option( 'wpseo_titles', $opt );
*/
		wpseo_title_test();
	}

/*	if ( ! is_array( get_option( 'wpseo_xml' ) ) ) {
		$opt = array(
			'enablexmlsitemap'                     => 'on',
			'post_types-attachment-not_in_sitemap' => true
		);
		update_option( 'wpseo_xml', $opt );
	}
*/
/*	if ( ! is_array( get_option( 'wpseo_social' ) ) ) {
		$opt = array(
			'opengraph' => 'on',
		);
		update_option( 'wpseo_social', $opt );
	}
*/
/*	if ( ! is_array( get_option( 'wpseo_rss' ) ) ) {
		$opt = array(
			'rssafter' => sprintf( __( 'The post %s appeared first on %s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' ),
		);
		update_option( 'wpseo_rss', $opt );
	}
*/
/*	if ( ! is_array( get_option( 'wpseo_permalinks' ) ) ) {
		$opt = array(
			'cleanslugs' => 'on',
		);
		update_option( 'wpseo_permalinks', $opt );
	}
*/
	// Force WooThemes to use WordPress SEO data.
	if ( function_exists( 'woo_version_init' ) ) {
		update_option( 'seo_woo_use_third_party_data', 'true' );
	}

}

/**
 * Test whether force rewrite should be enabled or not.
 */
function wpseo_title_test() {
	$options = get_option( 'wpseo_titles' );

	$options['forcerewritetitle'] = false;
	$options['title_test'] = 1;
	update_option( 'wpseo_titles', $options );

	// Setting title_test to true forces the plugin to output the title below through a filter in class-frontend.php
	$expected_title = 'This is a Yoast Test Title';

	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	}
	else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}

	global $wp_version;
	$args = array(
		'user-agent' => "WordPress/${wp_version}; " . get_site_url() . " - Yoast",
	);
	$resp = wp_remote_get( get_bloginfo( 'url' ), $args );

	// echo '<pre>'.$resp['body'].'</pre>';

	if ( ( $resp && ! is_wp_error( $resp ) ) && ( 200 == $resp['response']['code'] && isset( $resp['body'] ) ) ) {
		$res = preg_match( '`<title>([^<]+)</title>`im', $resp['body'], $matches );

		if ( $res && strcmp( $matches[1], $expected_title ) !== 0 ) {
			$options['forcerewritetitle'] = true;
			update_option( 'wpseo_titles', $options );

			$resp = wp_remote_get( get_bloginfo( 'url' ), $args );

			$res = preg_match( '`/<title>([^>]+)</title>`im', $resp['body'], $matches );
		}

		if ( ! $res || $matches[1] != $expected_title )
			$options['forcerewritetitle'] = false;
	}
	else {
		// If that dies, let's make sure the titles are correct and force the output.
		$options['forcerewritetitle'] = true;
	}

	$options['title_test'] = false;
	update_option( 'wpseo_titles', $options );
}

add_filter( 'switch_theme', 'wpseo_title_test', 0 );


/**
 * Test whether the active theme contains a <meta> description tag.
 *
 * @since 1.4.14 Moved from dashboard.php and adjusted - see changelog
 *
 * @return void
 */
function wpseo_description_test() {
	$options = get_option( 'wpseo' );

	// Reset any related options
	$options['theme_has_description']   = WPSEO_Options::$defaults['wpseo']['theme_has_description'];
	$options['theme_description_found'] = WPSEO_Options::$defaults['wpseo']['theme_description_found'];
// @todo - check if this one still exists and is used ?
/*	if ( isset( $options['meta_description_warning'] ) )
		unset( $options['meta_description_warning'] );*/

	/* Should this be reset too ? Best to do so as test is done on re-activate and switch_theme
	   as well and new warning would be warranted then. Only might give irritation on theme upgrade. */
	$options['ignore_meta_description_warning'] = WPSEO_Options::$defaults['wpseo']['ignore_meta_description_warning'];

	$file = false;
	if ( file_exists( get_stylesheet_directory() . '/header.php' ) ) {
		// theme or child theme
		$file = get_stylesheet_directory() . '/header.php';
	}
	else if ( file_exists( get_template_directory() . '/header.php' ) ) {
		// parent theme in case of a child theme
		$file = get_template_directory() . '/header.php';
	}

	if ( is_string( $file ) && $file !== '' ) {
		$header_file = file_get_contents( $file );
		$issue       = preg_match_all( '#<\s*meta\s*(name|content)\s*=\s*("|\')(.*)("|\')\s*(name|content)\s*=\s*("|\')(.*)("|\')(\s+)?/?>#i', $header_file, $matches, PREG_SET_ORDER );
		if ( $issue === false ) {
			$options['theme_has_description'] = false;
		}
		else {
			foreach ( $matches as $meta ) {
				if ( ( strtolower( $meta[1] ) == 'name' && strtolower( $meta[3] ) == 'description' ) || ( strtolower( $meta[5] ) == 'name' && strtolower( $meta[7] ) == 'description' ) ) {
					$options['theme_description_found']  = $meta[0];
					$options['ignore_meta_description_warning'] = false;
					break; // no need to run through the rest of the meta's
				}
			}
			if ( $options['theme_description_found'] !== '' ) {
				$options['theme_has_description'] = true;
			}
			else {
				$options['theme_has_description'] = false;
			}
		}
	}
	update_option( 'wpseo', $options );
}

add_filter( 'after_switch_theme', 'wpseo_description_test', 0 );

if ( version_compare( $GLOBALS['wp_version'], '3.6.99', '>' ) ) {
	// Use the new and *sigh* adjusted action hook WP 3.7+
	add_action( 'upgrader_process_complete', 'wpseo_upgrader_process_complete', 10, 2 );
}
else if ( version_compare( $GLOBALS['wp_version'], '3.5.99', '>' ) ) {
	// Use the new action hook WP 3.6+
	add_action( 'upgrader_process_complete', 'wpseo_upgrader_process_complete', 10, 3 );
}
else {
	// Abuse filters to do our action
	add_filter( 'update_theme_complete_actions', 'wpseo_update_theme_complete_actions', 10, 2 );
	add_filter( 'update_bulk_theme_complete_actions', 'wpseo_update_theme_complete_actions', 10, 2 );
}


/**
 * Check if the current theme was updated and if so, test the updated theme
 * for the meta description tag
 *
 * @since 1.4.14
 *
 * @return  void
 */
function wpseo_upgrader_process_complete( $upgrader_object, $context_array, $themes = null ) {
	$options = get_option( 'wpseo' );

	// Break if admin_notice already in place
	if ( ( ( isset( $options['theme_has_description'] ) && $options['theme_has_description'] === true ) || $options['theme_description_found'] !== '' ) && $options['ignore_meta_description_warning'] !== true ) {
		return;
	}
	// Break if this is not a theme update, not interested in installs as after_switch_theme would still be called
	if ( ! isset( $context_array['type'] ) || $context_array['type'] !== 'theme' || !isset( $context_array['action'] ) || $context_array['action'] !== 'update' ) {
		return;
	}

	$theme = get_stylesheet();
	if ( ! isset( $themes ) ) {
		// WP 3.7+
		$themes = array();
		if ( isset( $context_array['themes'] ) && $context_array['themes'] !== array() ) {
			$themes = $context_array['themes'];
		}
		else if ( isset( $context_array['theme'] ) && $context_array['theme'] !== '' ){
			$themes = $context_array['theme'];
		}
	}

	if ( ( isset( $context_array['bulk'] ) && $context_array['bulk'] === true ) && ( is_array( $themes ) && count( $themes ) > 0 ) ) {

		if ( in_array( $theme, $themes ) ) {
			wpseo_description_test();
		}
	}
	else if ( is_string( $themes ) && $themes === $theme ) {
		wpseo_description_test();
	}
	return;
}

/**
 * Abuse a filter to check if the current theme was updated and if so, test the updated theme
 * for the meta description tag
 *
 * @since 1.4.14
 *
 * @return  array  $update_actions    Unchanged array
 */
function wpseo_update_theme_complete_actions( $update_actions, $updated_theme ) {
	$options = get_option( 'wpseo' );

	// Break if admin_notice already in place
	if ( ( ( isset( $options['theme_has_description'] ) && $options['theme_has_description'] === true ) || $options['theme_description_found'] !== '' ) && $options['ignore_meta_description_warning'] !== true ) {
		return $update_actions;
	}

	$theme = get_stylesheet();
	if ( is_object( $updated_theme ) ) {
		/* Bulk update and $updated_theme only contains info on which theme was last in the list
		   of updated themes, so go & test */
		wpseo_description_test();
	}
	else if ( $updated_theme === $theme ) {
		/* Single theme update for the active theme */
		wpseo_description_test();
	}
	return $update_actions;
}

/**
 * On deactivation, flush the rewrite rules so XML sitemaps stop working.
 */
function wpseo_deactivate() {
	wpseo_flush_rules();
	
	if ( ! method_exists( 'WPSEO_Options', 'schedule_yoast_tracking' ) )
		require_once( WPSEO_PATH . 'inc/class-wpseo-options.php' );

	WPSEO_Options::schedule_yoast_tracking( null, get_option( 'wpseo' ) );

	// Clear cache so the changes are obvious.
	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	}
	else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}
	
	do_action( 'wpseo_deactivate' );
}

/**
 * Translates a decimal analysis score into a textual one.
 *
 * @param int  $val The decimal score to translate.
 * @param bool $css Whether to return the i18n translated score or the CSS class value.
 *
 * @return string
 */
function wpseo_translate_score( $val, $css = true ) {
	switch ( $val ) {
		case 0:
			$score = __( 'N/A', 'wordpress-seo' );
			$css   = 'na';
			break;
		case 4:
		case 5:
			$score = __( 'Poor', 'wordpress-seo' );
			$css   = 'poor';
			break;
		case 6:
		case 7:
			$score = __( 'OK', 'wordpress-seo' );
			$css   = 'ok';
			break;
		case 8:
		case 9:
		case 10:
			$score = __( 'Good', 'wordpress-seo' );
			$css   = 'good';
			break;
		default:
			$score = __( 'Bad', 'wordpress-seo' );
			$css   = 'bad';
	}

	if ( $css )
		return $css;
	else
		return $score;
}


/**
 * Adds an SEO admin bar menu with several options. If the current user is an admin he can also go straight to several settings menu's from here.
 */
function wpseo_admin_bar_menu() {
	// If the current user can't write posts, this is all of no use, so let's not output an admin menu
	if ( ! current_user_can( 'edit_posts' ) )
		return;

	global $wp_admin_bar, $wpseo_front, $post;

	if ( is_object( $wpseo_front ) ) {
		$url = $wpseo_front->canonical( false );
	}
	else {
		$url = '';
	}

	$focuskw = '';
	$score   = '';
	$seo_url = get_admin_url( null, 'admin.php?page=wpseo_dashboard' );

	if ( is_singular() && isset( $post ) && is_object( $post ) && apply_filters( 'wpseo_use_page_analysis', true ) === true ) {
		$focuskw    = wpseo_get_value( 'focuskw', $post->ID );
		$perc_score = wpseo_get_value( 'linkdex', $post->ID );
		$txtscore   = wpseo_translate_score( round( $perc_score / 10 ) );
		$title      = wpseo_translate_score( round( $perc_score / 10 ), $css = false );
		$score      = '<div title="' . esc_attr( $title ) . '" class="wpseo_score_img ' . $txtscore . ' ' . $perc_score . '"></div>';

		$seo_url = get_edit_post_link( $post->ID );
		if ( $txtscore != 'na' )
			$seo_url .= '#wpseo_linkdex';
	}

	$wp_admin_bar->add_menu( array( 'id' => 'wpseo-menu', 'title' => __( 'SEO', 'wordpress-seo' ) . $score, 'href' => $seo_url, ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-kwresearch', 'title' => __( 'Keyword Research', 'wordpress-seo' ), '#', ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-adwordsexternal', 'title' => __( 'AdWords External', 'wordpress-seo' ), 'href' => 'https://adwords.google.com/select/KeywordToolExternal', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-googleinsights', 'title' => __( 'Google Insights', 'wordpress-seo' ), 'href' => 'http://www.google.com/insights/search/#q=' . urlencode( $focuskw ) . '&cmpt=q', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-wordtracker', 'title' => __( 'SEO Book', 'wordpress-seo' ), 'href' => 'http://tools.seobook.com/keyword-tools/seobook/?keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );

	if ( ! is_admin() ) {
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-analysis', 'title' => __( 'Analyze this page', 'wordpress-seo' ), '#', ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-inlinks-ose', 'title' => __( 'Check Inlinks (OSE)', 'wordpress-seo' ), 'href' => 'http://www.opensiteexplorer.org/' . str_replace( '/', '%252F', preg_replace( '`^http[s]?://`', '', $url ) ) . '/a!links', 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-kwdensity', 'title' => __( 'Check Keyword Density', 'wordpress-seo' ), 'href' => 'http://tools.davidnaylor.co.uk/keyworddensity/index.php?url=' . $url . '&keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-cache', 'title' => __( 'Check Google Cache', 'wordpress-seo' ), 'href' => 'http://webcache.googleusercontent.com/search?strip=1&q=cache:' . $url, 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-header', 'title' => __( 'Check Headers', 'wordpress-seo' ), 'href' => 'http://quixapp.com/headers/?r=' . urlencode( $url ), 'meta' => array( 'target' => '_blank' ) ) );
	}

	$admin_menu = false;
	if ( function_exists( 'is_multisite' ) && is_multisite() ) {
		$options = get_site_option( 'wpseo_ms' );
		if ( $options['access'] === 'superadmin' ) {
			if ( is_super_admin() )
				$admin_menu = true;
			else
				$admin_menu = false;
		}
		else {
			if ( current_user_can( 'manage_options' ) )
				$admin_menu = true;
			else
				$admin_menu = false;
		}
	}
	else {
		if ( current_user_can( 'manage_options' ) )
			$admin_menu = true;
	}

	if ( $admin_menu ) {
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-settings', 'title' => __( 'SEO Settings', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_titles' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-titles', 'title' => __( "Titles & Metas", 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_titles' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-social', 'title' => __( 'Social', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_social' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-xml', 'title' => __( 'XML Sitemaps', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_xml' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-permalinks', 'title' => __( 'Permalinks', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_permalinks' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-internal-links', 'title' => __( 'Internal Links', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_internal-links' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-rss', 'title' => __( 'RSS', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_rss' ), ) );
	}
}

add_action( 'admin_bar_menu', 'wpseo_admin_bar_menu', 95 );

/**
 * Enqueue a tiny bit of CSS to show so the adminbar shows right.
 */
function wpseo_admin_bar_css() {
	if ( is_admin_bar_showing() && is_singular() )
		wp_enqueue_style( 'boxes', plugins_url( 'css/adminbar.css', dirname( __FILE__ ) ), array(), WPSEO_VERSION );
}

add_action( 'wp_enqueue_scripts', 'wpseo_admin_bar_css' );

/**
 * Allows editing of the meta fields through weblog editors like Marsedit.
 *
 * @param array $allcaps Capabilities that must all be true to allow action.
 * @param array $cap     Array of capabilities to be checked, unused here.
 * @param array $args    List of arguments for the specific cap to be checked.
 *
 * @return array $allcaps
 */
function allow_custom_field_edits( $allcaps, $cap, $args ) {
	// $args[0] holds the capability
	// $args[2] holds the post ID
	// $args[3] holds the custom field

	// Make sure the request is to edit or add a post meta (this is usually also the second value in $cap,
	// but this is safer to check).
	if ( in_array( $args[0], array( "edit_post_meta", "add_post_meta" ) ) ) {
		// Only allow editing rights for users who have the rights to edit this post and make sure
		// the meta value starts with _yoast_wpseo.
		if ( current_user_can( 'edit_post', $args[2] ) && ( ! empty( $args[3] ) && strpos( $args[3], "_yoast_wpseo_" ) === 0 ) )
			$allcaps[$args[0]] = true;
	}

	return $allcaps;
}

add_filter( 'user_has_cap', 'allow_custom_field_edits', 0, 3 );

function create_type_sitemap_template( $post_type ) {
	// $output = '<h2 id="' . $post_type->name . '">' . __( $post_type->label, 'wordpress-seo' ) . '</h2><ul>';

	$output = '';
	// Get all registered taxonomy of this post type
	$taxs = get_object_taxonomies( $post_type->name, 'object' );

	// Build the taxonomy tree
	$walker = new Sitemap_Walker();
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
				)
			)
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
				'post_type'        => $post_type->name // arg used by the Walker class
			)
		);
	}

	$output .= '<br />';
	return $output;
}
