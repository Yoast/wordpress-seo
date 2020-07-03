<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Archive
 *
 * @uses Yoast_Form $yform Form object.
 */

$yform->light_switch(
	'disable-date',
	__( 'Date archives', 'wordpress-seo' ),
	[],
	false,
	true
);

echo '<div id="date-archives-titles-metas-content" class="archives-titles-metas-content">';

echo '<div class="yoast-space-after">';

$date_archives_help = new WPSEO_Admin_Help_Button(
	'https://yoa.st/show-x',
	esc_html__( 'Help on the date archives search results setting', 'wordpress-seo' )
);

$yform->index_switch(
	'noindex-archive-wpseo',
	__( 'date archives', 'wordpress-seo' ),
	$date_archives_help
);

echo '</div>'; // space-after.

$recommended_replace_vars     = new WPSEO_Admin_Recommended_Replace_Vars();
$editor_specific_replace_vars = new WPSEO_Admin_Editor_Specific_Replace_Vars();

$editor = new WPSEO_Replacevar_Editor(
	$yform,
	[
		'title'                 => 'title-archive-wpseo',
		'description'           => 'metadesc-archive-wpseo',
		'page_type_recommended' => $recommended_replace_vars->determine_for_archive( 'date' ),
		'page_type_specific'    => $editor_specific_replace_vars->determine_for_archive( 'date' ),
		'paper_style'           => false,
	]
);
$editor->render();

echo '</div>'; // archives-content.

