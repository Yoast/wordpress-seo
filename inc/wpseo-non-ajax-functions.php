<?php
/**
 * @package Internals
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
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

	wpseo_title_test();

	// Clear cache so the changes are obvious.
	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}

}

/**
 * Set the default settings.
 *
 * This uses the currently available custom post types and taxonomies.
 */
function wpseo_defaults() {
	$options = get_option( 'wpseo' );
	if ( !is_array( $options ) ) {
		$opt = array(
			'disableadvanced_meta' => 'on',
			'version'              => WPSEO_VERSION,
		);
		update_option( 'wpseo', $opt );
	}

	if ( !is_array( get_option( 'wpseo_titles' ) ) ) {
		$opt = array(
			'title-home'          => '%%sitename%% %%page%% %%sep%% %%sitedesc%%',
			'title-author'        => sprintf( __( '%s, Author at %s', 'wordpress-seo' ), '%%name%%', '%%sitename%%' ) . ' %%page%% ',
			'title-archive'       => '%%date%% %%page%% %%sep%% %%sitename%%',
			'title-search'        => sprintf( __( 'You searched for %s', 'wordpress-seo' ), '%%searchphrase%%' ) . ' %%page%% %%sep%% %%sitename%%',
			'title-404'           => __( 'Page Not Found', 'wordpress-seo' ) . ' %%sep%% %%sitename%%',
			'noindex-archive'     => 'on',
			'noindex-post_format' => 'on',
		);
		foreach ( get_post_types( array( 'public' => true ), 'objects' ) as $pt ) {
			$opt[ 'title-' . $pt->name ] = '%%title%% %%page%% %%sep%% %%sitename%%';
			if ( $pt->has_archive )
				$opt[ 'title-ptarchive-' . $pt->name ] = sprintf( __( '%s Archive', 'wordpress-seo' ), '%%pt_plural%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		foreach ( get_taxonomies( array( 'public' => true ) ) as $tax ) {
			$opt[ 'title-' . $tax ] = sprintf( __( '%s Archives', 'wordpress-seo' ), '%%term_title%%' ) . ' %%page%% %%sep%% %%sitename%%';
		}
		update_option( 'wpseo_titles', $opt );
	}

	if ( !is_array( get_option( 'wpseo_xml' ) ) ) {
		$opt = array(
			'enablexmlsitemap' => 'on',
			'post_types-attachment-not_in_sitemap' => true
		);
		update_option( 'wpseo_xml', $opt );
	}

	if ( !is_array( get_option( 'wpseo_social' ) ) ) {
		$opt = array(
			'opengraph' => 'on',
		);
		update_option( 'wpseo_social', $opt );
	}

	if ( !is_array( get_option( 'wpseo_rss' ) ) ) {
		$opt = array(
			'rssafter' => sprintf( __( 'The post %s appeared first on %s.', 'wordpress-seo' ), '%%POSTLINK%%', '%%BLOGLINK%%' ),
		);
		update_option( 'wpseo_rss', $opt );
	}

	// Force WooThemes to use WordPress SEO data.
	if ( function_exists( 'woo_version_init' ) ) {
		update_option( 'seo_woo_use_third_party_data', 'true' );
	}

	wpseo_title_test();
}

/**
 * Test whether force rewrite should be enabled or not.
 */
function wpseo_title_test() {
	$options = get_option( 'wpseo_titles' );

	if ( isset( $options[ 'forcerewritetitle' ] ) )
		unset( $options[ 'forcerewritetitle' ] );

	$options[ 'title_test' ] = true;
	update_option( 'wpseo_titles', $options );

	// Setting title_test to true forces the plugin to output the title below through a filter in class-frontend.php
	$expected_title = 'This is a Yoast Test Title';

	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}

	global $wp_version;
	$args = array(
	 	'user-agent' => "WordPress/${wp_version}; ".get_site_url()." - Yoast",
	);
	$resp = wp_remote_get( get_bloginfo( 'url' ), $args );

	// echo '<pre>'.$resp['body'].'</pre>';

	if ( $resp && !is_wp_error( $resp ) && 200 == $resp[ 'response' ][ 'code' ] ) {
		$res = preg_match( '/<title>([^<]+)<\/title>/im', $resp[ 'body' ], $matches );

		if ( $res && strcmp( $matches[ 1 ], $expected_title ) !== 0 ) {
			$options[ 'forcerewritetitle' ] = 'on';
			update_option( 'wpseo_titles', $options );

			$resp = wp_remote_get( get_bloginfo( 'url' ), $args );

			$res = preg_match( '/<title>([^>]+)<\/title>/im', $resp[ 'body' ], $matches );
		}

		if ( !$res || $matches[ 1 ] != $expected_title )
			unset( $options[ 'forcerewritetitle' ] );
	} else {
		// If that dies, let's make sure the titles are correct and force the output.
		$options[ 'forcerewritetitle' ] = 'on';
	}

	unset( $options[ 'title_test' ] );
	update_option( 'wpseo_titles', $options );
}
add_filter( 'switch_theme', 'wpseo_title_test', 0 );

