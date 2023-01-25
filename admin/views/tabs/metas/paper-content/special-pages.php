<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Archive
 *
 * @uses Yoast_Form $yform Form object.
 */

$special_pages_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-special-pages',
	__( 'Learn more about the special pages setting', 'wordpress-seo' ),
	sprintf(
		/* translators: %s expands to <code>noindex, follow</code>. */
		__( 'These pages will be %s by default, so they will never show up in search results.', 'wordpress-seo' ),
		'<code>noindex, follow</code>'
	),
	'has-wrapper'
);

$editor = new WPSEO_Replacevar_Field( $yform, 'title-search-wpseo', __( 'Search pages', 'wordpress-seo' ), 'search', 'search' );
$editor->render();

echo '<br/>';

$editor = new WPSEO_Replacevar_Field( $yform, 'title-404-wpseo', __( '404 pages', 'wordpress-seo' ), '404', '404' );
$editor->render();
