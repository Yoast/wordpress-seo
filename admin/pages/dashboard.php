<?php
/**
 *
 *
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}
global $wpseo_admin_pages;

$options = get_option( 'wpseo' );

if ( isset( $_GET['allow_tracking'] ) && check_admin_referer( 'wpseo_activate_tracking', 'nonce' ) ) {
	$options['tracking_popup_done'] = true;
	if ( $_GET['allow_tracking'] == 'yes' )
		$options['yoast_tracking'] = true;
	else
		$options['yoast_tracking'] = false;
	update_option( 'wpseo', $options );

	if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
		wp_safe_redirect( $_SERVER['HTTP_REFERER'], 307 );
		exit;
	}
}

$wpseo_admin_pages->admin_header( true, WPSEO_Options::$options['wpseo']['group'], 'wpseo' );

// detect and handle robots meta here
robots_meta_handler();

// detect and handle aioseo here
aioseo_handler();

do_action( 'wpseo_all_admin_notices' );

echo $wpseo_admin_pages->hidden( 'ignore_blog_public_warning' );
echo $wpseo_admin_pages->hidden( 'ignore_tour' );
echo $wpseo_admin_pages->hidden( 'ignore_page_comments' );
echo $wpseo_admin_pages->hidden( 'ignore_permalink' );
echo $wpseo_admin_pages->hidden( 'ms_defaults_set' );
echo $wpseo_admin_pages->hidden( 'version' );
echo $wpseo_admin_pages->hidden( 'tracking_popup_done' );

// Fix metadescription if so requested
if ( isset( $_GET['fixmetadesc'] ) && check_admin_referer( 'wpseo-fix-metadesc', 'nonce' ) && $options['theme_description_found'] !== '' ) {
	$path = false;
	if ( file_exists( get_stylesheet_directory() . '/header.php' ) ) {
		// theme or child theme
		$path = get_stylesheet_directory();
	}
	else if ( file_exists( get_template_directory() . '/header.php' ) ) {
		// parent theme in case of a child theme
		$path = get_template_directory();
	}

	if ( is_string( $path ) && $path !== '' ) {
		$fcontent    = file_get_contents( $path . '/header.php' );
		$msg         = '';
		$backup_file = date( 'Ymd-H.i.s-' ) . 'header.php.wpseobak';
		if ( ! file_exists( $path . '/' . $backup_file ) ) {
			$backupfile = fopen( $path . '/' . $backup_file, 'w+' );
			if ( $backupfile ) {
				fwrite( $backupfile, $fcontent );
				fclose( $backupfile );
				$msg = __( 'Backed up the original file header.php to <strong><em>' . esc_html( $backup_file ) . '</em></strong>, ', 'wordpress-seo' );
	
				$count    = 0;
				$fcontent = str_replace( $options['theme_description_found'], '', $fcontent, $count );
				if ( $count > 0 ) {
					$header_file = fopen( $path . '/header.php', 'w+' );
					if ( $header_file ) {
						if ( fwrite( $header_file, $fcontent ) !== false ) {
							$msg .= __( 'Removed hardcoded meta description.', 'wordpress-seo' );
							$options['theme_has_description']   = false;
							$options['theme_description_found'] = '';
							update_option( 'wpseo', $options );
						}
						else {
							$msg .= '<span class="error">' . __( 'Failed to remove hardcoded meta description.', 'wordpress-seo' ) . '</span>';
						}
						fclose( $header_file );
					}
				}
				echo '<div class="updated"><p>' . $msg . '</p></div>';
			}
		}
	}
}

if ( is_array( $options['blocking_files'] ) && count( $options['blocking_files'] ) > 0 ) {
	$options['blocking_files'] = array_unique( $options['blocking_files'] );
	echo '<p id="blocking_files" class="wrong">'
		. '<a href="javascript:wpseo_killBlockingFiles(\'' . esc_js( wp_create_nonce( 'wpseo-blocking-files' ) ) . '\')" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. __( 'The following file(s) is/are blocking your XML sitemaps from working properly:', 'wordpress-seo' ) . '<br />';
	foreach ( $options['blocking_files'] as $file ) {
		echo esc_html( $file ) . '<br/>';
	}
	echo __( 'Either delete them (this can be done with the "Fix it" button) or disable WP SEO XML sitemaps.', 'wordpress-seo' );
	echo '</p>';
}


if ( ( ! isset( $options['theme_has_description'] ) || ( ( isset( $options['theme_has_description'] ) && $options['theme_has_description'] === true ) || $options['theme_description_found'] !== '' ) ) || ( isset( $_GET['checkmetadesc'] ) && check_admin_referer( 'wpseo-check-metadesc', 'nonce' ) ) ) {
	wpseo_description_test();
	// Renew the options after the test
	$options = get_option( 'wpseo' );
}
echo $wpseo_admin_pages->hidden( 'theme_has_description' );
//echo $wpseo_admin_pages->hidden( 'theme_description_found' );
echo $wpseo_admin_pages->hidden( 'ignore_meta_description_warning' );

if ( $options['theme_description_found'] !== '' ) {
	echo '<p id="metadesc_found notice" class="wrong settings_error">'
		. '<a href="' . esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo-fix-metadesc' ) ), admin_url( 'admin.php?page=wpseo_dashboard&fixmetadesc' ) ) ) . '" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. ' <a href="' . esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo-check-metadesc' ) ), admin_url( 'admin.php?page=wpseo_dashboard&checkmetadesc' ) ) ) . '" class="button checkit">' . __( 'Re-check theme.', 'wordpress-seo' ) . '</a>'
		. __( 'Your theme contains a meta description, which blocks WordPress SEO from working properly, please delete the following line, or press fix it:', 'wordpress-seo' ) . '<br />';
	echo '<code>' . esc_html( $options['theme_description_found'] ) . '</code>';
	echo '</p>';
}


if ( strpos( get_option( 'permalink_structure' ), '%postname%' ) === false && $options['ignore_permalink'] === false )
	echo '<p id="wrong_permalink" class="wrong">'
		. '<a href="' . esc_url( admin_url( 'options-permalink.php' ) ) . '" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. '<a href="javascript:wpseo_setIgnore(\'permalink\',\'wrong_permalink\',\'' . esc_js( wp_create_nonce( 'wpseo-ignore' ) ) . '\');" class="button fixit">' . __( 'Ignore.', 'wordpress-seo' ) . '</a>'
		. __( 'You do not have your postname in the URL of your posts and pages, it is highly recommended that you do. Consider setting your permalink structure to <strong>/%postname%/</strong>.', 'wordpress-seo' ) . '</p>';

if ( get_option( 'page_comments' ) && $options['ignore_page_comments'] === false )
	echo '<p id="wrong_page_comments" class="wrong">'
		. '<a href="javascript:setWPOption(\'page_comments\',\'0\',\'wrong_page_comments\',\'' . esc_js( wp_create_nonce( 'wpseo-setoption' ) ) . '\');" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. '<a href="javascript:wpseo_setIgnore(\'page_comments\',\'wrong_page_comments\',\'' . esc_js( wp_create_nonce( 'wpseo-ignore' ) ) . '\');" class="button fixit">' . __( 'Ignore.', 'wordpress-seo' ) . '</a>'
		. __( 'Paging comments is enabled, this is not needed in 999 out of 1000 cases, so the suggestion is to disable it, to do that, simply uncheck the box before "Break comments into pages..."', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'General', 'wordpress-seo' ) . '</h2>';

if ( $options['ignore_tour'] === true ) {
	echo '<label class="select">' . __( 'Introduction Tour:', 'wordpress-seo' ) . '</label><a class="button-secondary" href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard&wpseo_restart_tour' ) ) . '">' . __( 'Start Tour', 'wordpress-seo' ) . '</a>';
	echo '<p class="desc label">' . __( 'Take this tour to quickly learn about the use of this plugin.', 'wordpress-seo' ) . '</p>';
}

echo '<label class="select">' . __( 'Default Settings:', 'wordpress-seo' ) . '</label><a class="button-secondary" href="' . esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo_reset_defaults' ) ), admin_url( 'admin.php?page=wpseo_dashboard&wpseo_reset_defaults' ) ) ) . '">' . __( 'Reset Default Settings', 'wordpress-seo' ) . '</a>';
echo '<p class="desc label">' . __( 'If you want to restore a site to the default WordPress SEO settings, press this button.', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Tracking', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'yoast_tracking', __( 'Allow tracking of this WordPress installs anonymous data.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( "To maintain a plugin as big as WordPress SEO, we need to know what we're dealing: what kinds of other plugins our users are using, what themes, etc. Please allow us to track that data from your install. It will not track <em>any</em> user details, so your security and privacy are safe with us.", 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Security', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'disableadvanced_meta', __( 'Disable the Advanced part of the WordPress SEO meta box', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'Unchecking this box allows authors and editors to redirect posts, noindex them and do other things you might not want if you don\'t trust your authors.', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Webmaster Tools', 'wordpress-seo' ) . '</h2>';
echo '<p>' . __( 'You can use the boxes below to verify with the different Webmaster Tools, if your site is already verified, you can just forget about these. Enter the verify meta values for:', 'wordpress-seo' ) . '</p>';
echo $wpseo_admin_pages->textinput( 'googleverify', '<a target="_blank" href="' . esc_url( 'https://www.google.com/webmasters/verification/verification?hl=en&siteUrl=' . urlencode( get_bloginfo( 'url' ) ) . '/' ) . '">' . __( 'Google Webmaster Tools', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'msverify', '<a target="_blank" href="' . esc_url( 'http://www.bing.com/webmaster/?rfp=1#/Dashboard/?url=' . urlencode( str_replace( 'http://', '', get_bloginfo( 'url' ) ) ) ) . '">' . __( 'Bing Webmaster Tools', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'alexaverify', '<a target="_blank" href="http://www.alexa.com/siteowners/claim">' . __( 'Alexa Verification ID', 'wordpress-seo' ) . '</a>' );

do_action( 'wpseo_dashboard' );

$wpseo_admin_pages->admin_footer();

/**
 * Handle deactivation & import of Robots Meta data
 *
 * @ since 1.4.8
 */
