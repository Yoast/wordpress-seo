<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

// To improve readability, this tab has been divided into separate blocks, included below.
require dirname( __FILE__ ) . '/archives/help.php';

$view_files = array(
	esc_html__( 'Author archives settings', 'wordpress-seo' ) => dirname( __FILE__ ) . '/archives/author-archive-settings.php',
	esc_html__( 'Date archives settings', 'wordpress-seo' ) => dirname( __FILE__ ) . '/archives/date-archives-settings.php',
	esc_html__( 'Special Pages', 'wordpress-seo' ) => dirname( __FILE__ ) . '/archives/special-pages.php',
);
foreach ( $view_files as $title => $view_file ) {
	$presenter = new WPSEO_Paper_Presenter(
		$title,
		$view_file,
		array( 'collapsible' => true, 'expanded' => true )
	);

	echo $presenter->render();
}
