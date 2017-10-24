<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$post_types          = get_post_types( array( 'public' => true ), 'objects' );
$index_switch_values = array(
	'off' => '<code>index</code>',
	'on'  => '<code>noindex</code>',
);

if ( is_array( $post_types ) && $post_types !== array() ) {
	foreach ( $post_types as $post_type ) {
		$name = $post_type->name;
		echo "<div id='" . esc_attr( $name ) . "-titles-metas'>";
		echo '<h2 id="' . esc_attr( $name ) . '">' . esc_html( ucfirst( $post_type->labels->name ) ) . ' (<code>' . esc_html( $post_type->name ) . '</code>)</h2>';
		if ( $options['redirectattachment'] === true && $name === 'attachment' ) {
			// The `inline` CSS class prevents the notice from being moved to the top via JavaScript.
			echo '<div class="notice notice-error inline"><p>';
			/* translators: %1$s and %2$s expand to a link to the SEO Permalinks settings page. */
			echo sprintf( __( 'As you are redirecting attachment URLs to parent post URLs, these settings will currently only have an effect on unattached media items! So remember: If you change the %1$sattachment redirection setting%2$s in the future, the below settings will take effect for *all* media items.', 'wordpress-seo' ), '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_advanced&tab=permalinks' ) ) . '">', '</a>' );
			echo '</p></div>';
		}
		$yform->textinput( 'title-' . $name, __( 'Title template', 'wordpress-seo' ), 'template posttype-template' );
		$yform->textarea( 'metadesc-' . $name, __( 'Meta description template', 'wordpress-seo' ), array( 'class' => 'template posttype-template' ) );
		if ( $options['usemetakeywords'] === true ) {
			$yform->textinput( 'metakey-' . $name, __( 'Meta keywords template', 'wordpress-seo' ) );
		}
		$yform->toggle_switch( 'noindex-' . $name, $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );
		$yform->toggle_switch( 'showdate-' . $name, array(
			'on'  => __( 'Show', 'wordpress-seo' ),
			'off' => __( 'Hide', 'wordpress-seo' ),
		), __( 'Date in Snippet Preview', 'wordpress-seo' ) );
		$yform->toggle_switch( 'hideeditbox-' . $name, array(
			'off' => __( 'Show', 'wordpress-seo' ),
			'on'  => __( 'Hide', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast SEO */
		), sprintf( __( '%1$s Meta Box', 'wordpress-seo' ), 'Yoast SEO' ) );
		echo '</div>';
		/**
		 * Allow adding a custom checkboxes to the admin meta page - Post Types tab
		 *
		 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
		 * @api  String  $name  The post type name
		 */
		do_action( 'wpseo_admin_page_meta_post_types', $yform, $name );
		echo '<br/><br/>';
	}
	unset( $post_type );
}
unset( $post_types );

$post_types = get_post_types(
	array(
		'_builtin'    => false,
		'has_archive' => true,
	),
	'objects'
);
if ( is_array( $post_types ) && $post_types !== array() ) {
	echo '<h2>' . esc_html__( 'Custom Post Type Archives', 'wordpress-seo' ) . '</h2>';
	echo '<p>' . __( 'Note: instead of templates these are the actual titles and meta descriptions for these custom post type archive pages.', 'wordpress-seo' ) . '</p>';
	foreach ( $post_types as $post_type ) {
		$name = $post_type->name;
		echo '<h3>' . esc_html( ucfirst( $post_type->labels->name ) ) . '</h3>';
		$yform->textinput( 'title-ptarchive-' . $name, __( 'Title', 'wordpress-seo' ), 'template posttype-template' );
		$yform->textarea( 'metadesc-ptarchive-' . $name, __( 'Meta description', 'wordpress-seo' ), array( 'class' => 'template posttype-template' ) );
		if ( $options['usemetakeywords'] === true ) {
			$yform->textinput( 'metakey-ptarchive-' . $name, __( 'Meta keywords', 'wordpress-seo' ) );
		}
		if ( $options['breadcrumbs-enable'] === true ) {
			$yform->textinput( 'bctitle-ptarchive-' . $name, __( 'Breadcrumbs title', 'wordpress-seo' ) );
		}
		$yform->toggle_switch( 'noindex-ptarchive-' . $name, $index_switch_values, __( 'Meta Robots', 'wordpress-seo' ) );

		echo '<br/><br/>';
	}
	unset( $post_type );
}
unset( $post_types );
