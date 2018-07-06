<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Archive
 *
 * @var Yoast_Form $yform
 */

	$yform->toggle_switch( 'disable-date', array(
	'off' => __( 'Enabled', 'wordpress-seo' ),
	'on'  => __( 'Disabled', 'wordpress-seo' ),
	), __( 'Date archives', 'wordpress-seo' ) );
?>
<div id='date-archives-titles-metas-content' class='archives-titles-metas-content'>
<?php
		$date_archives_help = new WPSEO_Admin_Help_Panel(
		'noindex-archive-wpseo',
		esc_html__( 'Help on the date archives search results setting', 'wordpress-seo' ),
		sprintf(
		/* translators: 1: expands to <code>noindex</code>; 2: link open tag; 3: link close tag. */
		esc_html__( 'Not showing the date archives in the search results technically means those will have a %1$s robots meta and will be excluded from XML sitemaps. %2$sMore info on the search results settings%3$s.', 'wordpress-seo' ),
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

		$editor = new WPSEO_Replacevar_Editor( $yform, 'title-archive-wpseo', 'metadesc-archive-wpseo', 'date_archive', false );
		$editor->render();
	?>
</div>
