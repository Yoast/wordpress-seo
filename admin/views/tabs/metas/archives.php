<?php
/**
 * WPSEO plugin file.
 *
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

$archives_help_01 = sprintf(
	/* translators: %1$s / %2$s: links to an article about duplicate content on yoast.com */
	esc_html__( 'If you\'re running a one author blog, the author archive will be exactly the same as your homepage. This is what\'s called a %1$sduplicate content problem%2$s.', 'wordpress-seo' ),
	'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/duplicate-content' ) ) . '">',
	'</a>'
);

$archives_help_02 = sprintf(
	/* translators: %s expands to <code>noindex, follow</code> */
	esc_html__( 'If this is the case on your site, you can choose to either disable it (which makes it redirect to the homepage), or to add %s to it so it doesn\'t show up in the search results.', 'wordpress-seo' ),
	'<code>noindex,follow</code>'
);

$archives_help_03 = esc_html__( 'Note that links to archives might be still output by your theme and you would need to remove them separately.', 'wordpress-seo' );

$archives_help_04 = esc_html__( 'Date-based archives could in some cases also be seen as duplicate content.', 'wordpress-seo' );

$archives_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-archives',
	__( 'Learn more about the archives setting', 'wordpress-seo' ),
	$archives_help_01 . ' ' . $archives_help_02 . ' ' . $archives_help_03 . ' ' . $archives_help_04,
	'has-wrapper'
);

echo '<p class="help-button-inline"><strong>' . esc_html__( 'Archives settings help', 'wordpress-seo' ) . $archives_help->get_button_html() . '</strong><p>';
echo $archives_help->get_panel_html();

echo '<div class="tab-block" id="author-archives-titles-metas">';
echo '<h2>' . esc_html__( 'Author archives settings', 'wordpress-seo' ) . '</h2>';
$yform->toggle_switch( 'disable-author', array(
	'off' => __( 'Enabled', 'wordpress-seo' ),
	'on'  => __( 'Disabled', 'wordpress-seo' ),
), __( 'Author archives', 'wordpress-seo' ) );

echo "<div id='author-archives-titles-metas-content' class='archives-titles-metas-content'>";

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

$yform->textinput( 'title-author-wpseo', __( 'Title template', 'wordpress-seo' ), 'template author-template' );
$yform->textarea( 'metadesc-author-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template author-template' ) );
echo '</div>';
echo '</div>';

echo '<div class="tab-block" id="date-archives-titles-metas">';
echo '<h2>' . esc_html__( 'Date archives settings', 'wordpress-seo' ) . '</h2>';
$yform->toggle_switch( 'disable-date', array(
	'off' => __( 'Enabled', 'wordpress-seo' ),
	'on'  => __( 'Disabled', 'wordpress-seo' ),
), __( 'Date archives', 'wordpress-seo' ) );

echo "<div id='date-archives-titles-metas-content' class='archives-titles-metas-content'>";

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

$yform->textinput( 'title-archive-wpseo', __( 'Title template', 'wordpress-seo' ), 'template date-template' );
$yform->textarea( 'metadesc-archive-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template date-template' ) );
echo '</div>';
echo '</div>';

$spcia_pages_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-special-pages',
	__( 'Learn more about the special pages setting', 'wordpress-seo' ),
	sprintf(
		/* translators: %s expands to <code>noindex, follow</code>. */
		__( 'These pages will be %s by default, so they will never show up in search results.', 'wordpress-seo' ),
		'<code>noindex, follow</code>'
	),
	'has-wrapper'
);

echo '<div class="tab-block" id="special-pages-titles-metas">';
echo '<h2 class="help-button-inline">' . esc_html__( 'Special Pages', 'wordpress-seo' ) . $spcia_pages_help->get_button_html() . '</h2>';
echo $spcia_pages_help->get_panel_html();

echo '<p><strong>' . esc_html__( 'Search pages', 'wordpress-seo' ) . '</strong><br/>';
$yform->textinput( 'title-search-wpseo', __( 'Title template', 'wordpress-seo' ), 'template search-template' );
echo '</p>';
echo '<p><strong>' . esc_html__( '404 pages', 'wordpress-seo' ) . '</strong><br/>';
$yform->textinput( 'title-404-wpseo', __( 'Title template', 'wordpress-seo' ), 'template error404-template' );
echo '</p>';
echo '</div>';
