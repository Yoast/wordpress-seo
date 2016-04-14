<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?><h3><?php _e( 'Sitewide meta settings', 'wordpress-seo' ); ?></h3>
<?php
$yform->toggle_switch( 'noindex-subpages-wpseo', $index_switch_values, __( 'Subpages of archives', 'wordpress-seo' ) );
echo '<p>', __( 'If you want to prevent /page/2/ and further of any archive to show up in the search results, set this to "noindex".', 'wordpress-seo' ), '</p>';

$yform->light_switch( 'usemetakeywords', __( 'Use meta keywords tag?', 'wordpress-seo' ) );
echo '<p>', __( 'I don\'t know why you\'d want to use meta keywords, but if you want to, enable this.', 'wordpress-seo' ), '</p>';

/* translators: %s expands to <code>noodp</code> */
$yform->light_switch( 'noodp', sprintf( __( 'Force %s meta robots tag sitewide', 'wordpress-seo' ), '<code>noodp</code>' ) );
echo '<p>', __( 'Prevents search engines from using the DMOZ description for all pages from this site in the search results. Pages with descriptions will have the tag regardless of this setting.', 'wordpress-seo' ), '</p>';
