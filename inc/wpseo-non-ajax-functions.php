<?php
/**
 * @package Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


/**
 * Test whether force rewrite should be enabled or not.
 */
function wpseo_title_test() {
	$options = get_option( 'wpseo_titles' );

	$options['forcerewritetitle'] = false;
	$options['title_test'] = 1;
	update_option( 'wpseo_titles', $options );

	// Setting title_test to > 0 forces the plugin to output the title below through a filter in class-frontend.php
	$expected_title = 'This is a Yoast Test Title';

	WPSEO_Options::clear_cache();


	global $wp_version;
	$args = array(
		'user-agent' => "WordPress/${wp_version}; " . get_site_url() . ' - Yoast',
	);
	$resp = wp_remote_get( get_bloginfo( 'url' ), $args );

	// echo '<pre>'.$resp['body'].'</pre>';

	if ( ( $resp && ! is_wp_error( $resp ) ) && ( 200 == $resp['response']['code'] && isset( $resp['body'] ) ) ) {
		$res = preg_match( '`<title>([^<]+)</title>`im', $resp['body'], $matches );

		if ( $res && strcmp( $matches[1], $expected_title ) !== 0 ) {
			$options['forcerewritetitle'] = true;

			$resp = wp_remote_get( get_bloginfo( 'url' ), $args );
			$res  = preg_match( '`/<title>([^>]+)</title>`im', $resp['body'], $matches );
		}

		if ( ! $res || $matches[1] != $expected_title ) {
			$options['forcerewritetitle'] = false;
		}
	}
	else {
		// If that dies, let's make sure the titles are correct and force the output.
		$options['forcerewritetitle'] = true;
	}

	$options['title_test'] = 0;
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

	// Reset any related options - dirty way of getting the default to make sure it works on activation
	$options['theme_has_description']   = WPSEO_Option_Wpseo::$desc_defaults['theme_has_description'];
	$options['theme_description_found'] = WPSEO_Option_Wpseo::$desc_defaults['theme_description_found'];
	/* @internal Should this be reset too ? Best to do so as test is done on re-activate and switch_theme
	   as well and new warning would be warranted then. Only might give irritation on theme upgrade. */
	$options['ignore_meta_description_warning'] = WPSEO_Option_Wpseo::$desc_defaults['ignore_meta_description_warning'];

	$file = false;
	if ( file_exists( get_stylesheet_directory() . '/header.php' ) ) {
		// theme or child theme
		$file = get_stylesheet_directory() . '/header.php';
	}
	elseif ( file_exists( get_template_directory() . '/header.php' ) ) {
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
elseif ( version_compare( $GLOBALS['wp_version'], '3.5.99', '>' ) ) {
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
 * for the title and meta description tag
 *
 * @since	1.4.14
 *
 * @param   object  $upgrader_object
 * @param   array   $context_array
 * @param   mixed   $themes
 * @return  void
 */
function wpseo_upgrader_process_complete( $upgrader_object, $context_array, $themes = null ) {
	$options = get_option( 'wpseo' );

	// Break if admin_notice already in place
	if ( ( ( isset( $options['theme_has_description'] ) && $options['theme_has_description'] === true ) || $options['theme_description_found'] !== '' ) && $options['ignore_meta_description_warning'] !== true ) {
		return;
	}
	// Break if this is not a theme update, not interested in installs as after_switch_theme would still be called
	if ( ! isset( $context_array['type'] ) || $context_array['type'] !== 'theme' || ! isset( $context_array['action'] ) || $context_array['action'] !== 'update' ) {
		return;
	}

	$theme = get_stylesheet();
	if ( ! isset( $themes ) ) {
		// WP 3.7+
		$themes = array();
		if ( isset( $context_array['themes'] ) && $context_array['themes'] !== array() ) {
			$themes = $context_array['themes'];
		}
		elseif ( isset( $context_array['theme'] ) && $context_array['theme'] !== '' ){
			$themes = $context_array['theme'];
		}
	}

	if ( ( isset( $context_array['bulk'] ) && $context_array['bulk'] === true ) && ( is_array( $themes ) && count( $themes ) > 0 ) ) {

		if ( in_array( $theme, $themes ) ) {
			wpseo_title_test();
			wpseo_description_test();
		}
	}
	elseif ( is_string( $themes ) && $themes === $theme ) {
		wpseo_title_test();
		wpseo_description_test();
	}
	return;
}

/**
 * Abuse a filter to check if the current theme was updated and if so, test the updated theme
 * for the title and meta description tag
 *
 * @since 1.4.14
 *
 * @param   array   $update_actions
 * @param   mixed   $updated_theme
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
		wpseo_title_test();
		wpseo_description_test();
	}
	elseif ( $updated_theme === $theme ) {
		/* Single theme update for the active theme */
		wpseo_title_test();
		wpseo_description_test();
	}
	return $update_actions;
}

/**
 * Translates a decimal analysis score into a textual one.
 *
 * @param int  $val The decimal score to translate.
 * @param bool $css_value Whether to return the i18n translated score or the CSS class value.
 *
 * @return string
 */
function wpseo_translate_score( $val, $css_value = true ) {
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

	if ( $css_value ) {
		return $css;
	}
	else {
		return $score;
	}
}


/**
 * Adds an SEO admin bar menu with several options. If the current user is an admin he can also go straight to several settings menu's from here.
 */
function wpseo_admin_bar_menu() {
	// If the current user can't write posts, this is all of no use, so let's not output an admin menu
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}

	global $wp_admin_bar, $wpseo_front, $post;

	$url = '';
	if ( is_object( $wpseo_front ) ) {
		$url = $wpseo_front->canonical( false );
	}

	$focuskw = '';
	$score   = '';
	$seo_url = get_admin_url( null, 'admin.php?page=wpseo_dashboard' );

	if ( ( is_singular() || ( is_admin() && in_array( $GLOBALS['pagenow'], array( 'post.php', 'post-new.php' ), true ) ) ) && isset( $post ) && is_object( $post ) && apply_filters( 'wpseo_use_page_analysis', true ) === true ) {
		$focuskw    = WPSEO_Meta::get_value( 'focuskw', $post->ID );
		$perc_score = WPSEO_Meta::get_value( 'linkdex', $post->ID );
		$calc_score = wpseo_calc( $perc_score, '/', 10, true );
		$txtscore   = wpseo_translate_score( $calc_score );
		$title      = wpseo_translate_score( $calc_score, false );
		$score      = '<div title="' . esc_attr( $title ) . '" class="' . esc_attr( 'wpseo_score_img ' . $txtscore . ' ' . $perc_score ) . '"></div>';

		$seo_url = get_edit_post_link( $post->ID );
		if ( $txtscore !== 'na' ) {
			$seo_url .= '#wpseo_linkdex';
		}
	}

	$wp_admin_bar->add_menu( array( 'id' => 'wpseo-menu', 'title' => __( 'SEO', 'wordpress-seo' ) . $score, 'href' => $seo_url, ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-kwresearch', 'title' => __( 'Keyword Research', 'wordpress-seo' ), '#', ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-adwordsexternal', 'title' => __( 'AdWords External', 'wordpress-seo' ), 'href' => 'https://adwords.google.com/select/KeywordToolExternal', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-googleinsights', 'title' => __( 'Google Insights', 'wordpress-seo' ), 'href' => 'http://www.google.com/insights/search/#q=' . urlencode( $focuskw ) . '&cmpt=q', 'meta' => array( 'target' => '_blank' ) ) );
	$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-kwresearch', 'id' => 'wpseo-wordtracker', 'title' => __( 'SEO Book', 'wordpress-seo' ), 'href' => 'http://tools.seobook.com/keyword-tools/seobook/?keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );

	if ( ! is_admin() ) {
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-analysis', 'title' => __( 'Analyze this page', 'wordpress-seo' ), '#', ) );
		if ( is_string( $url ) ) {
			// @todo [JRF => whomever] check if this url shouldn't be encoded either with urlencode or with esc_url or something
			$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-inlinks-ose', 'title' => __( 'Check Inlinks (OSE)', 'wordpress-seo' ), 'href' => 'http://www.opensiteexplorer.org/' . str_replace( '/', '%252F', preg_replace( '`^http[s]?://`', '', $url ) ) . '/a!links', 'meta' => array( 'target' => '_blank' ) ) );
			$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-kwdensity', 'title' => __( 'Check Keyword Density', 'wordpress-seo' ), 'href' => 'http://tools.davidnaylor.co.uk/keyworddensity/index.php?url=' . urlencode( $url ) . '&keyword=' . urlencode( $focuskw ), 'meta' => array( 'target' => '_blank' ) ) );
			$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-cache', 'title' => __( 'Check Google Cache', 'wordpress-seo' ), 'href' => 'http://webcache.googleusercontent.com/search?strip=1&q=cache:' . urlencode( $url ), 'meta' => array( 'target' => '_blank' ) ) );
			$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-analysis', 'id' => 'wpseo-header', 'title' => __( 'Check Headers', 'wordpress-seo' ), 'href' => 'http://quixapp.com/headers/?r=' . urlencode( $url ), 'meta' => array( 'target' => '_blank' ) ) );
		}
	}

	$admin_menu = false;
	if ( function_exists( 'is_multisite' ) && is_multisite() ) {
		$options = get_site_option( 'wpseo_ms' );
		if ( $options['access'] === 'superadmin' ) {
			if ( is_super_admin() ) {
				$admin_menu = true;
			}
			else {
				$admin_menu = false;
			}
		}
		else {
			if ( current_user_can( 'manage_options' ) ) {
				$admin_menu = true;
			}
			else {
				$admin_menu = false;
			}
		}
	}
	else {
		if ( current_user_can( 'manage_options' ) ) {
			$admin_menu = true;
		}
	}

	if ( $admin_menu ) {
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-menu', 'id' => 'wpseo-settings', 'title' => __( 'SEO Settings', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_titles' ), ) );
		$wp_admin_bar->add_menu( array( 'parent' => 'wpseo-settings', 'id' => 'wpseo-titles', 'title' => __( 'Titles &amp; Metas', 'wordpress-seo' ), 'href' => admin_url( 'admin.php?page=wpseo_titles' ), ) );
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
		wp_enqueue_style( 'boxes', plugins_url( 'css/adminbar' . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ), array(), WPSEO_VERSION );
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
	if ( in_array( $args[0], array( 'edit_post_meta', 'add_post_meta' ) ) ) {
		// Only allow editing rights for users who have the rights to edit this post and make sure
		// the meta value starts with _yoast_wpseo (WPSEO_Meta::$meta_prefix).
		if ( ( isset( $args[2] ) && current_user_can( 'edit_post', $args[2] ) ) && ( ( isset( $args[3] ) && $args[3] !== '' ) && strpos( $args[3], WPSEO_Meta::$meta_prefix ) === 0 ) ) {
			$allcaps[$args[0]] = true;
		}
	}

	return $allcaps;
}

add_filter( 'user_has_cap', 'allow_custom_field_edits', 0, 3 );


/********************** DEPRECATED FUNCTIONS **********************/

/**
 * Set the default settings.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Options::initialize()
 * @see WPSEO_Options::initialize()
 */
function wpseo_defaults() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::initialize()' );
	WPSEO_Options::initialize();
}