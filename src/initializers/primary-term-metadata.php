<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\Admin\Post_Conditional;

/**
 * Add primary term meta field.
 */
class Primary_Term_Metadata implements Initializer_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<Post_Conditional>
	 */
	public static function get_conditionals() {
		return [
			Post_Conditional::class,
		];
	}

	/**
	 * Initializes the integration.
	 *
	 * Add the primary term fields.
	 *
	 * @return void
	 */
	public function initialize() {
		/**
		 * Called by WPSEO_Meta to add extra meta fields to the ones defined there.
		 */
		\add_filter( 'add_extra_wpseo_meta_fields', [ $this, 'add_meta_field' ] );
	}

	/**
	 * Adds the primary term to general tab.
	 *
	 * @param array<string|array<string>> $fields The currently registered meta fields.
	 *
	 * @return array<string|array<string>> A new array with meta fields.
	 */
	public function add_meta_field( $fields ) {

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We are not processing form information.
		if ( ! isset( $_GET['post'] ) || ! \is_numeric( $_GET['post'] ) ) {
			return $fields;
		}
        // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Reason: We casting to integer.
		$post_id = (int) $_GET['post'];

		$taxonomies = \YoastSEO()->helpers->primary_term->get_primary_term_taxonomies( $post_id );
		foreach ( $taxonomies as $taxonomy ) {
			$fields['general'][ 'primary_' . $taxonomy->name ] = [
				'type'          => 'hidden',
				'title'         => '',
				'default_value' => '',
				'description'   => '',
			];
		}

		return $fields;
	}
}
