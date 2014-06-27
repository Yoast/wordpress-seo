<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;

$robots_file    = get_home_path() . 'robots.txt';
$ht_access_file = get_home_path() . '.htaccess';

if ( isset( $_POST['create_robots'] ) ) {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( __( 'You cannot create a robots.txt file.', 'wordpress-seo' ) );
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
	if ( ! current_user_can( 'manage_options' ) ) {
		die( __( 'You cannot edit the robots.txt file.', 'wordpress-seo' ) );
	}

	check_admin_referer( 'wpseo-robotstxt' );

	if ( file_exists( $robots_file ) ) {
		$robotsnew = stripslashes( $_POST['robotsnew'] );
		if ( is_writable( $robots_file ) ) {
			$f = fopen( $robots_file, 'w+' );
			fwrite( $f, $robotsnew );
			fclose( $f );
			$msg = __( 'Updated Robots.txt', 'wordpress-seo' );
		}
	}
}

if ( isset( $_POST['submithtaccess'] ) ) {
	if ( ! current_user_can( 'manage_options' ) ) {
		die( __( 'You cannot edit the .htaccess file.', 'wordpress-seo' ) );
	}

	check_admin_referer( 'wpseo-htaccess' );

	if ( file_exists( $ht_access_file ) ) {
		$ht_access_new   = stripslashes( $_POST['htaccessnew'] );
		if ( is_writeable( $ht_access_file ) ) {
			$f = fopen( $ht_access_file, 'w+' );
			fwrite( $f, $ht_access_new );
			fclose( $f );
		}
	}
}

$wpseo_admin_pages->admin_header( false );
if ( isset( $msg ) && ! empty( $msg ) ) {
	echo '<div id="message" style="width:94%;" class="updated fade"><p>' . esc_html( $msg ) . '</p></div>';
}


if ( ! file_exists( $robots_file ) ) {
	if ( is_writable( get_home_path() ) ) {
		$content = '<form action="' . admin_url( 'admin.php?page=wpseo_files' ) . '" method="post" id="robotstxtcreateform">';
		$content .= wp_nonce_field( 'wpseo_create_robots', '_wpnonce', true, false );
		$content .= '<p>' . __( 'You don\'t have a robots.txt file, create one here:', 'wordpress-seo' ) . '</p>';
		$content .= '<input type="submit" class="button" name="create_robots" value="' . __( 'Create robots.txt file', 'wordpress-seo' ) . '">';
		$content .= '</form>';
	}
	else {
		$content = '<p>' . __( 'If you had a robots.txt file and it was editable, you could edit it from here.', 'wordpress-seo' );
	}
}
else {
	$f = fopen( $robots_file, 'r' );

	$content = '';
	if ( filesize( $robots_file ) > 0 ) {
		$content = fread( $f, filesize( $robots_file ) );
	}
	$robots_txt_content = esc_textarea( $content );

	if ( ! is_writable( $robots_file ) ) {
		$content = '<p><em>' . __( 'If your robots.txt were writable, you could edit it from here.', 'wordpress-seo' ) . '</em></p>';
		$content .= '<textarea class="large-text code" disabled="disabled" rows="15" name="robotsnew">' . $robots_txt_content . '</textarea><br/>';
	} else {
		$content = '<form action="' . admin_url( 'admin.php?page=wpseo_files' ) . '" method="post" id="robotstxtform">';
		$content .= wp_nonce_field( 'wpseo-robotstxt', '_wpnonce', true, false );
		$content .= '<p>' . __( 'Edit the content of your robots.txt:', 'wordpress-seo' ) . '</p>';
		$content .= '<textarea class="large-text code" rows="15" name="robotsnew">' . $robots_txt_content . '</textarea><br/>';
		$content .= '<div class="submit"><input class="button" type="submit" name="submitrobots" value="' . __( 'Save changes to Robots.txt', 'wordpress-seo' ) . '" /></div>';
		$content .= '</form>';
	}
}

$wpseo_admin_pages->postbox( 'robotstxt', __( 'Robots.txt', 'wordpress-seo' ), $content );

if ( ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'nginx' ) === false ) && file_exists( $ht_access_file ) ) {
	$f         = fopen( $ht_access_file, 'r' );

	$contentht = '';
	if ( filesize( $ht_access_file ) > 0 ) {
		$contentht = fread( $f, filesize( $ht_access_file ) );
	}
	$contentht = esc_textarea( $contentht );

	if ( ! is_writable( $ht_access_file ) ) {
		$content = '<p><em>' . __( 'If your .htaccess were writable, you could edit it from here.', 'wordpress-seo' ) . '</em></p>';
		$content .= '<textarea class="large-text code" disabled="disabled" rows="15" name="robotsnew">' . $contentht . '</textarea><br/>';
	} else {
		$content = '<form action="' . admin_url( 'admin.php?page=wpseo_files' ) . '" method="post" id="htaccessform">';
		$content .= wp_nonce_field( 'wpseo-htaccess', '_wpnonce', true, false );
		$content .= '<p>' . __( 'Edit the content of your .htaccess:', 'wordpress-seo' ) . '</p>';
		$content .= '<textarea class="large-text code" rows="15" name="htaccessnew">' . $contentht . '</textarea><br/>';
		$content .= '<div class="submit"><input class="button" type="submit" name="submithtaccess" value="' . __( 'Save changes to .htaccess', 'wordpress-seo' ) . '" /></div>';
		$content .= '</form>';
	}
	$wpseo_admin_pages->postbox( 'htaccess', __( '.htaccess file', 'wordpress-seo' ), $content );
} elseif ( ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'nginx' ) === false ) && ! file_exists( $ht_access_file ) ) {
	$content = '<p>' . __( 'If you had a .htaccess file and it was editable, you could edit it from here.', 'wordpress-seo' );
	$wpseo_admin_pages->postbox( 'htaccess', __( '.htaccess file', 'wordpress-seo' ), $content );
}

$wpseo_admin_pages->admin_footer( false );