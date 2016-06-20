<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( 'posts' == get_option( 'show_on_front' ) ) {
	echo '<div id="homepage-titles-metas">';
	echo '<h2>', esc_html__( 'Homepage', 'wordpress-seo' ), '</h2>';
	$yform->textinput( 'title-home-wpseo', __( 'Title template', 'wordpress-seo' ), 'template homepage-template' );
	$yform->textarea( 'metadesc-home-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template homepage-template' ) );
	if ( $options['usemetakeywords'] === true ) {
		$yform->textinput( 'metakey-home-wpseo', __( 'Meta keywords template', 'wordpress-seo' ) );
	}
	echo '</div>';
}
else {
	echo '<h2>', esc_html__( 'Homepage &amp; Front page', 'wordpress-seo' ), '</h2>';
	echo '<p>';
	printf( __( 'You can determine the title and description for the front page by %sediting the front page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . esc_url( get_edit_post_link( get_option( 'page_on_front' ) ) ) . '">', '</a>' );
	echo '</p>';
	if ( get_option( 'page_for_posts' ) > 0 ) {
		echo '<p>', sprintf( __( 'You can determine the title and description for the blog page by %sediting the blog page itself &raquo;%s', 'wordpress-seo' ), '<a href="' . esc_url( get_edit_post_link( get_option( 'page_for_posts' ) ) ) . '">', '</a>' ), '</p>';
	}
}
