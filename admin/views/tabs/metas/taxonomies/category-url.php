<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Taxonomies
 *
 * @uses Yoast_Form $yform Form object.
 */

$stripcategorybase_help = new WPSEO_Admin_Help_Button(
	'https://yoa.st/3yk',
	esc_html__( 'Help on the category prefix setting', 'wordpress-seo' )
);

$yform->light_switch(
	'stripcategorybase',
	__( 'Remove the categories prefix', 'wordpress-seo' ),
	[
		__( 'Keep', 'wordpress-seo' ),
		__( 'Remove', 'wordpress-seo' ),
	],
	$stripcategorybase_help,
	true
);
