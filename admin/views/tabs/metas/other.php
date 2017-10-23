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
echo '<p>', __( 'If you want to prevent /page/2/ and further of any archive to show up in the search results, set this to "noindex".', 'wordpress-seo' ), '</p>';

$yform->light_switch( 'usemetakeywords', __( 'Use meta keywords tag?', 'wordpress-seo' ) );
echo '<p>', __( 'I don\'t know why you\'d want to use meta keywords, but if you want to, enable this.', 'wordpress-seo' ), '</p>';

/**
 * Genesis settings
 */
if ( 'genesis' === get_template() ) {

	echo '<h2>', esc_html__( 'Genesis Framework', 'wordpress-seo' ), '</h2>';

	$yform->select( 'genesis-element-title', __( 'Site title element', 'wordpress-seo' ), array(
		''     => __( 'Genesis default', 'wordpress-seo' ),
		'h1'   => 'H1',
		'h2'   => 'H2',
		'h3'   => 'H3',
		'h4'   => 'H4',
		'div'  => 'DIV',
		'p'    => 'P',
		'span' => 'SPAN',
	) );

	$yform->select( 'genesis-element-description', __( 'Site description element', 'wordpress-seo' ), array(
		''     => __( 'Genesis default', 'wordpress-seo' ),
		'h1'   => 'H1',
		'h2'   => 'H2',
		'h3'   => 'H3',
		'h4'   => 'H4',
		'div'  => 'DIV',
		'p'    => 'P',
		'span' => 'SPAN',
	) );
}
