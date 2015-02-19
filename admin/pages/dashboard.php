<?php
/**
 * @package    WPSEO
 * @subpackage Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;

$options = get_option( 'wpseo' );

if ( isset( $_GET['allow_tracking'] ) && check_admin_referer( 'wpseo_activate_tracking', 'nonce' ) ) {
	$options['tracking_popup_done'] = true;
	if ( $_GET['allow_tracking'] == 'yes' ) {
		$options['yoast_tracking'] = true;
	}
	else {
		$options['yoast_tracking'] = false;
	}
	update_option( 'wpseo', $options );

	if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
		wp_safe_redirect( $_SERVER['HTTP_REFERER'], 307 );
		exit;
	}
}


// Fix metadescription if so requested
if ( isset( $_GET['fixmetadesc'] ) && check_admin_referer( 'wpseo-fix-metadesc', 'nonce' ) && $options['theme_description_found'] !== '' ) {
	$path = false;
	if ( file_exists( get_stylesheet_directory() . '/header.php' ) ) {
		// theme or child theme
		$path = get_stylesheet_directory();
	}
	elseif ( file_exists( get_template_directory() . '/header.php' ) ) {
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
							$msg                               .= __( 'Removed hardcoded meta description.', 'wordpress-seo' );
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
				else {
					wpseo_description_test();
					$msg .= '<span class="warning">' . __( 'Earlier found meta description was not found in file. Renewed the description test data.', 'wordpress-seo' ) . '</span>';
				}
				add_settings_error( 'yoast_wpseo_dashboard_options', 'error', $msg, 'updated' );
			}
		}
	}

	// Clean up the referrer url for later use
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg( array( 'nonce', 'fixmetadesc' ), $_SERVER['REQUEST_URI'] );
	}
}

if ( ( ! isset( $options['theme_has_description'] ) || ( ( isset( $options['theme_has_description'] ) && $options['theme_has_description'] === true ) || $options['theme_description_found'] !== '' ) ) || ( isset( $_GET['checkmetadesc'] ) && check_admin_referer( 'wpseo-check-metadesc', 'nonce' ) ) ) {
	wpseo_description_test();
	// Renew the options after the test
	$options = get_option( 'wpseo' );
}
if ( isset( $_GET['checkmetadesc'] ) ) {
	// Clean up the referrer url for later use
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg( array( 'nonce', 'checkmetadesc' ), $_SERVER['REQUEST_URI'] );
	}
}



$wpseo_admin_pages->admin_header( true, WPSEO_Options::get_group_name( 'wpseo' ), 'wpseo' );

do_action( 'wpseo_all_admin_notices' );

if ( is_array( $options['blocking_files'] ) && count( $options['blocking_files'] ) > 0 ) {
	echo '<p id="blocking_files" class="wrong">'
		. '<a href="javascript:wpseo_killBlockingFiles(\'' . esc_js( wp_create_nonce( 'wpseo-blocking-files' ) ) . '\')" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. __( 'The following file(s) is/are blocking your XML sitemaps from working properly:', 'wordpress-seo' ) . '<br />';
	foreach ( $options['blocking_files'] as $file ) {
		echo esc_html( $file ) . '<br/>';
	}
	echo __( 'Either delete them (this can be done with the "Fix it" button) or disable WP SEO XML sitemaps.', 'wordpress-seo' );
	echo '</p>';
}


if ( $options['theme_description_found'] !== '' ) {
	echo '<p id="metadesc_found notice" class="wrong settings_error">'
		. '<a href="' . esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo-fix-metadesc' ) ), admin_url( 'admin.php?page=wpseo_dashboard&fixmetadesc' ) ) ) . '" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. ' <a href="' . esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo-check-metadesc' ) ), admin_url( 'admin.php?page=wpseo_dashboard&checkmetadesc' ) ) ) . '" class="button checkit">' . __( 'Re-check theme.', 'wordpress-seo' ) . '</a>'
		. __( 'Your theme contains a meta description, which blocks WordPress SEO from working properly, please delete the following line, or press fix it:', 'wordpress-seo' ) . '<br />';
	echo '<code>' . esc_html( $options['theme_description_found'] ) . '</code>';
	echo '</p>';
}


if ( strpos( get_option( 'permalink_structure' ), '%postname%' ) === false && $options['ignore_permalink'] === false ) {
	echo '<p id="wrong_permalink" class="wrong">'
		. '<a href="' . esc_url( admin_url( 'options-permalink.php' ) ) . '" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. '<a href="javascript:wpseo_setIgnore(\'permalink\',\'wrong_permalink\',\'' . esc_js( wp_create_nonce( 'wpseo-ignore' ) ) . '\');" class="button fixit">' . __( 'Ignore.', 'wordpress-seo' ) . '</a>'
		. __( 'You do not have your postname in the URL of your posts and pages, it is highly recommended that you do. Consider setting your permalink structure to <strong>/%postname%/</strong>.', 'wordpress-seo' ) . '</p>';
}

if ( get_option( 'page_comments' ) && $options['ignore_page_comments'] === false ) {
	echo '<p id="wrong_page_comments" class="wrong">'
		. '<a href="javascript:setWPOption(\'page_comments\',\'0\',\'wrong_page_comments\',\'' . esc_js( wp_create_nonce( 'wpseo-setoption' ) ) . '\');" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. '<a href="javascript:wpseo_setIgnore(\'page_comments\',\'wrong_page_comments\',\'' . esc_js( wp_create_nonce( 'wpseo-ignore' ) ) . '\');" class="button fixit">' . __( 'Ignore.', 'wordpress-seo' ) . '</a>'
		. __( 'Paging comments is enabled, this is not needed in 999 out of 1000 cases, so the suggestion is to disable it, to do that, simply uncheck the box before "Break comments into pages..."', 'wordpress-seo' ) . '</p>';
}

echo '<h2>' . __( 'General', 'wordpress-seo' ) . '</h2>';

if ( $options['ignore_tour'] === true ) {
	echo '<label class="select">' . __( 'Introduction Tour:', 'wordpress-seo' ) . '</label><a class="button-secondary" href="' . esc_url( admin_url( 'admin.php?page=wpseo_dashboard&wpseo_restart_tour=1' ) ) . '">' . __( 'Start Tour', 'wordpress-seo' ) . '</a>';
	echo '<p class="desc label">' . __( 'Take this tour to quickly learn about the use of this plugin.', 'wordpress-seo' ) . '</p>';
}

echo '<label class="select">' . __( 'Default Settings:', 'wordpress-seo' ) . '</label><a onclick="if( !confirm(\'' . __( 'Are you sure you want to reset your SEO settings?', 'wordpress-seo' ) . '\') ) return false;" class="button-secondary" href="' . esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo_reset_defaults' ) ), admin_url( 'admin.php?page=wpseo_dashboard&wpseo_reset_defaults=1' ) ) ) . '">' . __( 'Reset Default Settings', 'wordpress-seo' ) . '</a>';
echo '<p class="desc label">' . __( 'If you want to restore a site to the default WordPress SEO settings, press this button.', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Tracking', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'yoast_tracking', __( 'Allow tracking of this WordPress install\'s anonymous data.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( "To maintain a plugin as big as WordPress SEO, we need to know what we're dealing with: what kinds of other plugins our users are using, what themes, etc. Please allow us to track that data from your install. It will not track <em>any</em> user details, so your security and privacy are safe with us.", 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Security', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'disableadvanced_meta', __( 'Disable the Advanced part of the WordPress SEO meta box', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'Unchecking this box allows authors and editors to redirect posts, noindex them and do other things you might not want if you don\'t trust your authors.', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Webmaster Tools', 'wordpress-seo' ) . '</h2>';
echo '<p>' . __( 'You can use the boxes below to verify with the different Webmaster Tools, if your site is already verified, you can just forget about these. Enter the verify meta values for:', 'wordpress-seo' ) . '</p>';
echo $wpseo_admin_pages->textinput( 'alexaverify', '<a target="_blank" href="http://www.alexa.com/siteowners/claim">' . __( 'Alexa Verification ID', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'msverify', '<a target="_blank" href="' . esc_url( 'http://www.bing.com/webmaster/?rfp=1#/Dashboard/?url=' . urlencode( str_replace( 'http://', '', get_bloginfo( 'url' ) ) ) ) . '">' . __( 'Bing Webmaster Tools', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'googleverify', '<a target="_blank" href="' . esc_url( 'https://www.google.com/webmasters/verification/verification?hl=en&siteUrl=' . urlencode( get_bloginfo( 'url' ) ) . '/' ) . '">' . __( 'Google Webmaster Tools', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'pinterestverify', '<a target="_blank" href="https://help.pinterest.com/entries/22488487-Verify-with-HTML-meta-tags">' . __( 'Pinterest', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'yandexverify', '<a target="_blank" href="http://help.yandex.com/webmaster/service/rights.xml#how-to">' . __( 'Yandex Webmaster Tools', 'wordpress-seo' ) . '</a>' );

do_action( 'wpseo_dashboard' );

$wpseo_admin_pages->admin_footer();