function robots_meta_handler() {
	global $wpdb;

	// check if robots meta is running
	if ( is_plugin_active( 'robots-meta/robots-meta.php' ) ) {

		// deactivate robots meta
		if ( isset( $_GET['deactivate_robots_meta'] ) && $_GET['deactivate_robots_meta'] === '1' ) {
			deactivate_plugins( 'robots-meta/robots-meta.php' );

			// show notice that robots meta has been deactivated
			add_action( 'wpseo_all_admin_notices', 'wpseo_deactivate_robots_meta_notice' );
		}
		// import the settings
		else if ( isset( $_GET['import_robots_meta'] ) && $_GET['import_robots_meta'] === '1' ) {
			// import robots meta setting for each post
			// @todo how does this corrolate with the routine on the import page ?
			// isn't one superfluous ? functionality wasn't the same either, changed now.
			$posts = $wpdb->get_results( "SELECT ID, robotsmeta FROM $wpdb->posts" );
			foreach ( $posts as $post ) {
				// sync all possible settings
				if ( $post->robotsmeta ) {
					$pieces = explode( ',', $post->robotsmeta );
					foreach ( $pieces as $meta ) {
						switch ( $meta ) {
							case 'noindex':
								WPSEO_Meta::set_value( 'meta-robots-noindex', '1', $post->ID );
								break;
							case 'index':
								WPSEO_Meta::set_value( 'meta-robots-noindex', '2', $post->ID );
								break;
							case 'nofollow':
								WPSEO_Meta::set_value( 'meta-robots-nofollow', '1', $post->ID );
								break;
						}
					}
				}
			}

			// show notice to deactivate robots meta plugin
			add_action( 'wpseo_all_admin_notices', 'wpseo_deactivate_link_robots_meta_notice' );
		}
		// show notice to import robots meta settings
		else {
			add_action( 'wpseo_all_admin_notices', 'wpseo_import_robots_meta_notice' );
		}
	}
}