/**
 * On deactivation, flush the rewrite rules so XML sitemaps stop working.
 */
function wpseo_deactivate() {
	wpseo_flush_rules();

	// Clear cache so the changes are obvious.
	if ( function_exists( 'w3tc_pgcache_flush' ) ) {
		w3tc_pgcache_flush();
	} else if ( function_exists( 'wp_cache_clear_cache' ) ) {
		wp_cache_clear_cache();
	}
}

/**
 * Translates a decimal analysis score into a textual one.
 *
 * @param int $val The decimal score to translate.
 * @return string
 */
function wpseo_translate_score( $val ) {
	switch ( $val ) {
		case 0:
			$score = 'na';
			break;
		case 4:
		case 5:
			$score = 'poor';
			break;
		case 6:
		case 7:
			$score = 'ok';
			break;
		case 8:
		case 9:
		case 10:
			$score = 'good';
			break;
		default:
			$score = 'bad';
			break;
	}
	return $score;
}

/**
 * Adds an SEO admin bar menu with several options. If the current user is an admin he can also go straight to several settings menu's from here.
 */
function wpseo_admin_bar_menu() {
	// If the current user can't write posts, this is all of no use, so let's not output an admin menu
	if ( !current_user_can( 'edit_posts' ) )
		return;

	global $wp_admin_bar, $wpseo_front, $post;

	if ( is_object( $wpseo_front ) ) {
		$url = $wpseo_front->canonical( false );
	} else {
		$url = '';
	}

	$focuskw = '';
	$score   = '';
	$seo_url = get_admin_url( null, 'admin.php?page=wpseo_dashboard' );

	if ( is_singular() && isset( $post ) && is_object( $post ) && apply_filters( 'wpseo_use_page_analysis', true ) === true ) {
		$focuskw    = wpseo_get_value( 'focuskw', $post->ID );
		$perc_score = wpseo_get_value( 'linkdex', $post->ID );
		$txtscore   = wpseo_translate_score( round( $perc_score / 10 ) );
		$score      = '<div alt="' . ucfirst( $txtscore ) . '" title="' . ucfirst( $txtscore ) . '" class="wpseo_score_img ' . $txtscore . ' ' . $perc_score . '"></div>';
		$seo_url    = get_edit_post_link( $post->ID );
		if ( $txtscore != 'na' )
			$seo_url .= '#wpseo_linkdex';
	}

	$wp_admin_bar->add_menu( array( 'id' => 'wpseo-menu', 'title' => __( 'SEO', 'wordpress-seo' ) . $score, 'href' => $seo_url, ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-kwresearch', 'title' => __( 'Keyword Research', 'wordpress-seo' ), '#', ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-adwordsexternal', 'title' => __( 'AdWords External', 'wordpress-seo' ), 'href' => 'https://adwords.google.com/select/KeywordToolExternal', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-googleinsights', 'title' => __( 'Google Insights', 'wordpress-seo' ), 'href' => 'http://www.google.com/insights/search/#q=' . urlencode( $focuskw ) . '&cmpt=q', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-wordtracker', 'title' => __( 'SEO Book', 'wordpress-seo' ), 'href' => 'http://tools.seobook.com/keyword-tools/seobook/?keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );

	if ( !is_admin() ) {
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-analysis', 'title' => __( 'Analyze this page', 'wordpress-seo' ), '#', ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-inlinks-ose', 'title' => __( 'Check Inlinks (OSE)', 'wordpress-seo' ), 'href' => 'http://www.opensiteexplorer.org/' . str_replace( '/', '%252F', preg_replace( '/^https?:\/\//', '', $url ) ) . '/a!links', 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-kwdensity', 'title' => __( 'Check Keyword Density', 'wordpress-seo' ), 'href' => 'http://tools.davidnaylor.co.uk/keyworddensity/index.php?url=' . $url . '&keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-cache', 'title' => __( 'Check Google Cache', 'wordpress-seo' ), 'href' => 'http://webcache.googleusercontent.com/search?strip=1&q=cache:' . $url, 'meta' => array( 'target' => '_blank' ) ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-header', 'title' => __( 'Check Headers', 'wordpress-seo' ), 'href' => 'http://quixapp.com/headers/?r=' . urlencode( $url ), 'meta' => array( 'target' => '_blank' ) ) );
	}

	$admin_menu = false;
	if ( function_exists( 'is_multisite' ) && is_multisite() ) {
		$options = get_site_option( 'wpseo_ms' );
		if ( is_array( $options ) && isset( $options[ 'access' ] ) && $options[ 'access' ] == 'superadmin' ) {
			if ( is_super_admin() )
				$admin_menu = true;
			else
				$admin_menu = false;
		} else {
			if ( current_user_can( 'manage_options' ) )
				$admin_menu = true;
			else
				$admin_menu = false;
		}
	} else {
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
		wp_enqueue_style( 'boxes', WPSEO_URL . 'css/adminbar.css', WPSEO_VERSION );
}

add_action( 'wp_enqueue_scripts', 'wpseo_admin_bar_css' );