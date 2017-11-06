<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<p>';
/* translators: %1$s / %2$s: links to an article about duplicate content on yoast.com */
printf( __( 'If you\'re running a one author blog, the author archive will be exactly the same as your homepage. This is what\'s called a %1$sduplicate content problem%2$s.', 'wordpress-seo' ), '<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/duplicate-content' ) . '">', '</a>' );
echo ' ';
/* translators: %s expands to <code>noindex, follow</code> */
printf( __( 'If this is the case on your site, you can choose to either disable it (which makes it redirect to the homepage), or to add %s to it so it doesn\'t show up in the search results.', 'wordpress-seo' ), '<code>noindex,follow</code>' );
echo ' ';
echo esc_html__( 'Note that links to archives might be still output by your theme and you would need to remove them separately.', 'wordpress-seo' );
echo ' ';
esc_html_e( 'Date-based archives could in some cases also be seen as duplicate content.', 'wordpress-seo' );
echo '</p>';

echo "<div id='author-archives-titles-metas'>";
echo '<h2>' . esc_html__( 'Author archives settings', 'wordpress-seo' ) . '</h2>';
$yform->toggle_switch( 'disable-author', array(
	'off' => __( 'Enabled', 'wordpress-seo' ),
	'on'  => __( 'Disabled', 'wordpress-seo' ),
), __( 'Author archives', 'wordpress-seo' ) );

echo "<div id='author-archives-titles-metas-content' class='archives-titles-metas-content'>";
$yform->textinput( 'title-author-wpseo', __( 'Title template', 'wordpress-seo' ), 'template author-template' );
$yform->textarea( 'metadesc-author-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template author-template' ) );
if ( $options['usemetakeywords'] === true ) {
	$yform->textinput( 'metakey-author-wpseo', __( 'Meta keywords template', 'wordpress-seo' ) );
}
$yform->toggle_switch( 'noindex-author-wpseo', $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
echo '</div>';
echo '</div>';

echo '<br/>';

echo "<div id='date-archives-titles-metas'>";
echo '<h2>' . esc_html__( 'Date archives settings', 'wordpress-seo' ) . '</h2>';
$yform->toggle_switch( 'disable-date', array(
	'off' => __( 'Enabled', 'wordpress-seo' ),
	'on'  => __( 'Disabled', 'wordpress-seo' ),
), __( 'Date archives', 'wordpress-seo' ) );

echo "<div id='date-archives-titles-metas-content' class='archives-titles-metas-content'>";
$yform->textinput( 'title-archive-wpseo', __( 'Title template', 'wordpress-seo' ), 'template date-template' );
$yform->textarea( 'metadesc-archive-wpseo', __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template date-template' ) );
$yform->toggle_switch( 'noindex-archive-wpseo', $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
echo '</div>';
echo '</div>';

echo '<br/>';

echo '<div id="special-pages-titles-metas">';
echo '<h2>' . esc_html__( 'Special Pages', 'wordpress-seo' ) . '</h2>';
/* translators: %s expands to <code>noindex, follow</code> */
echo '<p>' . sprintf( __( 'These pages will be %s by default, so they will never show up in search results.', 'wordpress-seo' ), '<code>noindex, follow</code>' ) . '</p>';
echo '<p><strong>' . __( 'Search pages', 'wordpress-seo' ) . '</strong><br/>';
$yform->textinput( 'title-search-wpseo', __( 'Title template', 'wordpress-seo' ), 'template search-template' );
echo '</p>';
echo '<p><strong>' . esc_html__( '404 pages', 'wordpress-seo' ) . '</strong><br/>';
$yform->textinput( 'title-404-wpseo', __( 'Title template', 'wordpress-seo' ), 'template error404-template' );
echo '</p>';
echo '</div>';
