<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}
$yform = Yoast_Form::get_instance();

// To improve readability, this tab has been divided into 5 separate blocks, included below.
require dirname( __FILE__ ) . '/general/force-rewrite-title.php';
require dirname( __FILE__ ) . '/general/website-name.php';
require dirname( __FILE__ ) . '/general/title-separator.php';
require dirname( __FILE__ ) . '/general/knowledge-graph.php';
require dirname( __FILE__ ) . '/general/homepage.php';
