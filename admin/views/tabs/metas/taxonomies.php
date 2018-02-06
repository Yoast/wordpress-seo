<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();

$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
	foreach ( $taxonomies as $tax ) {
		// Explicitly hide all the core taxonomies we never want to do stuff for.
		if ( in_array( $tax->name, array( 'link_category', 'nav_menu' ), true ) ) {
			continue;
		}

		echo '<h2>' . esc_html( ucfirst( $tax->labels->name ) ) . ' (<code>' . esc_html( $tax->name ) . '</code>)</h2>';
		if ( $tax->name === 'post_format' ) {
			$yform->light_switch(
				'disable-post_format',
				__( 'Format-based archives', 'wordpress-seo' ),
				array( __( 'Enabled', 'wordpress-seo' ), __( 'Disabled', 'wordpress-seo' ) ),
				false
			);
		}
		echo "<div id='" . esc_attr( $tax->name ) . "-titles-metas'>";
		/* translators: %1$s expands to the Taxonomy name */
		$yform->index_switch( 'noindex-tax-' . $tax->name, $tax->labels->name );
		$yform->textinput( 'title-tax-' . $tax->name, __( 'Title template', 'wordpress-seo' ), 'template taxonomy-template' );
		$yform->textarea( 'metadesc-tax-' . $tax->name, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template taxonomy-template' ) );
		if ( $tax->name !== 'post_format' ) {
			/* translators: %1$s expands to Yoast SEO */
			$yform->show_hide_switch( 'hideeditbox-tax-' . $tax->name, sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
		}
		/**
		 * Allow adding custom checkboxes to the admin meta page - Taxonomies tab
		 *
		 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
		 * @api  Object             $tax    The taxonomy
		 */
		do_action( 'wpseo_admin_page_meta_taxonomies', $yform, $tax );
		echo '<br/><br/>';
		echo '</div>';
	}
	unset( $tax );
}
unset( $taxonomies );

echo '<h2>', esc_html__( ' Category URLs', 'wordpress-seo' ), '</h2>';

$remove_buttons = array( __( 'Keep', 'wordpress-seo' ), __( 'Remove', 'wordpress-seo' ) );
$yform->light_switch(
	'stripcategorybase',
	/* translators: %s expands to <code>/category/</code> */
	sprintf( __( 'Category URLs in WordPress contain a prefix, usually %s, this feature removes that prefix, for categories only.', 'wordpress-seo' ), '<code>/category/</code>' ),
	$remove_buttons,
	false
);
