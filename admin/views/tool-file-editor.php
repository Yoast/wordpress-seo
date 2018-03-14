<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$robots_file    = get_home_path() . 'robots.txt';
$ht_access_file = get_home_path() . '.htaccess';

if ( isset( $_POST['create_robots'] ) ) {
	if ( ! current_user_can( 'edit_files' ) ) {
		$die_msg = sprintf(
			/* translators: %s expands to robots.txt. */
			__( 'You cannot create a %s file.', 'wordpress-seo' ),
			'robots.txt'
		);
		die( esc_html( $die_msg ) );
	}

	check_admin_referer( 'wpseo_create_robots' );

	ob_start();
	error_reporting( 0 );
	do_robots();
	$robots_content = ob_get_clean();

	$f = fopen( $robots_file, 'x' );
	fwrite( $f, $robots_content );
}

if ( isset( $_POST['submitrobots'] ) ) {
	if ( ! current_user_can( 'edit_files' ) ) {
		$die_msg = sprintf(
			/* translators: %s expands to robots.txt. */
			__( 'You cannot edit the %s file.', 'wordpress-seo' ),
			'robots.txt'
		);
		die( esc_html( $die_msg ) );
	}

	check_admin_referer( 'wpseo-robotstxt' );

	if ( file_exists( $robots_file ) ) {
		$robotsnew = stripslashes( $_POST['robotsnew'] );
		if ( is_writable( $robots_file ) ) {
			$f = fopen( $robots_file, 'w+' );
			fwrite( $f, $robotsnew );
			fclose( $f );
			$msg = sprintf(
				/* translators: %s expands to robots.txt. */
				__( 'Updated %s', 'wordpress-seo' ),
				'robots.txt'
			);
		}
	}
}

if ( isset( $_POST['submithtaccess'] ) ) {
	if ( ! current_user_can( 'edit_files' ) ) {
		$die_msg = sprintf(
			/* translators: %s expands to ".htaccess". */
			__( 'You cannot edit the %s file.', 'wordpress-seo' ),
			'.htaccess'
		);
		die( esc_html( $die_msg ) );
	}

	check_admin_referer( 'wpseo-htaccess' );

	if ( file_exists( $ht_access_file ) ) {
		$ht_access_new = stripslashes( $_POST['htaccessnew'] );
		if ( is_writeable( $ht_access_file ) ) {
			$f = fopen( $ht_access_file, 'w+' );
			fwrite( $f, $ht_access_new );
			fclose( $f );
		}
	}
}

if ( isset( $msg ) && ! empty( $msg ) ) {
	echo '<div id="message" class="updated fade"><p>', esc_html( $msg ), '</p></div>';
}

if ( is_multisite() ) {
	$action_url = network_admin_url( 'admin.php?page=wpseo_files' );
}
else {
	$action_url = admin_url( 'admin.php?page=wpseo_tools&tool=file-editor' );
}

echo '<br><br>';
$helpcenter_tab = new WPSEO_Option_Tab( 'bulk-editor', __( 'Bulk editor', 'wordpress-seo' ),
	array( 'video_url' => WPSEO_Shortlinker::get( 'https://yoa.st/screencast-tools-file-editor' ) ) );

$helpcenter = new WPSEO_Help_Center( 'bulk-editor', $helpcenter_tab, WPSEO_Utils::is_yoast_seo_premium() );
$helpcenter->localize_data();
$helpcenter->mount();

// N.B.: "robots.txt" is a fixed file name and should not be translatable.
echo '<h2>robots.txt</h2>';


