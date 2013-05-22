<?php
/**
 * @package Admin
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

global $wpseo_admin_pages;

if ( isset( $_POST[ 'submitrobots' ] ) ) {
	if ( !current_user_can( 'manage_options' ) ) die( __( 'You cannot edit the robots.txt file.', 'wordpress-seo' ) );

	check_admin_referer( 'wpseo-robotstxt' );

	if ( file_exists( get_home_path() . "robots.txt" ) ) {
		$robots_file = get_home_path() . "robots.txt";
		$robotsnew   = stripslashes( $_POST[ 'robotsnew' ] );
		if ( is_writable( $robots_file ) ) {
			$f = fopen( $robots_file, 'w+' );
			fwrite( $f, $robotsnew );
			fclose( $f );
			$msg = __( 'Updated Robots.txt', 'wordpress-seo' );
		}
	}
}

if ( isset( $_POST[ 'submithtaccess' ] ) ) {
	if ( !current_user_can( 'manage_options' ) ) die( __( 'You cannot edit the .htaccess file.', 'wordpress-seo' ) );

	check_admin_referer( 'wpseo-htaccess' );

	if ( file_exists( get_home_path() . ".htaccess" ) ) {
		$htaccess_file = get_home_path() . ".htaccess";
		$htaccessnew   = stripslashes( $_POST[ 'htaccessnew' ] );
		if ( is_writeable( $htaccess_file ) ) {
			$f = fopen( $htaccess_file, 'w+' );
			fwrite( $f, $htaccessnew );
			fclose( $f );
		}
	}
}

$wpseo_admin_pages->admin_header( __( 'Edit Files', 'wordpress-seo' ), false );
if ( isset( $msg ) && !empty( $msg ) ) {
	echo '<div id="message" style="width:94%;" class="updated fade"><p>' . esc_html( $msg ) . '</p></div>';
}

if ( file_exists( get_home_path() . "robots.txt" ) ) {
	$robots_file = get_home_path() . "robots.txt";
	$f           = fopen( $robots_file, 'r' );
	if ( filesize( $robots_file ) > 0 )
		$content = fread( $f, filesize( $robots_file ) );
	else
		$content = '';
	$robotstxtcontent = esc_textarea( $content );

	if ( !is_writable( $robots_file ) ) {
		$content = "<p><em>" . __( "If your robots.txt were writable, you could edit it from here.", 'wordpress-seo' ) . "</em></p>";
		$content .= '<textarea disabled="disabled" style="width: 90%;" rows="15" name="robotsnew">' . $robotstxtcontent . '</textarea><br/>';
	} else {
		$content = '<form action="" method="post" id="robotstxtform">';
		$content .= wp_nonce_field( 'wpseo-robotstxt', '_wpnonce', true, false );
		$content .= "<p>" . __( "Edit the content of your robots.txt:", 'wordpress-seo' ) . "</p>";
		$content .= '<textarea style="width: 90%;" rows="15" name="robotsnew">' . $robotstxtcontent . '</textarea><br/>';
		$content .= '<div class="submit"><input class="button" type="submit" name="submitrobots" value="' . __( "Save changes to Robots.txt", 'wordpress-seo' ) . '" /></div>';
		$content .= '</form>';
	}

} else {
	$content = '<p>'.__('If you had a robots.txt file and it was editable, you could edit it from here.','wordpress-seo');
}

$wpseo_admin_pages->postbox( 'robotstxt', __( 'Robots.txt', 'wordpress-seo' ), $content );

if ( (isset($_SERVER['SERVER_SOFTWARE']) && stristr($_SERVER['SERVER_SOFTWARE'], 'nginx') === false) && file_exists( get_home_path() . ".htaccess" ) ) {
	$htaccess_file = get_home_path() . "/.htaccess";
	$f             = fopen( $htaccess_file, 'r' );
	$contentht     = fread( $f, filesize( $htaccess_file ) );
	$contentht     = esc_textarea( $contentht );

	if ( !is_writable( $htaccess_file ) ) {
		$content = "<p><em>" . __( "If your .htaccess were writable, you could edit it from here.", 'wordpress-seo' ) . "</em></p>";
		$content .= '<textarea disabled="disabled" style="width: 90%;" rows="15" name="robotsnew">' . $contentht . '</textarea><br/>';
	} else {
		$content = '<form action="" method="post" id="htaccessform">';
		$content .= wp_nonce_field( 'wpseo-htaccess', '_wpnonce', true, false );
		$content .= "<p>" . __( 'Edit the content of your .htaccess:', 'wordpress-seo' ) . "</p>";
		$content .= '<textarea style="width: 90%;" rows="15" name="htaccessnew">' . $contentht . '</textarea><br/>';
		$content .= '<div class="submit"><input class="button" type="submit" name="submithtaccess" value="' . __( 'Save changes to .htaccess', 'wordpress-seo' ) . '" /></div>';
		$content .= '</form>';
	}
	$wpseo_admin_pages->postbox( 'htaccess', __( '.htaccess file', 'wordpress-seo' ), $content );
} else if ( (isset($_SERVER['SERVER_SOFTWARE']) && stristr($_SERVER['SERVER_SOFTWARE'], 'nginx') === false) && !file_exists( get_home_path() . ".htaccess" ) ) {
	$content = '<p>'.__('If you had a .htaccess file and it was editable, you could edit it from here.','wordpress-seo');
	$wpseo_admin_pages->postbox( 'htaccess', __( '.htaccess file', 'wordpress-seo' ), $content );
}

$wpseo_admin_pages->admin_footer( false );