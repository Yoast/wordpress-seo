<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_titles' );

$metas_tabs = new WPSEO_Option_Tabs( 'metas' );
$metas_tabs->add_tab( new WPSEO_Option_Tab( 'general', __( 'General', 'wordpress-seo' ) ) );
$metas_tabs->add_tab( new WPSEO_Option_Tab( 'post-types', __( 'Content Types', 'wordpress-seo' ) ) );
$metas_tabs->add_tab( new WPSEO_Option_Tab( 'media', __( 'Media', 'wordpress-seo' ) ) );
$metas_tabs->add_tab( new WPSEO_Option_Tab( 'taxonomies', __( 'Taxonomies', 'wordpress-seo' ) ) );
$metas_tabs->add_tab( new WPSEO_Option_Tab( 'archives', __( 'Archives', 'wordpress-seo' ) ) );
$metas_tabs->add_tab( new WPSEO_Option_Tab( 'breadcrumbs', __( 'Breadcrumbs', 'wordpress-seo' ) ) );
$metas_tabs->add_tab( new WPSEO_Option_Tab( 'rss', __( 'RSS', 'wordpress-seo' ) ) );
$metas_tabs->display( $yform );

$yform->admin_footer();
