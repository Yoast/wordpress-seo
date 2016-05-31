<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( filter_input( INPUT_GET, 'intro' ) ) {

	update_user_meta( get_current_user_id(), 'wpseo_seen_about_version', WPSEO_VERSION );
	require WPSEO_PATH . 'admin/views/about.php';

	return;
}

$options = get_option( 'wpseo' );

if ( isset( $_GET['allow_tracking'] ) && check_admin_referer( 'wpseo_activate_tracking', 'nonce' ) ) {
	$options['yoast_tracking'] = ( $_GET['allow_tracking'] == 'yes' );
	update_option( 'wpseo', $options );

	if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
		wp_safe_redirect( $_SERVER['HTTP_REFERER'], 307 );
		exit;
	}
}


// Fix metadescription if so requested.
if ( isset( $_GET['fixmetadesc'] ) && check_admin_referer( 'wpseo-fix-metadesc', 'nonce' ) && $options['theme_description_found'] !== '' ) {
	$path = false;
	if ( file_exists( get_stylesheet_directory() . '/header.php' ) ) {
		// Theme or child theme.
		$path = get_stylesheet_directory();
	}
	elseif ( file_exists( get_template_directory() . '/header.php' ) ) {
		// Parent theme in case of a child theme.
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
				else {
					wpseo_description_test();
					$msg .= '<span class="warning">' . __( 'Earlier found meta description was not found in file. Renewed the description test data.', 'wordpress-seo' ) . '</span>';
				}
				add_settings_error( 'yoast_wpseo_dashboard_options', 'error', $msg, 'updated' );
			}
		}
	}

	// Clean up the referrer url for later use.
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg( array( 'nonce', 'fixmetadesc' ), $_SERVER['REQUEST_URI'] );
	}
}

if ( ( ! isset( $options['theme_has_description'] ) || ( ( isset( $options['theme_has_description'] ) && $options['theme_has_description'] === true ) || $options['theme_description_found'] !== '' ) ) || ( isset( $_GET['checkmetadesc'] ) && check_admin_referer( 'wpseo-check-metadesc', 'nonce' ) ) ) {
	wpseo_description_test();
	// Renew the options after the test.
	$options = get_option( 'wpseo' );
}
if ( isset( $_GET['checkmetadesc'] ) ) {
	// Clean up the referrer url for later use.
	if ( isset( $_SERVER['REQUEST_URI'] ) ) {
		$_SERVER['REQUEST_URI'] = remove_query_arg( array( 'nonce', 'checkmetadesc' ), $_SERVER['REQUEST_URI'] );
	}
}
$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo' );

do_action( 'wpseo_all_admin_notices' );

if ( is_array( $options['blocking_files'] ) && count( $options['blocking_files'] ) > 0 ) {

	$xml_sitemap_options = WPSEO_Options::get_option( 'wpseo_xml' );
	if ( $xml_sitemap_options['enablexmlsitemap'] ) {

		echo '<p id="blocking_files" class="wrong">';
		echo '<a href="javascript:wpseoKillBlockingFiles(\'', esc_js( wp_create_nonce( 'wpseo-blocking-files' ) ), '\')" class="button fixit">', __( 'Fix it.', 'wordpress-seo' ), '</a>';
		echo __( 'The following file(s) is/are blocking your XML sitemaps from working properly:', 'wordpress-seo' ), '<br />';
		foreach ( $options['blocking_files'] as $file ) {
			echo esc_html( $file ), '<br/>';
		}
		unset( $file );

		/* translators: %1$s expands to Yoast SEO */
		echo '
			', sprintf( __( 'Either delete them (this can be done with the "Fix it" button) or disable %1$s XML sitemaps.', 'wordpress-seo' ), 'Yoast SEO' ), '
		</p>';
	}
}

