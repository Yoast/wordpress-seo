<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform                = Yoast_Form::get_instance();
$yform->currentoption = 'wpseo_permalinks';

echo '<h2>', esc_html__( 'Change URLs', 'wordpress-seo' ), '</h2>';

$remove_buttons = array( __( 'Keep', 'wordpress-seo' ), __( 'Remove', 'wordpress-seo' ) );
$yform->light_switch(
	'stripcategorybase',
	/* translators: %s expands to <code>/category/</code> */
	sprintf( __( 'Strip the category base (usually %s) from the category URL.', 'wordpress-seo' ), '<code>/category/</code>' ),
	$remove_buttons,
	false
);
