<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Archive
 *
 * @uses Yoast_Form $yform Form object.
 */

$yform->toggle_switch(
	'disable-date',
	[
		'off' => __( 'On', 'wordpress-seo' ),
		'on'  => __( 'Off', 'wordpress-seo' ),
	],
	__( 'Date archives', 'wordpress-seo' )
);

?>
<div id='date-archives-titles-metas-content' class='archives-titles-metas-content'>
<div class="yoast-settings-section">
	<?php
	$date_archives_help = new WPSEO_Admin_Help_Panel(
		'noindex-archive-wpseo',
		esc_html__( 'Help on the date archives search results setting', 'wordpress-seo' ),
		sprintf(
			/* translators: 1: expands to <code>noindex</code>; 2: link open tag; 3: link close tag. */
			esc_html__( 'Not showing the date archives in the search results technically means those will have a %1$s robots meta. %2$sMore info on the search results settings%3$s.', 'wordpress-seo' ),
			'<code>noindex</code>',
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/show-x' ) ) . '" target="_blank" rel="noopener noreferrer">',
			'</a>'
		)
	);

	$yform->index_switch(
		'noindex-archive-wpseo',
		__( 'date archives', 'wordpress-seo' ),
		$date_archives_help->get_button_html() . $date_archives_help->get_panel_html()
	);

	echo '</div>';
	echo '<div class="yoast-settings-section">';

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

	echo '</div>';

	/**
	 * WARNING: This hook is intended for internal use only.
	 * Don't use it in your code as it will be removed shortly.
	 */
	// phpcs:ignore Yoast.NamingConventions.ValidHookName.MaxExceeded -- Added _internal suffix for clarity.
	do_action( 'Yoast\WP\SEO\admin_date_archives_meta_internal', $yform );

	/**
	 * Allow adding custom fields to the admin meta page - Date archives panel in the Archives tab.
	 *
	 * @deprecated 19.10 No replacement available.
	 *
	 * @param Yoast_Form $yform The Yoast_Form object.
	 */
	do_action_deprecated(
		'Yoast\WP\SEO\admin_date_archives_meta',
		[ $yform ],
		'19.10',
		'',
		'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
	);
	?>
</div>
