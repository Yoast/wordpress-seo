<?php
/**
 * @package Admin
 */

if ( !defined('WPSEO_VERSION') ) {
	header('HTTP/1.0 403 Forbidden');
	die;
}

global $wpseo_admin_pages;

$options = get_wpseo_options();
$wpseo_admin_pages->admin_header( true, 'yoast_wpseo_rss_options', 'wpseo_rss' );

$content   = '<p>' . __( "This feature is used to automatically add content to your RSS, more specifically, it's meant to add links back to your blog and your blog posts, so dumb scrapers will automatically add these links too, helping search engines identify you as the original source of the content.", 'wordpress-seo' ) . '</p>';
$rows      = array();
$rssbefore = '';
if ( isset( $options[ 'rssbefore' ] ) )
	$rssbefore = esc_html( stripslashes( $options[ 'rssbefore' ] ) );

$rssafter = '';
if ( isset( $options[ 'rssafter' ] ) )
	$rssafter = esc_html( stripslashes( $options[ 'rssafter' ] ) );

$rows[ ] = array(
	"id"      => "rssbefore",
	"label"   => __( "Content to put before each post in the feed", 'wordpress-seo' ),
	"desc"    => __( "(HTML allowed)", 'wordpress-seo' ),
	"content" => '<textarea cols="50" rows="5" id="rssbefore" name="wpseo_rss[rssbefore]">' . $rssbefore . '</textarea>',
);
$rows[ ] = array(
	"id"      => "rssafter",
	"label"   => __( "Content to put after each post", 'wordpress-seo' ),
	"desc"    => __( "(HTML allowed)", 'wordpress-seo' ),
	"content" => '<textarea cols="50" rows="5" id="rssafter" name="wpseo_rss[rssafter]">' . $rssafter . '</textarea>',
);
$rows[ ] = array(
	"label"   => __( 'Explanation', 'wordpress-seo' ),
	"content" => '<p>' . __( 'You can use the following variables within the content, they will be replaced by the value on the right.', 'wordpress-seo' ) . '</p>' .
		'<table>' .
		'<tr><th><strong>%%AUTHORLINK%%</strong></th><td>' . __( 'A link to the archive for the post author, with the authors name as anchor text.', 'wordpress-seo' ) . '</td></tr>' .
		'<tr><th><strong>%%POSTLINK%%</strong></th><td>' . __( 'A link to the post, with the title as anchor text.', 'wordpress-seo' ) . '</td></tr>' .
		'<tr><th><strong>%%BLOGLINK%%</strong></th><td>' . __( "A link to your site, with your site's name as anchor text.", 'wordpress-seo' ) . '</td></tr>' .
		'<tr><th><strong>%%BLOGDESCLINK%%</strong></th><td>' . __( "A link to your site, with your site's name and description as anchor text.", 'wordpress-seo' ) . '</td></tr>' .
		'</table>'
);
$wpseo_admin_pages->postbox( 'rssfootercontent', __( 'Content of your RSS Feed', 'wordpress-seo' ), $content . $wpseo_admin_pages->form_table( $rows ) );

$wpseo_admin_pages->admin_footer();