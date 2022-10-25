<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use WP_Post;
use WPSEO_Admin_Utils;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\Premium_Inactive_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class to manage the Zapier integration if Premium is not enabled.
 */
class Zapier_Free implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Premium_Inactive_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_publishbox_misc_actions', [ $this, 'add_publishbox_text' ] );
	}

	/**
	 * Adds the Zapier text to the Classic Editor publish box.
	 *
	 * @param WP_Post $post The current post object.
	 *
	 * @return void
	 */
	public function add_publishbox_text( WP_Post $post ) {
		if ( ! $this->is_post_type_supported( $post->post_type ) ) {
			return;
		}
		?>
		<div class="misc-pub-section yoast yoast-seo-score yoast-zapier-text">
			<span class="yoast-logo svg"></span>
			<span>
			<?php
			\printf(
				/* translators: 1: Link start tag, 2: Yoast SEO, 3: Zapier, 4: Link closing tag. */
				\esc_html__( '%1$sConnect %2$s with %3$s%4$s to instantly share your published posts with 2000+ destinations such as Twitter, Facebook and more.', 'wordpress-seo' ),
				'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_integrations' ) ) . '" target="_blank">',
				'Yoast SEO',
				'Zapier',
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- The content is already escaped.
				WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
			);
			?>
			</span>
		</div>
		<?php
	}

	/**
	 * Returns whether the post type is supported by the Zapier integration.
	 *
	 * The Zapier integration should be visible and working only for post types
	 * that support the Yoast Metabox. We filter out attachments regardless of
	 * the Yoast SEO settings, anyway.
	 *
	 * @param string $post_type The post type to be checked.
	 *
	 * @return bool Whether the post type is supported by the Zapier integration.
	 */
	public function is_post_type_supported( $post_type ) {
		return $post_type !== 'attachment' && WPSEO_Utils::is_metabox_active( $post_type, 'post_type' );
	}
}
