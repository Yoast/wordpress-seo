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

//$supports_title_tag = \current_theme_supports( 'title-tag' );
//$is_block_theme     = ( function_exists( 'wp_is_block_theme' ) && \wp_is_block_theme() ) ? true : false;

if ( ! \current_theme_supports( 'title-tag' ) && ! ( function_exists( 'wp_is_block_theme' ) && \wp_is_block_theme() ) ) {
	$wpseo_rewrite_titles_title     = esc_html__( 'Rewrite titles', 'wordpress-seo' );
	$wpseo_rewrite_titles_presenter = new WPSEO_Paper_Presenter(
		$wpseo_rewrite_titles_title,
		__DIR__ . '/paper-content/general/force-rewrite-title.php',
		[
			'collapsible' => true,
			'expanded'    => true,
			'paper_id'    => 'settings-general-rewrite-titles',
			'title'       => $wpseo_rewrite_titles_title,
			'class'       => 'search-appearance',
		]
	);
	// phpcs:ignore WordPress.Security.EscapeOutput -- output contains HTML and we assume it's properly escape on object creation.
	echo $wpseo_rewrite_titles_presenter->get_output();
}

$wpseo_title_separator_title     = esc_html__( 'Title Separator', 'wordpress-seo' );
$wpseo_title_separator_presenter = new WPSEO_Paper_Presenter(
	$wpseo_title_separator_title,
	__DIR__ . '/paper-content/general/title-separator.php',
	[
		'collapsible' => true,
		'expanded'    => true,
		'paper_id'    => 'settings-general-title-separator',
		'title'       => $wpseo_title_separator_title,
		'class'       => 'search-appearance',
	]
);
// phpcs:ignore WordPress.Security.EscapeOutput -- output contains HTML and we assume it's properly escape on object creation.
echo $wpseo_title_separator_presenter->get_output();

if ( get_option( 'show_on_front' ) === 'posts' ) {
	$wpseo_homepage_title = esc_html__( 'Homepage', 'wordpress-seo' );
}
else {
	$wpseo_homepage_title = esc_html__( 'Homepage &amp; Posts page', 'wordpress-seo' );
}

$wpseo_homepage_presenter = new WPSEO_Paper_Presenter(
	$wpseo_homepage_title,
	__DIR__ . '/paper-content/general/homepage.php',
	[
		'collapsible' => true,
		'expanded'    => true,
		'paper_id'    => 'settings-general-homepage',
		'title'       => $wpseo_homepage_title,
		'class'       => 'search-appearance',
	]
);
// phpcs:ignore WordPress.Security.EscapeOutput -- output contains HTML and we assume it's properly escape on object creation.
echo $wpseo_homepage_presenter->get_output();

$wpseo_knowledge_graph_title     = esc_html__( 'Knowledge Graph & Schema.org', 'wordpress-seo' );
$wpseo_knowledge_graph_presenter = new WPSEO_Paper_Presenter(
	$wpseo_knowledge_graph_title,
	__DIR__ . '/paper-content/general/knowledge-graph.php',
	[
		'collapsible' => true,
		'expanded'    => true,
		'paper_id'    => 'settings-general-knowledge-graph',
		'title'       => $wpseo_knowledge_graph_title,
		'class'       => 'search-appearance',
	]
);
// phpcs:ignore WordPress.Security.EscapeOutput -- output contains HTML and we assume it's properly escape on object creation.
echo $wpseo_knowledge_graph_presenter->get_output();
