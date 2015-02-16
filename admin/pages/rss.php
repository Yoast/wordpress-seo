<?php
/**
 * @package    WPSEO
 * @subpackage Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;

$options = WPSEO_Options::get_all();
$wpseo_admin_pages->admin_header( true, WPSEO_Options::get_group_name( 'wpseo_rss' ), 'wpseo_rss' );

$content = '<p>' . __( "This feature is used to automatically add content to your RSS, more specifically, it's meant to add links back to your blog and your blog posts, so dumb scrapers will automatically add these links too, helping search engines identify you as the original source of the content.", 'wordpress-seo' ) . '</p>';
$rows    = array();

$rows[] = array(
	'id'      => 'rssbefore',
	'label'   => __( 'Content to put before each post in the feed', 'wordpress-seo' ),
	'desc'    => __( '(HTML allowed)', 'wordpress-seo' ),
	'content' => '<textarea cols="50" rows="5" id="rssbefore" name="wpseo_rss[rssbefore]">' . esc_textarea( $options['rssbefore'] ) . '</textarea>',
);
$rows[] = array(
	'id'      => 'rssafter',
	'label'   => __( 'Content to put after each post in the feed', 'wordpress-seo' ),
	'desc'    => __( '(HTML allowed)', 'wordpress-seo' ),
	'content' => '<textarea cols="50" rows="5" id="rssafter" name="wpseo_rss[rssafter]">' . esc_textarea( $options['rssafter'] ) . '</textarea>',
);
$rows[] = array(
	'label'   => __( 'Explanation', 'wordpress-seo' ),
	'content' => '<p>' . __( 'You can use the following variables within the content, they will be replaced by the value on the right.', 'wordpress-seo' ) . '</p>' .
		'<table>' .
		'<tr><th><strong>%%AUTHORLINK%%</strong></th><td>' . __( 'A link to the archive for the post author, with the authors name as anchor text.', 'wordpress-seo' ) . '</td></tr>' .
		'<tr><th><strong>%%POSTLINK%%</strong></th><td>' . __( 'A link to the post, with the title as anchor text.', 'wordpress-seo' ) . '</td></tr>' .
		'<tr><th><strong>%%BLOGLINK%%</strong></th><td>' . __( "A link to your site, with your site's name as anchor text.", 'wordpress-seo' ) . '</td></tr>' .
		'<tr><th><strong>%%BLOGDESCLINK%%</strong></th><td>' . __( "A link to your site, with your site's name and description as anchor text.", 'wordpress-seo' ) . '</td></tr>' .
		'</table>'
);
$wpseo_admin_pages->postbox( 'rssfootercontent', __( 'Content of your RSS Feed', 'wordpress-seo' ), $content . $wpseo_admin_pages->form_table( $rows ) );

$wpseo_admin_pages->admin_footer();
