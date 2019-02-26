<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Taxonomies
 *
 * @uses Yoast_Form $yform Form object.
 */

$remove_buttons = array( __( 'Keep', 'wordpress-seo' ), __( 'Remove', 'wordpress-seo' ) );

$stripcategorybase_help = new WPSEO_Admin_Help_Panel(
	'opengraph',
	esc_html__( 'Help on the category prefix setting', 'wordpress-seo' ),
	sprintf(
		/* translators: %s expands to <code>/category/</code> */
		esc_html__( 'Category URLs in WordPress contain a prefix, usually %s, this feature removes that prefix, for categories only.', 'wordpress-seo' ),
		'<code>/category/</code>'
	)
);

$yform->light_switch(
	'stripcategorybase',
	__( 'Remove the categories prefix', 'wordpress-seo' ),
	$remove_buttons,
	false,
	$stripcategorybase_help->get_button_html() . $stripcategorybase_help->get_panel_html()
);
