<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Keeps the `company_logo_meta` and `person_logo_meta` entries inside the
 * `wpseo_titles` option consistent with the selected attachment ids.
 *
 * The Yoast settings UI never round-trips these two keys — they live in
 * Settings_Integration::DISALLOWED_SETTINGS — so without this watcher every
 * admin save would wipe them back to their defaults. Repopulating at save
 * time keeps the stored option self-consistent and removes the need for any
 * frontend code to recompute-and-persist the cache, which would be unsafe on
 * sites where `wpseo_titles` is filtered by a translation plugin such as WPML
 * (see Yoast/wordpress-seo#22549).
 */
class Logo_Meta_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * Logo_Meta_Watcher constructor.
	 *
	 * @param Image_Helper $image The image helper.
	 */
	public function __construct( Image_Helper $image ) {
		$this->image = $image;
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'pre_update_option_wpseo_titles', [ $this, 'ensure_logo_meta' ], 10, 2 );
	}

	/**
	 * Recomputes the logo `_meta` from `_id` on every `wpseo_titles` save.
	 *
	 * Exception: when the caller supplied a non-empty meta blob alongside an
	 * unchanged id (the AIOSEO importer's round-trip pattern), the supplied
	 * blob is respected. Comparing against `$old_value` is essential here:
	 * `WPSEO_Options::save_option` does a read-modify-write, so callers
	 * updating only `_id` arrive here with the previous attachment's meta
	 * still attached — without the id check, that stale blob would survive
	 * the supplied-meta branch.
	 *
	 * @param array<string, string|int|bool|array<string, string|int|bool>>|false $new_value The value about to be stored.
	 * @param array<string, string|int|bool|array<string, string|int|bool>>|false $old_value The value currently stored.
	 *
	 * @return array<string, string|int|bool|array<string, string|int|bool>>|false The — possibly repopulated — value to store.
	 */
	public function ensure_logo_meta( $new_value, $old_value = [] ) {
		if ( ! \is_array( $new_value ) ) {
			return $new_value;
		}
		if ( ! \is_array( $old_value ) ) {
			$old_value = [];
		}

		foreach ( [ 'company_logo', 'person_logo' ] as $prefix ) {
			$id_key   = $prefix . '_id';
			$meta_key = $prefix . '_meta';

			$new_id = isset( $new_value[ $id_key ] ) ? (int) $new_value[ $id_key ] : 0;
			if ( $new_id <= 0 ) {
				$new_value[ $meta_key ] = false;
				continue;
			}

			$old_id        = isset( $old_value[ $id_key ] ) ? (int) $old_value[ $id_key ] : 0;
			$supplied_meta = ( $new_value[ $meta_key ] ?? false );
			if ( $new_id === $old_id && \is_array( $supplied_meta ) && $supplied_meta !== [] ) {
				continue;
			}

			$computed               = $this->image->get_best_attachment_variation( $new_id );
			$new_value[ $meta_key ] = ( \is_array( $computed ) && $computed !== [] ) ? $computed : false;
		}

		return $new_value;
	}
}