if ( ! file_exists( $robots_file ) ) {
	if ( is_writable( get_home_path() ) ) {
		echo '<form action="', esc_url( $action_url ), '" method="post" id="robotstxtcreateform">';
		wp_nonce_field( 'wpseo_create_robots', '_wpnonce', true, true );
		echo '<p>';
		printf(
			/* translators: %s expands to robots.txt. */
			esc_html__( 'You don\'t have a %s file, create one here:', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</p>';

		printf(
			'<input type="submit" class="button" name="create_robots" value="%s">',
			sprintf(
				/* translators: %s expands to robots.txt. */
				esc_attr__( 'Create %s file', 'wordpress-seo' ),
				'robots.txt'
			)
		);
		echo '</form>';
	}
	else {
		echo '<p>';
		printf(
			/* translators: %s expands to robots.txt. */
			esc_html__( 'If you had a %s file and it was editable, you could edit it from here.', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</p>';
	}
}
else {
	$f = fopen( $robots_file, 'r' );

	$content = '';
	if ( filesize( $robots_file ) > 0 ) {
		$content = fread( $f, filesize( $robots_file ) );
	}

	if ( ! is_writable( $robots_file ) ) {
		echo '<p><em>';
		printf(
			/* translators: %s expands to robots.txt. */
			esc_html__( 'If your %s were writable, you could edit it from here.', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</em></p>';
		echo '<textarea class="large-text code" disabled="disabled" rows="15" name="robotsnew">', esc_textarea( $content ), '</textarea><br/>';
	}
	else {
		echo '<form action="', esc_url( $action_url ), '" method="post" id="robotstxtform">';
		wp_nonce_field( 'wpseo-robotstxt', '_wpnonce', true, true );
		echo '<p><label for="robotsnew" class="yoast-inline-label">';
		printf(
			/* translators: %s expands to robots.txt. */
			esc_html__( 'Edit the content of your %s:', 'wordpress-seo' ),
			'robots.txt'
		);
		echo '</label></p>';
		echo '<textarea class="large-text code" rows="15" name="robotsnew" id="robotsnew">', esc_textarea( $content ), '</textarea><br/>';
		printf(
			'<div class="submit"><input class="button" type="submit" name="submitrobots" value="%s" /></div>',
			sprintf(
				/* translators: %s expands to robots.txt. */
				esc_attr__( 'Save changes to %s', 'wordpress-seo' ),
				'robots.txt'
			)
		);
		echo '</form>';
	}
}
if ( ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'nginx' ) === false ) ) {

	echo '<h2>';
	printf(
		/* translators: %s expands to ".htaccess". */
		esc_html__( '%s file', 'wordpress-seo' ),
		'.htaccess'
	);
	echo '</h2>';

	if ( file_exists( $ht_access_file ) ) {
		$f = fopen( $ht_access_file, 'r' );

		$contentht = '';
		if ( filesize( $ht_access_file ) > 0 ) {
			$contentht = fread( $f, filesize( $ht_access_file ) );
		}

		if ( ! is_writable( $ht_access_file ) ) {
			echo '<p><em>';
			printf(
				/* translators: %s expands to ".htaccess". */
				esc_html__( 'If your %s were writable, you could edit it from here.', 'wordpress-seo' ),
				'.htaccess'
			);
			echo '</em></p>';
			echo '<textarea class="large-text code" disabled="disabled" rows="15" name="robotsnew">', esc_textarea( $contentht ), '</textarea><br/>';
		}
		else {
			echo '<form action="', esc_url( $action_url ), '" method="post" id="htaccessform">';
			wp_nonce_field( 'wpseo-htaccess', '_wpnonce', true, true );
			echo '<p><label for="htaccessnew" class="yoast-inline-label">';
			printf(
				/* translators: %s expands to ".htaccess". */
				esc_html__( 'Edit the content of your %s:', 'wordpress-seo' ),
				'.htaccess'
			);
			echo '</label></p>';
			echo '<textarea class="large-text code" rows="15" name="htaccessnew" id="htaccessnew">', esc_textarea( $contentht ), '</textarea><br/>';
			printf(
				'<div class="submit"><input class="button" type="submit" name="submithtaccess" value="%s" /></div>',
				sprintf(
					/* translators: %s expands to ".htaccess". */
					esc_attr__( 'Save changes to %s', 'wordpress-seo' ),
					'.htaccess'
				)
			);
			echo '</form>';
		}
	}
	else {
		echo '<p>';
		printf(
			/* translators: %s expands to ".htaccess". */
			esc_html__( 'If you had a %s file and it was editable, you could edit it from here.', 'wordpress-seo' ),
			'.htaccess'
		);
		echo '</p>';
	}
}
