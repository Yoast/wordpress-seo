<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

/**
 * Form object.
 *
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/*
 * WPSEO_Post_Type::get_accessible_post_types() should *not* be used here.
 * Otherwise setting a post-type to `noindex` will remove it from the list,
 * making it very hard to restore the setting again.
 */
$post_types = get_post_types( array( 'public' => true ), 'objects' );

// We'll show attachments on the Media tab.
$post_types = WPSEO_Post_Type::filter_attachment_post_type( $post_types );

$view_utils = new Yoast_View_Utils();

echo '<p>';
esc_html_e( 'The settings on this page allow you to specify what the default search appearance should be for any type of content you have. You can choose which content types appear in search results and what their default description should be.', 'wordpress-seo' );
echo '</p>';

if ( is_array( $post_types ) && $post_types !== array() ) {
	foreach ( $post_types as $id => $post_type ) {
		$single_label = $post_type->labels->singular_name;
		$plural_label = $post_type->labels->name;

		echo '<div class="paper tab-block" id="' . esc_attr( $post_type->name . '-titles-metas' ) . '">';

		$toggle_icon = 'dashicons-arrow-up-alt2';
		$class 		 = 'toggleable-container';

		if ( $id !== 'post' ) {
			$toggle_icon = 'dashicons-arrow-down-alt2';
			$class .= ' toggleable-container-hidden';
		}

		printf(
			'<h2 id="%s">%s (<code>%s</code>) <button class="toggleable-container-trigger"><span class="toggleable-container-icon dashicons %s"></span></button></h2>',
			esc_attr( $post_type->name ),
			esc_html( $plural_label ),
			esc_html( $post_type->name ),
			$toggle_icon
		);

		echo '<div class="' . $class . '">';

		// translators: %s is the singular version of the post type's name.
		echo '<h3>' . esc_html( sprintf( __( 'Settings for single %s URLs', 'wordpress-seo' ), $single_label ) ) . '</h3>';

		$view_utils->show_post_type_settings( $post_type );

		if ( WPSEO_Utils::is_woocommerce_active() && $post_type->name === 'product' ) {
			$woocommerce_shop_page = wc_get_page_id( 'shop' );
			$description = __( 'You haven\'t set a Shop page in your WooCommerce settings. Please do this first.', 'wordpress-seo' );

			if ( $woocommerce_shop_page !== -1 ) {
				$description = sprintf(
				/* translators: %1$s expands to an opening anchor tag, %2$s expands to a closing anchor tag. */
				__( 'You can edit the SEO meta-data for this custom type on the %1$sShop page%2$s.', 'wordpress-seo' ),
					'<a href="' . get_edit_post_link( wc_get_page_id( 'shop' ) ) . '">',
					'</a>'
				);
			}

			echo '<h3>' . esc_html( sprintf( __( 'Settings for %s archive', 'wordpress-seo' ), $plural_label ) ) . '</h3>';
			echo '<p>' . $description . '</p>';
			echo '</div>';
			echo '</div>';

			continue;
		}

		if ( $post_type->has_archive === true ) {
			// translators: %s is the plural version of the post type's name.
			echo '<h3>' . esc_html( sprintf( __( 'Settings for %s archive', 'wordpress-seo' ), $plural_label ) ) . '</h3>';

			$custom_post_type_archive_help = $view_utils->search_results_setting_help( $post_type, 'archive' );

			$yform->index_switch(
				'noindex-ptarchive-' . $post_type->name,
				sprintf(
					/* translators: %s expands to the post type's name. */
					__( 'the archive for %s', 'wordpress-seo' ),
					$plural_label
				),
				$custom_post_type_archive_help->get_button_html() . $custom_post_type_archive_help->get_panel_html()
			);

			$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
			$page_type                = $recommended_replace_vars->determine_for_archive( $post_type->name );

			$editor = new WPSEO_Replacevar_Editor( $yform, 'title-ptarchive-' . $post_type->name, 'metadesc-ptarchive-' . $post_type->name, $page_type, false );
			$editor->render();

			if ( WPSEO_Options::get( 'breadcrumbs-enable' ) === true ) {
				// translators: %s is the plural version of the post type's name.
				echo '<h4>' . esc_html( sprintf( __( 'Breadcrumb settings for %s archive', 'wordpress-seo' ), $plural_label ) ) . '</h4>';
				$yform->textinput( 'bctitle-ptarchive-' . $post_type->name, __( 'Breadcrumbs title', 'wordpress-seo' ) );
			}
		}

		/**
		 * Allow adding a custom checkboxes to the admin meta page - Post Types tab
		 *
		 * @api  WPSEO_Admin_Pages  $yform  The WPSEO_Admin_Pages object
		 * @api  String  $name  The post type name
		 */
		do_action( 'wpseo_admin_page_meta_post_types', $yform, $post_type->name );

		echo '</div>';
		echo '</div>';
	}
}
