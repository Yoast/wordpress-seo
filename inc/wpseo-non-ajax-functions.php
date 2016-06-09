<?php
/**
 * @package WPSEO\Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Adds an SEO admin bar menu with several options. If the current user is an admin he can also go straight to several settings menu's from here.
 */
function wpseo_admin_bar_menu() {
	// If the current user can't write posts, this is all of no use, so let's not output an admin menu.
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}

	global $wp_admin_bar, $post;

	$admin_menu = current_user_can( 'manage_options' );
	if ( ! $admin_menu && is_multisite() ) {
		$options    = get_site_option( 'wpseo_ms' );
		$admin_menu = ( $options['access'] === 'superadmin' && is_super_admin() );
	}

	$focuskw = '';
	$score   = '';
	$seo_url = '';

	if ( ( is_singular() || ( is_admin() && in_array( $GLOBALS['pagenow'], array(
					'post.php',
					'post-new.php',
				), true ) ) ) && isset( $post ) && is_object( $post ) && apply_filters( 'wpseo_use_page_analysis', true ) === true
	) {
		$focuskw    = WPSEO_Meta::get_value( 'focuskw', $post->ID );
		$score      = '<div class="' . esc_attr( 'wpseo-score-icon' ) . ' adminbar-seo-score"></div>';

		$seo_url = get_edit_post_link( $post->ID );
	}

	if ( WPSEO_Taxonomy::is_term_edit( $GLOBALS['pagenow'] ) ) {
		$score      = '<div class="' . esc_attr( 'wpseo-score-icon' ) . ' adminbar-seo-score"></div>';
		$seo_url    = get_edit_tag_link( filter_input( INPUT_GET, 'tag_ID' ), 'category' );
	}

	// Never display notifications for network admin.
	$counter = '';

	if ( $admin_menu ) {

		$seo_url = get_admin_url( null, 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER );

		if ( '' === $score ) {

			// Notification information.
			$notification_center     = Yoast_Notification_Center::get();
			$notification_count      = $notification_center->get_notification_count();
			$new_notifications       = $notification_center->get_new_notifications();
			$new_notifications_count = count( $new_notifications );

			if ( $notification_count > 0 ) {
				// Always show Alerts page when clicking on the main link.
				$counter = sprintf( ' <div class="wp-core-ui wp-ui-notification yoast-issue-counter">%d</div>', $notification_count );
			}

			if ( $new_notifications_count ) {
				$notification = sprintf(
					/* translators: %d resolves to the number of alerts being added. */
					_n( 'You have a new issue concerning your SEO!', 'You have %d new issues concerning your SEO!', $new_notifications_count, 'wordpress-seo' ),
					$new_notifications_count
				);
				$counter .= '<div class="yoast-issue-added">' . $notification . '</div>';
			}
		}
	}

	// Yoast Icon.
	$icon_svg = WPSEO_Utils::get_icon_svg();
	$title = '<div id="yoast-ab-icon" class="ab-item yoast-logo svg" style="background-image: url(\''.$icon_svg.'\');"></div>';

	$wp_admin_bar->add_menu( array(
		'id'    => 'wpseo-menu',
		'title' => $title . $score . $counter,
		'href'  => $seo_url,
	) );
	$wp_admin_bar->add_menu( array(
		'parent' => 'wpseo-menu',
		'id'     => 'wpseo-kwresearch',
		'title'  => __( 'Keyword Research', 'wordpress-seo' ),
		'#',
	) );
	$wp_admin_bar->add_menu( array(
		'parent' => 'wpseo-kwresearch',
		'id'     => 'wpseo-adwordsexternal',
		'title'  => __( 'AdWords External', 'wordpress-seo' ),
		'href'   => 'http://adwords.google.com/keywordplanner',
		'meta'   => array( 'target' => '_blank' ),
	) );
	$wp_admin_bar->add_menu( array(
		'parent' => 'wpseo-kwresearch',
		'id'     => 'wpseo-googleinsights',
		'title'  => __( 'Google Insights', 'wordpress-seo' ),
		'href'   => 'http://www.google.com/insights/search/#q=' . urlencode( $focuskw ) . '&cmpt=q',
		'meta'   => array( 'target' => '_blank' ),
	) );
	$wp_admin_bar->add_menu( array(
		'parent' => 'wpseo-kwresearch',
		'id'     => 'wpseo-wordtracker',
		'title'  => __( 'SEO Book', 'wordpress-seo' ),
		'href'   => 'http://tools.seobook.com/keyword-tools/seobook/?keyword=' . urlencode( $focuskw ),
		'meta'   => array( 'target' => '_blank' ),
	) );

	if ( ! is_admin() ) {
		$url = WPSEO_Frontend::get_instance()->canonical( false );

		if ( is_string( $url ) ) {
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-menu',
				'id'     => 'wpseo-analysis',
				'title'  => __( 'Analyze this page', 'wordpress-seo' ),
				'#',
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-inlinks-ose',
				'title'  => __( 'Check Inlinks (OSE)', 'wordpress-seo' ),
				'href'   => '//moz.com/researchtools/ose/links?site=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-kwdensity',
				'title'  => __( 'Check Keyword Density', 'wordpress-seo' ),
				'href'   => '//www.zippy.co.uk/keyworddensity/index.php?url=' . urlencode( $url ) . '&keyword=' . urlencode( $focuskw ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-cache',
				'title'  => __( 'Check Google Cache', 'wordpress-seo' ),
				'href'   => '//webcache.googleusercontent.com/search?strip=1&q=cache:' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-header',
				'title'  => __( 'Check Headers', 'wordpress-seo' ),
				'href'   => '//quixapp.com/headers/?r=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-richsnippets',
				'title'  => __( 'Check Rich Snippets', 'wordpress-seo' ),
				'href'   => '//www.google.com/webmasters/tools/richsnippets?q=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-facebookdebug',
				'title'  => __( 'Facebook Debugger', 'wordpress-seo' ),
				'href'   => '//developers.facebook.com/tools/debug/og/object?q=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-pinterestvalidator',
				'title'  => __( 'Pinterest Rich Pins Validator', 'wordpress-seo' ),
				'href'   => '//developers.pinterest.com/rich_pins/validator/?link=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-htmlvalidation',
				'title'  => __( 'HTML Validator', 'wordpress-seo' ),
				'href'   => '//validator.w3.org/check?uri=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-cssvalidation',
				'title'  => __( 'CSS Validator', 'wordpress-seo' ),
				'href'   => '//jigsaw.w3.org/css-validator/validator?uri=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-pagespeed',
				'title'  => __( 'Google Page Speed Test', 'wordpress-seo' ),
				'href'   => '//developers.google.com/speed/pagespeed/insights/?url=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-modernie',
				'title'  => __( 'Modern IE Site Scan', 'wordpress-seo' ),
				'href'   => '//www.modern.ie/en-us/report#' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
			$wp_admin_bar->add_menu( array(
				'parent' => 'wpseo-analysis',
				'id'     => 'wpseo-google-mobile-friendly',
				'title'  => __( 'Mobile-Friendly Test', 'wordpress-seo' ),
				'href'   => 'https://www.google.com/webmasters/tools/mobile-friendly/?url=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
		}
	}

	// @todo: add links to bulk title and bulk description edit pages.
	if ( $admin_menu ) {
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-menu',
			'id'     => 'wpseo-settings',
			'title'  => __( 'SEO Settings', 'wordpress-seo' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-general',
			'title'  => __( 'General', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_dashboard' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-titles',
			'title'  => __( 'Titles &amp; Metas', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_titles' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-social',
			'title'  => __( 'Social', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_social' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-xml',
			'title'  => __( 'XML Sitemaps', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_xml' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-wpseo-advanced',
			'title'  => __( 'Advanced', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_advanced' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-tools',
			'title'  => __( 'Tools', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_tools' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-search-console',
			'title'  => __( 'Search Console', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_search_console' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-licenses',
			'title'  => '<span style="color:#f18500">' . __( 'Extensions', 'wordpress-seo' ) . '</span>',
			'href'   => admin_url( 'admin.php?page=wpseo_licenses' ),
		) );
	}

}

add_action( 'admin_bar_menu', 'wpseo_admin_bar_menu', 95 );

/**
 * Enqueue CSS to format the Yoast SEO adminbar item.
 */
function wpseo_admin_bar_style() {
	if ( ! is_user_logged_in() ) {
		return;
	}

	$asset_manager = new WPSEO_Admin_Asset_Manager();
	$asset_manager->register_assets();
	$asset_manager->enqueue_style( 'adminbar' );
}

add_action( 'wp_enqueue_scripts', 'wpseo_admin_bar_style' );
add_action( 'admin_enqueue_scripts', 'wpseo_admin_bar_style' );

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
	// $args[0] holds the capability.
	// $args[2] holds the post ID.
	// $args[3] holds the custom field.
	// Make sure the request is to edit or add a post meta (this is usually also the second value in $cap,
	// but this is safer to check).
	if ( in_array( $args[0], array( 'edit_post_meta', 'add_post_meta' ) ) ) {
		// Only allow editing rights for users who have the rights to edit this post and make sure
		// the meta value starts with _yoast_wpseo (WPSEO_Meta::$meta_prefix).
		if ( ( isset( $args[2] ) && current_user_can( 'edit_post', $args[2] ) ) && ( ( isset( $args[3] ) && $args[3] !== '' ) && strpos( $args[3], WPSEO_Meta::$meta_prefix ) === 0 ) ) {
			$allcaps[ $args[0] ] = true;
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
 * @see        WPSEO_Options::initialize()
 */
function wpseo_defaults() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::initialize()' );
	WPSEO_Options::initialize();
}

/**
 * Translates a decimal analysis score into a textual one.
 *
 * @deprecated 1.5.6.1
 * @deprecated use WPSEO_Utils::translate_score()
 * @see        WPSEO_Utils::translate_score()
 *
 * @param int  $val       The decimal score to translate.
 * @param bool $css_value Whether to return the i18n translated score or the CSS class value.
 *
 * @return string
 */
function wpseo_translate_score( $val, $css_value = true ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.6.1', 'WPSEO_Utils::translate_score()' );

	return WPSEO_Utils::translate_score();
}

/**
 * Check whether file editing is allowed for the .htaccess and robots.txt files
 *
 * @deprecated 1.5.6.1
 * @deprecated use WPSEO_Utils::allow_system_file_edit()
 * @see        WPSEO_Utils::allow_system_file_edit()
 *
 * @internal   current_user_can() checks internally whether a user is on wp-ms and adjusts accordingly.
 *
 * @return bool
 */
function wpseo_allow_system_file_edit() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.6.1', 'WPSEO_Utils::allow_system_file_edit()' );

	return WPSEO_Utils::allow_system_file_edit();
}

/**
 * Test whether force rewrite should be enabled or not.
 *
 * @deprecated 3.3
 *
 * @return void
 */
function wpseo_title_test() {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.3.0' );
}

/**
 * Test whether the active theme contains a <meta> description tag.
 *
 * @since 1.4.14 Moved from dashboard.php and adjusted - see changelog
 *
 * @deprecated 3.3
 *
 * @return void
 */
function wpseo_description_test() {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.3.0' );
}

/**
 * Check if the current theme was updated and if so, test the updated theme
 * for the title and meta description tag
 *
 * @since    1.4.14
 *
 * @deprecated 3.3
 *
 * @param WP_Upgrader $upgrader_object Upgrader object instance.
 * @param array       $context_array   Context data array.
 * @param mixed       $themes          Optional themes set.
 *
 * @return  void
 */
function wpseo_upgrader_process_complete( $upgrader_object, $context_array, $themes = null ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.3.0' );
}

/**
 * Abuse a filter to check if the current theme was updated and if so, test the updated theme
 * for the title and meta description tag
 *
 * @since 1.4.14
 * @deprecated 3.3
 *
 * @param   array           $update_actions Updated actions set.
 * @param   WP_Theme|string $updated_theme  Theme object instance or stylesheet name.
 */
function wpseo_update_theme_complete_actions( $update_actions, $updated_theme ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.3.0' );
}
