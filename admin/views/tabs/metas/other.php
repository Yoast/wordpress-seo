<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>', esc_html__( 'Sitewide meta settings', 'wordpress-seo' ), '</h2>';

$yform->toggle_switch( 'noindex-subpages-wpseo', $index_switch_values, __( 'Subpages of archives', 'wordpress-seo' ) );
echo '<p>', esc_html__( 'If you want to prevent /page/2/ and further of any archive to show up in the search results, set this to "noindex".', 'wordpress-seo' ), '</p>';

