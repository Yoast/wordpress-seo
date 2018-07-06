<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

// To improve readability, this tab has been divided into separate blocks, included below.
require dirname( __FILE__ ) . '/archives/help.php';

$wpseo_archives = array(
	array(
		'title'     => esc_html__( 'Author archives settings', 'wordpress-seo' ),
		'view_file' => 'paper-content/author-archive-settings.php',
	),
	array(
		'title'     => esc_html__( 'Date archives settings', 'wordpress-seo' ),
		'view_file' => 'paper-content/date-archives-settings.php',
	),
	array(
		'title'     => esc_html__( 'Special Pages', 'wordpress-seo' ),
		'view_file' => 'paper-content/special-pages.php',
	),
);
foreach ( $wpseo_archives as $wpseo_archive_index => $wpseo_archive ) {
	$wpseo_archive_presenter = new WPSEO_Paper_Presenter(
		$wpseo_archive['title'],
		dirname( __FILE__ ) . '/' . $wpseo_archive['view_file'],
		array(
			'collapsible' => true,
			'expanded'    => ( $wpseo_archive_index === 0 ),
		)
	);

	echo $wpseo_archive_presenter->get_output();
}

unset( $wpseo_archives, $wpseo_archive_presenter, $wpseo_archive_index );