if ( $options['theme_description_found'] !== '' ) {
	echo '<p id="metadesc_found notice" class="wrong settings_error">';
	echo '<a href="', esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo-fix-metadesc' ) ), admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER . '&fixmetadesc' ) ) ), '" class="button fixit">', __( 'Fix it.', 'wordpress-seo' ), '</a>';
	echo ' <a href="', esc_url( add_query_arg( array( 'nonce' => wp_create_nonce( 'wpseo-check-metadesc' ) ), admin_url( 'admin.php?page=' . WPSEO_Admin::PAGE_IDENTIFIER . '&checkmetadesc' ) ) ), '" class="button checkit">', __( 'Re-check theme.', 'wordpress-seo' ), '</a>';
	/* translators: %1$s expands to Yoast SEO */
	echo sprintf( __( 'Your theme contains a meta description, which blocks %1$s from working properly, please delete the following line, or press fix it:', 'wordpress-seo' ), 'Yoast SEO' ) . '<br />';
	echo '<code>', esc_html( $options['theme_description_found'] ), '</code>';
	echo '</p>';
}


if ( strpos( get_option( 'permalink_structure' ), '%postname%' ) === false && $options['ignore_permalink'] === false ) {
	echo '<p id="wrong_permalink" class="wrong">';
	echo '<a href="', esc_url( admin_url( 'options-permalink.php' ) ), '" class="button fixit">', __( 'Fix it.', 'wordpress-seo' ), '</a>';
	echo '<a href="javascript:wpseoSetIgnore(\'permalink\',\'wrong_permalink\',\'', esc_js( wp_create_nonce( 'wpseo-ignore' ) ), '\');" class="button fixit">', __( 'Ignore.', 'wordpress-seo' ), '</a>';
	echo __( 'You do not have your postname in the URL of your posts and pages, it is highly recommended that you do. Consider setting your permalink structure to <strong>/%postname%/</strong>.', 'wordpress-seo' ), '</p>';
}

if ( get_option( 'page_comments' ) && $options['ignore_page_comments'] === false ) {
	echo '<p id="wrong_page_comments" class="wrong">';
	echo '<a href="javascript:setWPOption(\'page_comments\',\'0\',\'wrong_page_comments\',\'', esc_js( wp_create_nonce( 'wpseo-setoption' ) ), '\');" class="button fixit">', __( 'Fix it.', 'wordpress-seo' ), '</a>';
	echo '<a href="javascript:wpseoSetIgnore(\'page_comments\',\'wrong_page_comments\',\'', esc_js( wp_create_nonce( 'wpseo-ignore' ) ), '\');" class="button fixit">', __( 'Ignore.', 'wordpress-seo' ), '</a>';
	echo __( 'Paging comments is enabled, this is not needed in 999 out of 1000 cases, so the suggestion is to disable it, to do that, simply uncheck the box before "Break comments into pages..."', 'wordpress-seo' ), '</p>';
}

$tabs = array(
	'dashboard'       => array(
		'label' => __( 'Dashboard', 'wordpress-seo' ),
	),
	'general'         => array(
		'label'                => __( 'General', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-general',
	),
	'knowledge-graph' => array(
		'label'                => ( 'company' === $options['company_or_person'] ) ? __( 'Company Info', 'wordpress-seo' ) : __( 'Your Info', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-knowledge-graph',
	),
	'webmaster-tools' => array(
		'label'                => __( 'Webmaster Tools', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-general-search-console',
	),
	'security'        => array(
		'label'                => __( 'Security', 'wordpress-seo' ),
		'screencast_video_url' => 'https://yoa.st/screencast-security',
	),
);

?>
	<h2 class="nav-tab-wrapper" id="wpseo-tabs">
		<?php foreach ( $tabs as $identifier => $tab ) : ?>
		<a class="nav-tab" id="<?php echo $identifier; ?>-tab" href="#top#<?php echo $identifier; ?>"><?php echo $tab['label']; ?></a>
		<?php endforeach; ?>
	</h2>

<?php

foreach ( $tabs as $identifier => $tab ) {

	printf( '<div id="%s" class="wpseotab">', $identifier );

	if ( ! empty( $tab['screencast_video_url'] ) ) {
		$tab_video_url = $tab['screencast_video_url'];
		include WPSEO_PATH . 'admin/views/partial-settings-tab-video.php';
	}

	require_once WPSEO_PATH . 'admin/views/tabs/dashboard/' . $identifier . '.php';

	echo '</div>';
}

do_action( 'wpseo_dashboard' );

$yform->admin_footer();
