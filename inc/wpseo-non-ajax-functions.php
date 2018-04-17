<?php
/**
 * WPSEO plugin file.
 *
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

	$options = WPSEO_Options::get_options( array( 'wpseo', 'wpseo_ms' ) );

	if ( $options['enable_admin_bar_menu'] !== true ) {
		return;
	}

	global $wp_admin_bar, $post;

	$focuskw = '';
	$score   = '';
	// By default, the top level menu item has no link.
	$seo_url = '';
	// By default, make the no-link top level menu item focusable.
	$top_level_link_tabindex = '0';

	$analysis_seo         = new WPSEO_Metabox_Analysis_SEO();
	$analysis_readability = new WPSEO_Metabox_Analysis_Readability();

	if ( ( is_singular() || ( is_admin() && WPSEO_Metabox::is_post_edit( $GLOBALS['pagenow'] ) ) ) && isset( $post ) && is_object( $post ) && apply_filters( 'wpseo_use_page_analysis', true ) === true
	) {
		$focuskw = WPSEO_Meta::get_value( 'focuskw', $post->ID );

		if ( $analysis_seo->is_enabled() ) {
			$score = wpseo_adminbar_seo_score();
		}
		elseif ( $analysis_readability->is_enabled() ) {
			$score = wpseo_adminbar_content_score();
		}
	}

	if ( is_category() || is_tag() || ( WPSEO_Taxonomy::is_term_edit( $GLOBALS['pagenow'] ) && ! WPSEO_Taxonomy::is_term_overview( $GLOBALS['pagenow'] ) ) || is_tax() ) {
		if ( $analysis_seo->is_enabled() ) {
			$score = wpseo_tax_adminbar_seo_score();
		}
		elseif ( $analysis_readability->is_enabled() ) {
			$score = wpseo_tax_adminbar_content_score();
		}
	}

	// Never display notifications for network admin.
	$counter     = '';
	$alert_popup = '';

	// Determine is user is admin or network admin.
	$can_manage_seo = WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' );

	// Set the top level menu item content for admins and network admins.
	if ( $can_manage_seo ) {

		// Link the top level menu item to the Yoast Dashboard page.
		$seo_url = get_admin_url( null, 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER );
		// Since admins will get a real link, there's no need for a tabindex attribute.
		$top_level_link_tabindex = false;

		if ( '' === $score ) {

			// Notification information.
			$notification_center     = Yoast_Notification_Center::get();
			$notification_count      = $notification_center->get_notification_count();
			$new_notifications       = $notification_center->get_new_notifications();
			$new_notifications_count = count( $new_notifications );

			if ( $notification_count > 0 ) {
				// Always show Alerts page when clicking on the main link.
				/* translators: %s: number of notifications */
				$counter_screen_reader_text = sprintf( _n( '%s notification', '%s notifications', $notification_count, 'wordpress-seo' ), number_format_i18n( $notification_count ) );

				$counter = sprintf( ' <div class="wp-core-ui wp-ui-notification yoast-issue-counter"><span aria-hidden="true">%d</span><span class="screen-reader-text">%s</span></div>', $notification_count, $counter_screen_reader_text );
			}

			if ( $new_notifications_count ) {
				$notification = sprintf(
					/* translators: %d resolves to the number of alerts being added. */
					_n( 'You have %d new issue concerning your SEO!', 'You have %d new issues concerning your SEO!', $new_notifications_count, 'wordpress-seo' ),
					$new_notifications_count
				);
				if ( $new_notifications_count === 1 ) {
					$notification = sprintf(
						__( 'You have a new issue concerning your SEO!', 'wordpress-seo' ),
						$new_notifications_count
					);
				}
				$alert_popup = '<div class="yoast-issue-added">' . $notification . '</div>';
			}
		}
	}

	$title = '<div id="yoast-ab-icon" class="ab-item yoast-logo svg"><span class="screen-reader-text">' . __( 'SEO', 'wordpress-seo' ) . '</span></div>';

	$wp_admin_bar->add_menu( array(
		'id'    => 'wpseo-menu',
		'title' => $title . $score . $counter . $alert_popup,
		'href'  => $seo_url,
		'meta'  => array( 'tabindex' => $top_level_link_tabindex ),
	) );
	if ( ! empty( $notification_count ) ) {
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-menu',
			'id'     => 'wpseo-notifications',
			'title'  => __( 'Notifications', 'wordpress-seo' ) . $counter,
			'href'   => $seo_url,
			'meta'   => array( 'tabindex' => $top_level_link_tabindex ),
		) );
	}

	if ( WPSEO_Capability_Utils::current_user_can( 'wpseo_manage_options' ) ) {
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-menu',
			'id'     => 'wpseo-configuration-wizard',
			'title'  => __( 'Configuration Wizard', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=' . WPSEO_Configuration_Page::PAGE_IDENTIFIER ),
		) );
	}
	$wp_admin_bar->add_menu( array(
		'parent' => 'wpseo-menu',
		'id'     => 'wpseo-kwresearch',
		'title'  => __( 'Keyword Research', 'wordpress-seo' ),
		'meta'   => array( 'tabindex' => '0' ),
	) );
	$wp_admin_bar->add_menu( array(
		'parent' => 'wpseo-kwresearch',
		'id'     => 'wpseo-adwordsexternal',
		'title'  => __( 'AdWords External', 'wordpress-seo' ),
		'href'   => 'https://adwords.google.com/keywordplanner',
		'meta'   => array( 'target' => '_blank' ),
	) );
	$wp_admin_bar->add_menu( array(
		'parent' => 'wpseo-kwresearch',
		'id'     => 'wpseo-googleinsights',
		'title'  => __( 'Google Trends', 'wordpress-seo' ),
		'href'   => 'https://www.google.com/trends/explore#q=' . urlencode( $focuskw ),
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
				'meta'   => array( 'tabindex' => '0' ),
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
				// HTTPS not available.
				'href'   => 'http://www.zippy.co.uk/keyworddensity/index.php?url=' . urlencode( $url ) . '&keyword=' . urlencode( $focuskw ),
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
				'id'     => 'wpseo-structureddata',
				'title'  => __( 'Google Structured Data Test', 'wordpress-seo' ),
				'href'   => 'https://search.google.com/structured-data/testing-tool#url=' . urlencode( $url ),
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
				'href'   => 'https://developers.pinterest.com/tools/url-debugger/?link=' . urlencode( $url ),
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
				'id'     => 'wpseo-google-mobile-friendly',
				'title'  => __( 'Mobile-Friendly Test', 'wordpress-seo' ),
				'href'   => 'https://www.google.com/webmasters/tools/mobile-friendly/?url=' . urlencode( $url ),
				'meta'   => array( 'target' => '_blank' ),
			) );
		}
	}

	if ( $can_manage_seo ) {
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-menu',
			'id'     => 'wpseo-settings',
			'title'  => __( 'SEO Settings', 'wordpress-seo' ),
			'meta'   => array( 'tabindex' => '0' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-general',
			'title'  => __( 'Dashboard', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_dashboard' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-titles',
			'title'  => __( 'Search Appearance', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_titles' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-search-console',
			'title'  => __( 'Search Console', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_search_console' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-social',
			'title'  => __( 'Social', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_social' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-tools',
			'title'  => __( 'Tools', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_tools' ),
		) );
		$wp_admin_bar->add_menu( array(
			'parent' => 'wpseo-settings',
			'id'     => 'wpseo-licenses',
			'title'  => __( 'Premium', 'wordpress-seo' ),
			'href'   => admin_url( 'admin.php?page=wpseo_licenses' ),
		) );
	}
}

/**
 * Returns the SEO score element for the admin bar.
 *
 * @return string
 */
function wpseo_adminbar_seo_score() {
	$rating = WPSEO_Meta::get_value( 'linkdex', get_the_ID() );

	return wpseo_adminbar_score( $rating );
}

/**
 * Returns the content score element for the adminbar.
 *
 * @return string
 */
function wpseo_adminbar_content_score() {
	$rating = WPSEO_Meta::get_value( 'content_score', get_the_ID() );

	return wpseo_adminbar_score( $rating );
}

/**
 * Returns the SEO score element for the adminbar.
 *
 * @return string
 */
function wpseo_tax_adminbar_seo_score() {
	$rating = 0;

	if ( is_tax() || is_category() || is_tag() ) {
		$rating = WPSEO_Taxonomy_Meta::get_meta_without_term( 'linkdex' );
	}

	return wpseo_adminbar_score( $rating );
}

/**
 * Returns the Content score element for the adminbar.
 *
 * @return string
 */
function wpseo_tax_adminbar_content_score() {
	$rating = 0;

	if ( is_tax() || is_category() || is_tag() ) {
		$rating = WPSEO_Taxonomy_Meta::get_meta_without_term( 'content_score' );
	}

	return wpseo_adminbar_score( $rating );
}

/**
 * Takes The SEO score and makes the score icon for the adminbar with it.
 *
 * @param int $score The 0-100 rating of the score. Can be either SEO score or content score.
 *
 * @return string $score_adminbar_element
 */
function wpseo_adminbar_score( $score ) {
	$score = WPSEO_Utils::translate_score( $score );

	$score_adminbar_element = '<div class="wpseo-score-icon adminbar-seo-score ' . $score . '"><span class="adminbar-seo-score-text screen-reader-text"></span></div>';

	return $score_adminbar_element;
}

add_action( 'admin_bar_menu', 'wpseo_admin_bar_menu', 95 );

/**
 * Enqueue CSS to format the Yoast SEO adminbar item.
 */
function wpseo_admin_bar_style() {
	if ( ! is_admin_bar_showing() || WPSEO_Options::get( 'enable_admin_bar_menu' ) !== true ) {
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
	if ( in_array( $args[0], array( 'edit_post_meta', 'add_post_meta' ), true ) ) {
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
 * Detects if the advanced settings are enabled.
 *
 * @deprecated 7.0
 */
function wpseo_advanced_settings_enabled() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.0', null );
}
