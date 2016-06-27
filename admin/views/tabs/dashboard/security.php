<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Security setting', 'wordpress-seo' ) . '</h2>';

$yform->toggle_switch(
	'disableadvanced_meta',
	array( 'off' => __( 'Enabled', 'wordpress-seo' ), 'on' => __( 'Disabled', 'wordpress-seo' ) ),
	/* translators: %1$s expands to Yoast SEO */
	sprintf( __( 'Advanced part of the %1$s meta box', 'wordpress-seo' ), 'Yoast SEO' )
);

/* translators: %1$s expands to Yoast SEO */
echo '<p>', sprintf( __( 'The advanced section of the %1$s meta box allows a user to noindex posts or change the canonical. These are things you might not want if you don\'t trust your authors, so by default, only administrators can do this. Enabling the advanced box allows all users to change these settings.', 'wordpress-seo' ), 'Yoast SEO' ), '</p>';
