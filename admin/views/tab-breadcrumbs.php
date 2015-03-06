<?php
/**
 * @package    WPSEO
 * @subpackage Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();

$yform->currentoption = 'wpseo_internallinks';

$yform->checkbox( 'breadcrumbs-enable', __( 'Enable Breadcrumbs', 'wordpress-seo' ) );
echo '<br/>';
echo '<div id="breadcrumbsinfo">';
$yform->textinput( 'breadcrumbs-sep', __( 'Separator between breadcrumbs', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-home', __( 'Anchor text for the Homepage', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-prefix', __( 'Prefix for the breadcrumb path', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-archiveprefix', __( 'Prefix for Archive breadcrumbs', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-searchprefix', __( 'Prefix for Search Page breadcrumbs', 'wordpress-seo' ) );
$yform->textinput( 'breadcrumbs-404crumb', __( 'Breadcrumb for 404 Page', 'wordpress-seo' ) );
echo '<br/>';
if ( get_option( 'show_on_front' ) == 'page' && get_option( 'page_for_posts' ) > 0 ) {
	$yform->checkbox( 'breadcrumbs-blog-remove', __( 'Remove Blog page from Breadcrumbs', 'wordpress-seo' ) );
}
$yform->checkbox( 'breadcrumbs-boldlast', __( 'Bold the last page in the breadcrumb', 'wordpress-seo' ) );
echo '<br/><br/>';

$post_types = get_post_types( array( 'public' => true ), 'objects' );
if ( is_array( $post_types ) && $post_types !== array() ) {
	echo '<strong>' . __( 'Taxonomy to show in breadcrumbs for:', 'wordpress-seo' ) . '</strong><br/>';
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

$taxonomies = get_taxonomies( array( 'public' => true, '_builtin' => false ), 'objects' );
if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
	echo '<strong>' . __( 'Post type archive to show in breadcrumbs for:', 'wordpress-seo' ) . '</strong><br/>';
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
<p>
	<strong><?php _e( 'How to insert breadcrumbs in your theme', 'wordpress-seo' ); ?></strong><br/>
	<?php printf( __( 'Usage of this breadcrumbs feature is explained %1$shere%2$s. For the more code savvy, insert this in your theme:', 'wordpress-seo' ), '<a href="https://yoast.com/wordpress/plugins/breadcrumbs/">', '</a>' ); ?>
</p>
<pre>
&lt;?php if ( function_exists(&#x27;yoast_breadcrumb&#x27;) ) {
yoast_breadcrumb(&#x27;&lt;p id=&quot;breadcrumbs&quot;&gt;&#x27;,&#x27;&lt;/p&gt;&#x27;);
} ?&gt;
</pre>