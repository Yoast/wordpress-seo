<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Breadcrumbs
 *
 * @var Yoast_Form $yform
 */

if ( ! current_theme_supports( 'yoast-seo-breadcrumbs' ) ) {
	$yform->light_switch( 'breadcrumbs-enable', __( 'Enable Breadcrumbs', 'wordpress-seo' ) );
	echo '<br/>';
}
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

$yform->toggle_switch( 'breadcrumbs-boldlast', array(
	'on'  => __( 'Bold', 'wordpress-seo' ),
	'off' => __( 'Regular', 'wordpress-seo' ),
), __( 'Bold the last page', 'wordpress-seo' ) );

echo '<br/><br/>';

/*
 * WPSEO_Post_Type::get_accessible_post_types() should *not* be used here.
 * Even posts that are not indexed, should be able to get breadcrumbs for accessibility/usability.
 */
$post_types = get_post_types( array( 'public' => true ), 'objects' );
if ( is_array( $post_types ) && $post_types !== array() ) {
	echo '<h2>' . esc_html__( 'Taxonomy to show in breadcrumbs for content types', 'wordpress-seo' ) . '</h2>';
	foreach ( $post_types as $pt ) {
		$taxonomies = get_object_taxonomies( $pt->name, 'objects' );
		if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
			$values = array( 0 => __( 'None', 'wordpress-seo' ) );
			foreach ( $taxonomies as $tax ) {
				if ( ! $tax->public ) {
					continue;
				}

				$values[ $tax->name ] = $tax->labels->singular_name;
			}
			$label = $pt->labels->name . ' (<code>' . $pt->name . '</code>)';
			$yform->select( 'post_types-' . $pt->name . '-maintax', $label, $values );
			unset( $values, $tax );
		}
		unset( $taxonomies );
	}
	unset( $pt );
}
echo '<br/>';

$taxonomies = get_taxonomies(
	array(
		'public'   => true,
		'_builtin' => false,
	),
	'objects'
);

if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
	echo '<h2>' . esc_html__( 'Content type archive to show in breadcrumbs for taxonomies', 'wordpress-seo' ) . '</h2>';
	foreach ( $taxonomies as $tax ) {
		$values = array( 0 => __( 'None', 'wordpress-seo' ) );
		if ( get_option( 'show_on_front' ) === 'page' && get_option( 'page_for_posts' ) > 0 ) {
			$values['post'] = __( 'Blog', 'wordpress-seo' );
		}

		if ( is_array( $post_types ) && $post_types !== array() ) {
			foreach ( $post_types as $pt ) {
				if ( WPSEO_Post_Type::has_archive( $pt ) ) {
					$values[ $pt->name ] = $pt->labels->name;
				}
			}
			unset( $pt );
		}
		$label = $tax->labels->singular_name . ' (<code>' . $tax->name . '</code>)';
		$yform->select( 'taxonomy-' . $tax->name . '-ptparent', $label, $values );
		unset( $values, $tax );
	}
}
unset( $taxonomies, $post_types );

?>
<br class="clear"/>
</div>
<h2><?php esc_html_e( 'How to insert breadcrumbs in your theme', 'wordpress-seo' ); ?></h2>
<p>
	<?php
	printf(
		/* translators: %1$s / %2$s: links to the breadcrumbs implementation page on the Yoast knowledgebase */
		esc_html__( 'Usage of this breadcrumbs feature is explained in %1$sour knowledge-base article on breadcrumbs implementation%2$s.', 'wordpress-seo' ),
		'<a href="' . esc_url( WPSEO_Shortlinker::get( 'http://yoa.st/breadcrumbs' ) ) . '" target="_blank">',
		'</a>'
	);
	?>
</p>
