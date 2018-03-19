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

$taxonomies = get_taxonomies( array( 'public' => true ), 'objects' );
if ( is_array( $taxonomies ) && $taxonomies !== array() ) {
	foreach ( $taxonomies as $tax ) {
		// Explicitly hide all the core taxonomies we never want to do stuff for.
		if ( in_array( $tax->name, array( 'link_category', 'nav_menu' ), true ) ) {
			continue;
		}

		echo '<div class="tab-block">';
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

		$view_utils      = new Yoast_View_Utils();
		$taxonomies_help = $view_utils->search_results_setting_help( $tax );

		$yform->index_switch(
			'noindex-tax-' . $tax->name,
			$tax->labels->name,
			$taxonomies_help->get_button_html() . $taxonomies_help->get_panel_html()
		);

		$yform->textinput( 'title-tax-' . $tax->name, __( 'Title template', 'wordpress-seo' ), 'template taxonomy-template' );
		$yform->textarea( 'metadesc-tax-' . $tax->name, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template taxonomy-template' ) );
		if ( $tax->name !== 'post_format' ) {
			/* translators: %1$s expands to Yoast SEO */
			$yform->show_hide_switch( 'display-metabox-tax-' . $tax->name, sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
		}
		/**
		 * Allow adding custom checkboxes to the admin meta page - Taxonomies tab
		 *
		 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
		 * @api  Object             $tax    The taxonomy
		 */
		do_action( 'wpseo_admin_page_meta_taxonomies', $yform, $tax );
		echo '</div>';
		echo '</div>';
	}
	unset( $tax );
}
unset( $taxonomies );

echo '<h2>', esc_html__( ' Category URLs', 'wordpress-seo' ), '</h2>';

$remove_buttons = array( __( 'Keep', 'wordpress-seo' ), __( 'Remove', 'wordpress-seo' ) );

$stripcategorybase_help = new WPSEO_Admin_Help_Panel(
	'opengraph',
	esc_html__( 'Help on the category prefix setting', 'wordpress-seo' ),
	sprintf(
		/* translators: %s expands to <code>/category/</code> */
		esc_html__( 'Category URLs in WordPress contain a prefix, usually %s, this feature removes that prefix, for categories only.', 'wordpress-seo' ),
		'<code>/category/</code>'
	)
);

$yform->light_switch(
	'stripcategorybase',
	__( 'Remove the categories prefix', 'wordpress-seo' ),
	$remove_buttons,
	false,
	$stripcategorybase_help->get_button_html() . $stripcategorybase_help->get_panel_html()
);
