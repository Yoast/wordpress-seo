<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Breadcrumbs
 *
 * @uses Yoast_Form $yform Form object.
 */

echo '<div id="breadcrumbsinfo">';

$yform->textinput( 'breadcrumbs-sep', __( 'Separator between breadcrumbs', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-home', __( 'Anchor text for the Homepage', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-prefix', __( 'Prefix for the breadcrumb path', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-archiveprefix', __( 'Prefix for Archive breadcrumbs', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-searchprefix', __( 'Prefix for Search Page breadcrumbs', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-404crumb', __( 'Breadcrumb for 404 Page', 'wordpress-seo' ) );

echo '<br/>';

if ( get_option( 'show_on_front' ) === 'page' && get_option( 'page_for_posts' ) > 0 ) {
	$yform->show_hide_switch( 'breadcrumbs-display-blog-page', __( 'Show Blog page', 'wordpress-seo' ) );
}

$yoast_free_breadcrumb_bold_texts = [
	'on'  => __( 'Bold', 'wordpress-seo' ),
	'off' => __( 'Regular', 'wordpress-seo' ),
];
$yform->toggle_switch(
	'breadcrumbs-boldlast',
	$yoast_free_breadcrumb_bold_texts,
	__( 'Bold the last page', 'wordpress-seo' )
);

echo '<br/><br/>';

/*
 * WPSEO_Post_Type::get_accessible_post_types() should *not* be used here.
 * Even posts that are not indexed, should be able to get breadcrumbs for accessibility/usability.
 */
$post_types = get_post_types( [ 'public' => true ], 'objects' );
if ( is_array( $post_types ) && $post_types !== [] ) {
	echo '<h2>' . esc_html__( 'Taxonomy to show in breadcrumbs for content types', 'wordpress-seo' ) . '</h2>';
	foreach ( $post_types as $pt ) {
		$taxonomies = get_object_taxonomies( $pt->name, 'objects' );
		if ( is_array( $taxonomies ) && $taxonomies !== [] ) {
			$values = [ 0 => __( 'None', 'wordpress-seo' ) ];
			foreach ( $taxonomies as $yoast_seo_taxonomy ) {
				if ( ! $yoast_seo_taxonomy->public ) {
					continue;
				}

				$values[ $yoast_seo_taxonomy->name ] = $yoast_seo_taxonomy->labels->singular_name;
			}
			$label = $pt->labels->name . ' (<code>' . $pt->name . '</code>)';
			$yform->select( 'post_types-' . $pt->name . '-maintax', $label, $values );
			unset( $values, $yoast_seo_taxonomy );
		}
		unset( $taxonomies );
	}
	unset( $pt );
}
echo '<br/>';

$taxonomies = get_taxonomies(
	[
		'public'   => true,
	],
	'objects'
);

if ( is_array( $taxonomies ) && $taxonomies !== [] ) {
	echo '<h2>' . esc_html__( 'Content type archive to show in breadcrumbs for taxonomies', 'wordpress-seo' ) . '</h2>';
	foreach ( $taxonomies as $yoast_seo_taxonomy ) {
		$values = [ 0 => __( 'None', 'wordpress-seo' ) ];
		if ( get_option( 'show_on_front' ) === 'page' && get_option( 'page_for_posts' ) > 0 ) {
			$values['post'] = __( 'Blog', 'wordpress-seo' );
		}

		if ( is_array( $post_types ) && $post_types !== [] ) {
			foreach ( $post_types as $pt ) {
				if ( WPSEO_Post_Type::has_archive( $pt ) ) {
					$values[ $pt->name ] = $pt->labels->name;
				}
			}
			unset( $pt );
		}
		$label = $yoast_seo_taxonomy->labels->singular_name . ' (<code>' . $yoast_seo_taxonomy->name . '</code>)';
		$yform->select( 'taxonomy-' . $yoast_seo_taxonomy->name . '-ptparent', $label, $values );
		unset( $values, $yoast_seo_taxonomy );
	}
}
unset( $taxonomies, $post_types );

?>
<br class="clear"/>
</div>
<h2><?php esc_html_e( 'How to insert breadcrumbs in your theme', 'wordpress-seo' ); ?></h2>
<?php
echo '<p>';
printf(
	/* translators: %1$s / %2$s: links to the breadcrumbs implementation page on the Yoast knowledgebase */
	esc_html__( 'Usage of this breadcrumbs feature is explained in %1$sour knowledge-base article on breadcrumbs implementation%2$s.', 'wordpress-seo' ),
	'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/breadcrumbs' ) ) . '" target="_blank">',
	'</a>'
);
echo '</p>';
if ( ! current_theme_supports( 'yoast-seo-breadcrumbs' ) ) {
	echo '<p>';
	/* translators: %1$s / %2$s: links to the breadcrumbs implementation page on the Yoast knowledgebase */
	echo esc_html_e( 'Note: You can always choose to enable / disable them for your theme below. This setting will not apply to breadcrumbs inserted through a widget, a block or a shortcode.', 'wordpress-seo' );
	echo '</p>';

	$yform->light_switch( 'breadcrumbs-enable', __( 'Enable Breadcrumbs for your theme', 'wordpress-seo' ) );
}
