<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\YoastSEO\Loaders
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$has_feature_flag = defined( 'YOAST_SEO_INDEXABLES' ) && YOAST_SEO_INDEXABLES === true;

// @codingStandardsIgnoreLine PHPCompatibility.PHP.NewLanguageConstructs.t_ns_separatorFound -- This is a > 5.3 feature.
if ( $has_feature_flag && class_exists( '\Yoast\YoastSEO\Config\Plugin' ) ) {
	// @codingStandardsIgnoreLine PHPCompatibility.PHP.NewLanguageConstructs.t_ns_separatorFound -- This is a > 5.3 feature.
	$bootstrap = new \Yoast\YoastSEO\Config\Plugin();
	$bootstrap->initialize();
	$bootstrap->register_hooks();
}

