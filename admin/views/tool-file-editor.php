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

$yform          = Yoast_Form::get_instance();

$robots_file    = get_home_path() . 'robots.txt';
$robots_updated = false;

$ht_access_file   = get_home_path() . '.htaccess';
$htaccess_updated = false;

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

	if ( isset( $_POST['robotsnew'] ) && file_exists( $robots_file ) ) {
		$robotsnew = sanitize_textarea_field( wp_unslash( $_POST['robotsnew'] ) );
		if ( is_writable( $robots_file ) ) {
			$f = fopen( $robots_file, 'w+' );
			fwrite( $f, $robotsnew );
			fclose( $f );

			$msg = sprintf(
				/* translators: %s expands to robots.txt. */
				__( 'Updated %s', 'wordpress-seo' ),
				'robots.txt'
			);

			$robots_updated = true;
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

	if ( isset( $_POST['htaccessnew'] ) && file_exists( $ht_access_file ) ) {
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Writing to .htaccess file and escaping for HTML will break functionality.
		$ht_access_new = wp_unslash( $_POST['htaccessnew'] );
		if ( is_writable( $ht_access_file ) ) {
			$f = fopen( $ht_access_file, 'w+' );
			fwrite( $f, $ht_access_new );
			fclose( $f );

			$msg = sprintf(
			/* translators: %s expands to robots.txt. */
				__( 'Updated %s', 'wordpress-seo' ),
				'.htaccess'
			);

			$htaccess_updated = true;
		}
	}
}

if ( is_multisite() ) {
	$action_url = network_admin_url( 'admin.php?page=wpseo_files' );
	$yform->admin_header( false, 'wpseo_ms' );
}
else {
	$action_url = admin_url( 'admin.php?page=wpseo_tools&tool=file-editor' );
}

if ( isset( $msg ) && ! empty( $msg ) ) {
	echo '<div id="message" class="notice notice-success"><p>', esc_html( $msg ), '</p></div>';
}

$robots_collapsible = new WPSEO_Collapsible_Presenter(
	'robots.txt',
	WPSEO_PATH . 'admin/views/tabs/tool/file-editor-robots.php',
	[
		'expanded'  => $robots_updated,
		'view_data' => [
			'robots_file' => $robots_file,
			'action_url'  => $action_url,
		],
	]
);
echo $robots_collapsible->get_output();

if ( ! WPSEO_Utils::is_nginx() ) {

	$htaccess_collapsible = new WPSEO_Collapsible_Presenter(
		/* translators: %s expands to ".htaccess". */
		sprintf( esc_html__( '%s file', 'wordpress-seo' ), '.htaccess' ),
		WPSEO_PATH . 'admin/views/tabs/tool/file-editor-htaccess.php',
		[
			'expanded'  => $htaccess_updated,
			'view_data' => [
				'ht_access_file' => $ht_access_file,
				'action_url'     => $action_url,
			],
		]
	);
	echo $htaccess_collapsible->get_output();
}

if ( is_multisite() ) {
	$yform->admin_footer( false );
}