/**
 * Handle deactivation & import of AIOSEO data
 *
 * @ since 1.4.8
 */
function aioseo_handler() {
	// check if aioseo is running
	if ( is_plugin_active( 'all-in-one-seo-pack/all_in_one_seo_pack.php' ) ) {

		// deactivate aioseo plugin
		if ( isset( $_GET['deactivate_aioseo'] ) && $_GET['deactivate_aioseo'] === '1' ) {
			deactivate_plugins( 'all-in-one-seo-pack/all_in_one_seo_pack.php' );

			// show notice that aioseo has been deactivated
			add_action( 'wpseo_all_admin_notices', 'wpseo_deactivate_aioseo_notice' );
		}
		// import the settings
		// @todo: currently not deleting aioseop postmeta or handling old aioseop format
		else if ( isset( $_GET['import_aioseo'] ) && $_GET['import_aioseo'] === '1' ) {
			$replace = false;

			WPSEO_Meta::replace_meta( '_aioseop_description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
			WPSEO_Meta::replace_meta( '_aioseop_keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
			WPSEO_Meta::replace_meta( '_aioseop_title', WPSEO_Meta::$meta_prefix . 'title', $replace );

			if ( isset( $_POST['wpseo']['importaioseoold'] ) ) {
				WPSEO_Meta::replace_meta( 'description', WPSEO_Meta::$meta_prefix . 'metadesc', $replace );
				WPSEO_Meta::replace_meta( 'keywords', WPSEO_Meta::$meta_prefix . 'metakeywords', $replace );
				WPSEO_Meta::replace_meta( 'title', WPSEO_Meta::$meta_prefix . 'title', $replace );
			}

			// show notice to deactivate aioseo plugin
			add_action( 'wpseo_all_admin_notices', 'wpseo_deactivate_link_aioseo_notice' );
		}
		// show notice to import aioseo settings
		else {
			add_action( 'wpseo_all_admin_notices', 'wpseo_import_aioseo_setting_notice' );
		}
	}
}

/**
 * Throw a notice to import Robots Meta.
 *
 * @since 1.4.8
 */
function wpseo_import_robots_meta_notice() {
	echo '<div class="updated"><p>' . sprintf( __( 'The plugin Robots-Meta has been detected. Do you want to %simport its settings%s.' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard&import_robots_meta=1' ) ) . '">', '</a>' ) . '</p></div>';
}

/**
 * Throw a notice to allow the user to deactivate Robots Meta
 *
 * @since 1.4.8
 */
function wpseo_deactivate_link_robots_meta_notice() {
	echo '<div class="updated"><p>' . sprintf( __( 'Robots-Meta settings has been imported. We recommend %sdisabling the Robots-Meta plugin%s to avoid any conflicts' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard&deactivate_robots_meta=1' ) ) . '">', '</a>' ) . '</p></div>';
}

/**
 * Throw a notice to inform the user Robots Meta has been deactivated
 *
 * @since 1.4.8
 */
function wpseo_deactivate_robots_meta_notice() {
	echo '<div class="updated"><p>' . __( 'Robots-Meta has been deactivated' ) . '</p></div>';
}

/**
 * Throw a notice to import AIOSEO.
 *
 * @since 1.4.8
 */
function wpseo_import_aioseo_setting_notice() {
	echo '<div class="updated"><p>' . sprintf( __( 'The plugin All-In-One-SEO has been detected. Do you want to %simport its settings%s.' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard&import_aioseo=1' ) ) . '">', '</a>' ) . '</p></div>';
}

/**
 * Throw a notice to allow the user to deactivate AIOSEO
 *
 * @since 1.4.8
 */
function wpseo_deactivate_link_aioseo_notice( $active ) {
	echo '<div class="updated"><p>' . sprintf( __( 'All in One SEO data successfully imported. Would you like to %sdisable the All in One SEO plugin%s.' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard&deactivate_aioseo=1' ) ) . '">', '</a>' ) . '</p></div>';
}

/**
 * Throw a notice to inform the user AIOSEO has been deactivated
 *
 * @since 1.4.8
 */
function wpseo_deactivate_aioseo_notice() {
	echo '<div class="updated"><p>' . __( 'All-In-One-SEO has been deactivated' ) . '</p></div>';
}