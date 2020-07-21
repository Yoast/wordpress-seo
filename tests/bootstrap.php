<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Yoast\WP\SEO
 */

define( 'ABSPATH', true );
define( 'WPSEO_INDEXABLES', true );

define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );
define( 'DAY_IN_SECONDS', 86400 );
define( 'WEEK_IN_SECONDS', 604800 );
define( 'MONTH_IN_SECONDS', 2592000 );
define( 'YEAR_IN_SECONDS', 31536000 );

define( 'EP_DATE', 1 );

if ( function_exists( 'opcache_reset' ) ) {
	opcache_reset();
}

require_once __DIR__ . '/../vendor/autoload.php';

if ( file_exists( __DIR__ . '/../wp-seo-premium.php' ) ) {
	require_once __DIR__ . '/load/wp-seo-premium.php';
}
else {
	require_once __DIR__ . '/load/wp-seo.php';
}

define( 'YoastSEO_Vendor\RUCKUSING_BASE', \WPSEO_PATH . 'fake-ruckusing' );
