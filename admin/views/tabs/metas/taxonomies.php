<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
	foreach ( $taxonomies as $tax ) {
		// Explicitly hide all the core taxonomies we never want to do stuff for.
		if ( in_array( $tax->name, array( 'link_category', 'nav_menu', 'post_format' ) ) ) {
			continue;
		}

		echo '<h2>' . esc_html( ucfirst( $tax->labels->name ) ) . '</h2>';
		if ( $tax->name === 'post_format' ) {
			$yform->light_switch(
				'disable-post_format',
				__( 'Format-based archives', 'wordpress-seo' ),
				array( __( 'Enabled', 'wordpress-seo' ), __( 'Disabled', 'wordpress-seo' ) ),
				false
			);
		}
		echo "<div id='" . esc_attr( $tax->name ) . "-titles-metas'>";
		$yform->textinput( 'title-tax-' . $tax->name, __( 'Title template', 'wordpress-seo' ), 'template taxonomy-template' );
		$yform->textarea( 'metadesc-tax-' . $tax->name, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template taxonomy-template' ) );
		if ( $options['usemetakeywords'] === true ) {
			$yform->textinput( 'metakey-tax-' . $tax->name, __( 'Meta keywords template', 'wordpress-seo' ) );
		}
		$yform->toggle_switch( 'noindex-tax-' . $tax->name, $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
		if ( $tax->name !== 'post_format' ) {
			/* translators: %1$s expands to Yoast SEO */
			$yform->toggle_switch( 'hideeditbox-tax-' . $tax->name,
				array(
					'off' => __( 'Show', 'wordpress-seo' ),
					'on'  => __( 'Hide', 'wordpress-seo' ),
					/* translators: %1$s expands to Yoast SEO */
				), sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
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
