<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$title_separator_title = \esc_html__( 'Title Separator', 'wordpress-seo' );
$wpseo_title_separator_presenter = new WPSEO_Paper_Presenter(
	$title_separator_title,
	__DIR__ . '/paper-content/general/title-separator.php',
	[
		'collapsible' => true,
		'expanded'    => true,
		'paper_id'    => 'settings-general-title-separator',
		'title'       => $title_separator_title,
		'class'       => 'search-appearance'
	]
);
echo $wpseo_title_separator_presenter->get_output();

if ( get_option( 'show_on_front' ) === 'posts' ) {
	$homepage_title = \esc_html__( 'Homepage', 'wordpress-seo' );
} else {
	$homepage_title = \esc_html__( 'Homepage &amp; Posts page', 'wordpress-seo' );
}

$wpseo_homepage_presenter = new WPSEO_Paper_Presenter(
	$homepage_title,
	__DIR__ . '/paper-content/general/homepage.php',
	[
		'collapsible' => true,
		'expanded'    => true,
		'paper_id'    => 'settings-general-homepage',
		'title'       => $homepage_title,
		'class'       => 'search-appearance'
	]
);
echo $wpseo_homepage_presenter->get_output();

$knowledge_graph_title = esc_html__( 'Knowledge Graph & Schema.org', 'wordpress-seo' );

$wpseo_knowledge_graph_presenter = new WPSEO_Paper_Presenter(
	$knowledge_graph_title,
	__DIR__ . '/paper-content/general/knowledge-graph.php',
	[
		'collapsible' => true,
		'expanded'    => true,
		'paper_id' => 'settings-general-knowledge-graph',
		'title'       => $knowledge_graph_title,
		'class' => 'search-appearance'
	]
);
echo $wpseo_knowledge_graph_presenter->get_output();
