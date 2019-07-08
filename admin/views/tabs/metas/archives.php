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
		'paper_id'  => 'settings-author-archives',
	),
	array(
		'title'     => esc_html__( 'Date archives settings', 'wordpress-seo' ),
		'view_file' => 'paper-content/date-archives-settings.php',
		'paper_id'  => 'settings-date-archives',
	),
	array(
		'title'     => esc_html__( 'Special Pages', 'wordpress-seo' ),
		'view_file' => 'paper-content/special-pages.php',
		'paper_id'  => 'settings-special-pages',
	),
);

$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();

foreach ( $wpseo_archives as $wpseo_archive_index => $wpseo_archive ) {
	$wpseo_archive_presenter = new WPSEO_Paper_Presenter(
		$wpseo_archive['title'],
		dirname( __FILE__ ) . '/' . $wpseo_archive['view_file'],
		array(
			'collapsible'                  => true,
			'expanded'                     => ( $wpseo_archive_index === 0 ),
			'paper_id'                     => $wpseo_archive['paper_id'],
			'recommended_replace_vars'     => $recommended_replace_vars,
			'editor_specific_replace_vars' => $editor_specific_replace_vars,
		)
	);

	echo $wpseo_archive_presenter->get_output();
}

unset( $wpseo_archives, $wpseo_archive_presenter, $wpseo_archive_index );
