<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Archive
 *
 * @var Yoast_Form $yform
 */

$yform->toggle_switch( 'disable-author', array(
	'off' => __( 'Enabled', 'wordpress-seo' ),
	'on'  => __( 'Disabled', 'wordpress-seo' ),
), __( 'Author archives', 'wordpress-seo' ) );

?>

	<div id='author-archives-titles-metas-content' class='archives-titles-metas-content'>

	<?php
	$author_archives_help = new WPSEO_Admin_Help_Panel(
	'noindex-author-wpseo',
	esc_html__( 'Help on the author archives search results setting', 'wordpress-seo' ),
		sprintf(
		/* translators: 1: expands to <code>noindex</code>; 2: link open tag; 3: link close tag. */
			esc_html__( 'Not showing the archive for authors in the search results technically means those will have a %1$s robots meta and will be excluded from XML sitemaps. %2$sMore info on the search results settings%3$s.', 'wordpress-seo' ),
			'<code>noindex</code>',
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/show-x' ) ) . '" target="_blank" rel="noopener noreferrer">',
			'</a>'
		)
	);

	$yform->index_switch(
		'noindex-author-wpseo',
		__( 'author archives', 'wordpress-seo' ),
		$author_archives_help->get_button_html() . $author_archives_help->get_panel_html()
	);

	$author_archives_no_posts_help = new WPSEO_Admin_Help_Panel(
		'noindex-author-noposts-wpseo',
		esc_html__( 'Help on the authors without posts archive search results setting', 'wordpress-seo' ),
		sprintf(
		/* translators: 1: expands to <code>noindex</code>; 2: link open tag; 3: link close tag. */
		esc_html__( 'Not showing the archives for authors without posts in the search results technically means those will have a %1$s robots meta and will be excluded from XML sitemaps. %2$sMore info on the search results settings%3$s.', 'wordpress-seo' ),
			'<code>noindex</code>',
			'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/show-x' ) ) . '" target="_blank" rel="noopener noreferrer">',
			'</a>'
		)
	);

	$yform->index_switch(
		'noindex-author-noposts-wpseo',
		__( 'archives for authors without posts', 'wordpress-seo' ),
		$author_archives_no_posts_help->get_button_html() . $author_archives_no_posts_help->get_panel_html()
	);

	$editor = new WPSEO_Replacevar_Editor( $yform, 'title-author-wpseo', 'metadesc-author-wpseo', 'author_archive', false );
	$editor->render();
	?>
	</div>



