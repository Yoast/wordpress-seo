<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Yoast\WP\SEO
 */

define( 'WPSEO_INDEXABLES', true );
define( 'EP_DATE', 1 );

require_once __DIR__ . '/../../vendor/yoast/wp-test-utils/src/BrainMonkey/bootstrap.php';
require_once __DIR__ . '/../../vendor/autoload.php';

if ( file_exists( __DIR__ . '/../../wp-seo-premium.php' ) ) {
	require_once __DIR__ . '/load/wp-seo-premium.php';
}
else {
	require_once __DIR__ . '/load/wp-seo.php';
}
