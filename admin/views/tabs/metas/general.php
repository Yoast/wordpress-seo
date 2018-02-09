<?php
/**
 * @package WPSEO\Admin\Views
 */

/**
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

// To improve readability, this tab has been divided into 5 separate blocks, included below.
require dirname( __FILE__ ) . '/general/force-rewrite-title.php';
require dirname( __FILE__ ) . '/general/title-separator.php';
require dirname( __FILE__ ) . '/general/homepage.php';
require dirname( __FILE__ ) . '/general/knowledge-graph.php';
