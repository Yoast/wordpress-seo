<?php
/**
 * @package Admin
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

global $wpseo_admin_pages;

$wpseo_admin_pages->admin_header( true, 'yoast_wpseo_xml_sitemap_options', 'wpseo_xml' );

$options = get_option( 'wpseo_xml' );

$base = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '';

$content = $wpseo_admin_pages->checkbox( 'enablexmlsitemap', __( 'Check this box to enable XML sitemap functionality.', 'wordpress-seo' ), false );
$content .= '<div id="sitemapinfo">';
if ( isset( $_SERVER['SERVER_SOFTWARE'] ) && stristr( $_SERVER['SERVER_SOFTWARE'], 'nginx' ) !== false ) {
	$content .= '<div style="margin: 5px 0; padding: 3px 10px; background-color: #ffffe0; border: 1px solid #E6DB55; border-radius: 3px">';
	$content .= '<p>' . __( 'As you\'re on NGINX, you\'ll need the following rewrites:', 'wordpress-seo' ) . '</p>';
	$content .= '<pre>rewrite ^/sitemap_index\.xml$ /index.php?sitemap=1 last;
rewrite ^/([^/]+?)-sitemap([0-9]+)?\.xml$ /index.php?sitemap=$1&sitemap_n=$2 last;</pre>';
	$content .= '</div>';
}

if ( isset( $options['enablexmlsitemap'] ) && $options['enablexmlsitemap'] )
	$content .= '<p>' . sprintf( __( 'You can find your XML Sitemap here: %sXML Sitemap%s', 'wordpress-seo' ), '<a target="_blank" class="button-secondary" href="' . home_url( $base . 'sitemap_index.xml' ) . '">', '</a>' ) . '<br/><br/>' . __( 'You do <strong>not</strong> need to generate the XML sitemap, nor will it take up time to generate after publishing a post.', 'wordpress-seo' ) . '</p>';
else
	$content .= '<p>' . __( 'Save your settings to activate XML Sitemaps.', 'wordpress-seo' ) . '</p>';

$content .= '<h2>' . __( 'User sitemap', 'wordpress-seo' ) . '</h2>';
$content .= $wpseo_admin_pages->checkbox( 'disable_author_sitemap', __( "Disable author/user sitemap", 'wordpress-seo' ), false );
$content .= '<br/>';
$content .= '<h2>' . __( 'General settings', 'wordpress-seo' ) . '</h2>';
$content .= '<p>' . __( 'After content publication, the plugin automatically pings Google and Bing, do you need it to ping other search engines too? If so, check the box:', 'wordpress-seo' ) . '</p>';
$content .= $wpseo_admin_pages->checkbox( 'xml_ping_yahoo', __( "Ping Yahoo!", 'wordpress-seo' ), false );
$content .= $wpseo_admin_pages->checkbox( 'xml_ping_ask', __( "Ping Ask.com", 'wordpress-seo' ), false );
$content .= '<h2>' . __( 'Exclude post types', 'wordpress-seo' ) . '</h2>';
$content .= '<p>' . __( 'Please check the appropriate box below if there\'s a post type that you do <strong>NOT</strong> want to include in your sitemap:', 'wordpress-seo' ) . '</p>';

$post_types = apply_filters( 'wpseo_sitemaps_supported_post_types', get_post_types( array( 'public' => true ), 'objects' ) );
foreach ( $post_types as $pt ) {
	$content .= $wpseo_admin_pages->checkbox( 'post_types-' . $pt->name . '-not_in_sitemap', $pt->labels->name . ' (<code>' . $pt->name . '</code>)' );
}

$content .= '<h2>' . __( 'Exclude taxonomies', 'wordpress-seo' ) . '</h2>';
$content .= '<p>' . __( 'Please check the appropriate box below if there\'s a taxonomy that you do <strong>NOT</strong> want to include in your sitemap:', 'wordpress-seo' ) . '</p>';

$taxonomies = apply_filters( 'wpseo_sitemaps_supported_taxonomies', get_taxonomies( array( 'public' => true ), 'objects' ) );
foreach ( $taxonomies as $tax ) {
	if ( isset( $tax->labels->name ) && trim( $tax->labels->name ) != '' )
		$content .= $wpseo_admin_pages->checkbox( 'taxonomies-' . $tax->name . '-not_in_sitemap', $tax->labels->name . ' (<code>' . $tax->name . '</code>)' );
}

$content .= '<br/>';
$content .= '<h2>' . __( 'Entries per page', 'wordpress-seo' ) . '</h2>';
$content .= '<p>' . __( 'Please enter the maximum number of entries per sitemap page (defaults to 1000, you might want to lower this to prevent memory issues on some installs):', 'wordpress-seo' ) . '</p>';
$content .= $wpseo_admin_pages->textinput( 'entries-per-page', __( 'Max entries per sitemap page', 'wordpress-seo' ) );

$content .= '<br class="clear"/>';
$content .= '</div>';

$wpseo_admin_pages->postbox( 'xmlsitemaps', __( 'XML Sitemap', 'wordpress-seo' ), $content );

do_action( 'wpseo_xmlsitemaps_config' );

$wpseo_admin_pages->admin_footer();