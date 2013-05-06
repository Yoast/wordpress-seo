<?php
/**
 * @package Admin
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

global $wpseo_admin_pages;

$options = get_option( 'wpseo' );

if ( isset( $_GET['allow_tracking'] ) && check_admin_referer( 'wpseo_activate_tracking', 'nonce' ) ) {
	$options['tracking_popup'] = 'done';
	if ( $_GET['allow_tracking'] == 'yes' )
		$options['yoast_tracking'] = 'on';
	else
		$options['yoast_tracking'] = 'off';
	update_option( 'wpseo', $options );

	if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
		wp_safe_redirect( $_SERVER['HTTP_REFERER'], 307 );
		exit;
	}
}

$wpseo_admin_pages->admin_header( __( 'General Settings', 'wordpress-seo' ), true, 'yoast_wpseo_options', 'wpseo' );

echo $wpseo_admin_pages->hidden( 'ignore_blog_public_warning' );
echo $wpseo_admin_pages->hidden( 'ignore_tour' );
echo $wpseo_admin_pages->hidden( 'ignore_page_comments' );
echo $wpseo_admin_pages->hidden( 'ignore_permalink' );
echo $wpseo_admin_pages->hidden( 'ms_defaults_set' );
echo $wpseo_admin_pages->hidden( 'version' );
echo $wpseo_admin_pages->hidden( 'tracking_popup' );

if ( isset( $options['blocking_files'] ) && is_array( $options['blocking_files'] ) && count( $options['blocking_files'] ) > 0 ) {
	$options['blocking_files'] = array_unique( $options['blocking_files'] );
	echo '<p id="blocking_files" class="wrong">'
		. '<a href="javascript:wpseo_killBlockingFiles(\'' . wp_create_nonce( 'wpseo-blocking-files' ) . '\')" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. __( 'The following file(s) is/are blocking your XML sitemaps from working properly:', 'wordpress-seo' ) . '<br />';
	foreach ( $options['blocking_files'] as $file ) {
		echo esc_html( $file ) . '<br/>';
	}
	echo __( 'Either delete them (this can be done with the "Fix it" button) or disable WP SEO XML sitemaps.', 'wordpress-seo' );
	echo '</p>';
}

if ( isset( $_GET['fixmetadesc'] ) && check_admin_referer( 'wpseo-fix-metadesc', 'nonce' ) && isset( $options['theme_check'] ) && isset( $options['theme_check']['description_found'] ) && $options['theme_check']['description_found'] ) {
	$fcontent = file_get_contents( TEMPLATEPATH . '/header.php' );
	$msg      = '';
	if ( !file_exists( TEMPLATEPATH . '/header.php.wpseobak' ) ) {
		$backupfile = fopen( TEMPLATEPATH . '/header.php.wpseobak', 'w+' );
		if ( $backupfile ) {
			fwrite( $backupfile, $fcontent );
			fclose( $backupfile );
			$msg = __( 'Backed up the original file header.php to header.php.wpseobak, ', 'wordpress-seo' );

			$count    = 0;
			$fcontent = str_replace( $options['theme_check']['description_found'], '', $fcontent, $count );
			if ( $count > 0 ) {
				$header_file = fopen( TEMPLATEPATH . '/header.php', 'w+' );
				if ( $header_file ) {
					fwrite( $header_file, $fcontent );
					fclose( $header_file );
					$msg .= __( 'removed hardcoded meta description.' );
				}
			}
			unset( $options['theme_check']['description_found'] );
			update_option( 'wpseo', $options );
		}
	}
}

if ( !isset( $options['theme_check']['description'] ) ) {
	if ( file_exists( TEMPLATEPATH . '/header.php' ) ) {
		$header_file = file_get_contents( TEMPLATEPATH . '/header.php' );
		$issue       = preg_match_all( '#<\s*meta\s*(name|content)\s*=\s*("|\')(.*)("|\')\s*(name|content)\s*=\s*("|\')(.*)("|\')(\s+)?/?>#i', $header_file, $matches, PREG_SET_ORDER );
		if ( !$issue ) {
			$options['theme_check']['description'] = true;
		} else {
			foreach ( $matches as $meta ) {
				if ( ( strtolower( $meta[1] ) == 'name' && strtolower( $meta[3] ) == 'description' ) || ( strtolower( $meta[5] ) == 'name' && strtolower( $meta[7] ) == 'description' ) ) {
					$options['theme_check']['description_found'] = $meta[0];
				}
			}
		}
		update_option( 'wpseo', $options );
	}

	if ( isset( $options['theme_check'] ) && isset( $options['theme_check']['description_found'] ) && $options['theme_check']['description_found'] ) {
		echo '<p id="metadesc_found notice" class="wrong settings_error">'
			. '<a href="' . admin_url( 'admin.php?page=wpseo_dashboard&fixmetadesc&nonce=' . wp_create_nonce( 'wpseo-fix-metadesc' ) ) . '" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
			. __( 'Your theme contains a meta description, which blocks WordPress SEO from working properly, please delete the following line, or press fix it:', 'wordpress-seo' ) . '<br />';
		echo '<code>' . htmlentities( $options['theme_check']['description_found'] ) . '</code>';
		echo '</p>';
	}
}

if ( strpos( get_option( 'permalink_structure' ), '%postname%' ) === false && !isset( $options['ignore_permalink'] ) )
	echo '<p id="wrong_permalink" class="wrong">'
		. '<a href="' . admin_url( 'options-permalink.php' ) . '" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. '<a href="javascript:wpseo_setIgnore(\'permalink\',\'wrong_permalink\',\'' . wp_create_nonce( 'wpseo-ignore' ) . '\');" class="button fixit">' . __( 'Ignore.', 'wordpress-seo' ) . '</a>'
		. __( 'You do not have your postname in the URL of your posts and pages, it is highly recommended that you do. Consider setting your permalink structure to <strong>/%postname%/</strong>.', 'wordpress-seo' ) . '</p>';

if ( get_option( 'page_comments' ) && !isset( $options['ignore_page_comments'] ) )
	echo '<p id="wrong_page_comments" class="wrong">'
		. '<a href="javascript:setWPOption(\'page_comments\',\'0\',\'wrong_page_comments\',\'' . wp_create_nonce( 'wpseo-setoption' ) . '\');" class="button fixit">' . __( 'Fix it.', 'wordpress-seo' ) . '</a>'
		. '<a href="javascript:wpseo_setIgnore(\'page_comments\',\'wrong_page_comments\',\'' . wp_create_nonce( 'wpseo-ignore' ) . '\');" class="button fixit">' . __( 'Ignore.', 'wordpress-seo' ) . '</a>'
		. __( 'Paging comments is enabled, this is not needed in 999 out of 1000 cases, so the suggestion is to disable it, to do that, simply uncheck the box before "Break comments into pages..."', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'General', 'wordpress-seo' ) . '</h2>';

if ( isset( $options['ignore_tour'] ) && $options['ignore_tour'] ) {
	echo '<label class="select">' . __( 'Introduction Tour:', 'wordpress-seo' ) . '</label><a class="button-secondary" href="' . admin_url( 'admin.php?page=wpseo_dashboard&wpseo_restart_tour' ) . '">' . __( 'Start Tour', 'wordpress-seo' ) . '</a>';
	echo '<p class="desc label">' . __( 'Take this tour to quickly learn about the use of this plugin.', 'wordpress-seo' ) . '</p>';
}

echo '<label class="select">' . __( 'Default Settings:', 'wordpress-seo' ) . '</label><a class="button-secondary" href="' . admin_url( 'admin.php?page=wpseo_dashboard&wpseo_reset_defaults&nonce='. wp_create_nonce('wpseo_reset_defaults') ) . '">' . __( 'Reset Default Settings', 'wordpress-seo' ) . '</a>';
echo '<p class="desc label">' . __( 'If you want to restore a site to the default WordPress SEO settings, press this button.', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Tracking', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'yoast_tracking', __( 'Allow tracking of this WordPress installs anonymous data.', 'wordpress-seo' ) );
echo '<p class="desc">' . __( "To maintain a plugin as big as WordPress SEO, we need to know what we're dealing: what kinds of other plugins our users are using, what themes, etc. Please allow us to track that data from your install. It will not track <em>any</em> user details, so your security and privacy are safe with us.", 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Security', 'wordpress-seo' ) . '</h2>';
echo $wpseo_admin_pages->checkbox( 'disableadvanced_meta', __( 'Disable the Advanced part of the WordPress SEO meta box', 'wordpress-seo' ) );
echo '<p class="desc">' . __( 'Unchecking this box allows authors and editors to redirect posts, noindex them and do other things you might not want if you don\'t trust your authors.', 'wordpress-seo' ) . '</p>';

echo '<h2>' . __( 'Webmaster Tools', 'wordpress-seo' ) . '</h2>';
echo '<p>' . __( 'You can use the boxes below to verify with the different Webmaster Tools, if your site is already verified, you can just forget about these. Enter the verify meta values for:', 'wordpress-seo' ) . '</p>';
echo $wpseo_admin_pages->textinput( 'googleverify', '<a target="_blank" href="https://www.google.com/webmasters/tools/dashboard?hl=en&amp;siteUrl=' . urlencode( get_bloginfo( 'url' ) ) . '%2F">' . __( 'Google Webmaster Tools', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'msverify', '<a target="_blank" href="http://www.bing.com/webmaster/?rfp=1#/Dashboard/?url=' . str_replace( 'http://', '', get_bloginfo( 'url' ) ) . '">' . __( 'Bing Webmaster Tools', 'wordpress-seo' ) . '</a>' );
echo $wpseo_admin_pages->textinput( 'alexaverify', '<a target="_blank" href="http://www.alexa.com/pro/subscription">' . __( 'Alexa Verification ID', 'wordpress-seo' ) . '</a>' );

do_action( 'wpseo_dashboard' );

$wpseo_admin_pages->admin_footer();