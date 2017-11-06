<?php
/**
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform                = Yoast_Form::get_instance();
$yform->currentoption = 'wpseo_internallinks';

echo '<h2>' . esc_html__( 'Breadcrumbs settings', 'wordpress-seo' ) . '</h2>';

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
if ( get_option( 'show_on_front' ) == 'page' && get_option( 'page_for_posts' ) > 0 ) {
	$yform->toggle_switch( 'breadcrumbs-blog-remove', array(
		'off' => __( 'Show', 'wordpress-seo' ),
		'on'  => __( 'Hide', 'wordpress-seo' ),
	), __( 'Show Blog page', 'wordpress-seo' ) );
}
$yform->toggle_switch( 'breadcrumbs-boldlast', array(
	'on'  => __( 'Bold', 'wordpress-seo' ),
	'off' => __( 'Regular', 'wordpress-seo' ),
), __( 'Bold the last page', 'wordpress-seo' ) );
echo '<br/><br/>';

$post_types = get_post_types( array( 'public' => true ), 'objects' );
if ( is_array( $post_types ) && $post_types !== array() ) {
	echo '<h2>' . esc_html__( 'Taxonomy to show in breadcrumbs for post types', 'wordpress-seo' ) . '</h2>';
	foreach ( $post_types as $pt ) {
		$taxonomies = get_object_taxonomies( $pt->name, 'objects' );
		if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
			$values = array( 0 => __( 'None', 'wordpress-seo' ) );
			foreach ( $taxonomies as $tax ) {
				$values[ $tax->name ] = $tax->labels->singular_name;
			}
			$yform->select( 'post_types-' . $pt->name . '-maintax', $pt->labels->name, $values );
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
	echo '<h2>' . esc_html__( 'Post type archive to show in breadcrumbs for taxonomies', 'wordpress-seo' ) . '</h2>';
	foreach ( $taxonomies as $tax ) {
		$values = array( 0 => __( 'None', 'wordpress-seo' ) );
		if ( get_option( 'show_on_front' ) == 'page' && get_option( 'page_for_posts' ) > 0 ) {
			$values['post'] = __( 'Blog', 'wordpress-seo' );
		}

		if ( is_array( $post_types ) && $post_types !== array() ) {
			foreach ( $post_types as $pt ) {
				if ( $pt->has_archive ) {
					$values[ $pt->name ] = $pt->labels->name;
				}
			}
			unset( $pt );
		}
		$yform->select( 'taxonomy-' . $tax->name . '-ptparent', $tax->labels->singular_name, $values );
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
	/* translators: %1$s / %2$s: links to the breadcrumbs implementation page on the Yoast knowledgebase */
	printf( __( 'Usage of this breadcrumbs feature is explained in %1$sour knowledge-base article on breadcrumbs implementation%2$s.', 'wordpress-seo' ), '<a href="' . WPSEO_Shortlinker::get( 'http://yoa.st/breadcrumbs' ) . '" target="_blank">', '</a>' );
	?>
</p>
