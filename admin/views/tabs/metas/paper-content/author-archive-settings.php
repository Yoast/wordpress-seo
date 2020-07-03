<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Archive
 *
 * @uses Yoast_Form $yform Form object.
 */

$yform->light_switch(
	'disable-author',
	__( 'Author archives', 'wordpress-seo' ),
	[],
	false,
	true
);

echo '<div id="author-archives-titles-metas-content" class="archives-titles-metas-content">';

$author_archives_help = new WPSEO_Admin_Help_Button(
	'https://yoa.st/show-x',
	esc_html__( 'Help on the author archives search results setting', 'wordpress-seo' )
);

$yform->index_switch(
	'noindex-author-wpseo',
	__( 'author archives', 'wordpress-seo' ),
	$author_archives_help
);

echo '<div id="noindex-author-noposts-wpseo-container">';

$author_archives_no_posts_help = new WPSEO_Admin_Help_Button(
	'https://yoast.com/show-x-in-search-results/',
	esc_html__( 'Help on the authors without posts archive search results setting', 'wordpress-seo' )
);

$yform->index_switch(
	'noindex-author-noposts-wpseo',
	__( 'archives for authors without posts', 'wordpress-seo' ),
	$author_archives_no_posts_help
);

echo '</div>'; // noindex-container.

$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();
$editor                       = new WPSEO_Replacevar_Editor(
	$yform,
	[
		'title'                 => 'title-author-wpseo',
		'description'           => 'metadesc-author-wpseo',
		'page_type_recommended' => $recommended_replace_vars->determine_for_archive( 'author' ),
		'page_type_specific'    => $editor_specific_replace_vars->determine_for_archive( 'author' ),
		'paper_style'           => false,
	]
);

$editor->render();

echo '</div>'; // author-archives.
