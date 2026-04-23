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
		\add_filter( 'pre_update_option_wpseo_titles', [ $this, 'ensure_logo_meta' ], 10, 1 );
	}

	/**
	 * Repopulates the company and person logo meta entries so they match the
	 * corresponding attachment ids in the value about to be stored.
	 *
	 * Runs on the `pre_update_option_wpseo_titles` filter so the computed
	 * meta lands in the same database write.
	 *
	 * @param array<string, string|int|bool|array<string, string|int|bool>>|false $new_value The value about to be stored.
	 *
	 * @return array<string, string|int|bool|array<string, string|int|bool>>|false The — possibly repopulated — value to store.
	 */
	public function ensure_logo_meta( $new_value ) {
		if ( ! \is_array( $new_value ) ) {
			return $new_value;
		}

		foreach ( [ 'company_logo', 'person_logo' ] as $prefix ) {
			$id_key   = $prefix . '_id';
			$meta_key = $prefix . '_meta';

			$new_id = isset( $new_value[ $id_key ] ) ? (int) $new_value[ $id_key ] : 0;
			if ( $new_id <= 0 ) {
				// No attachment selected — make sure no stale meta is kept.
				$new_value[ $meta_key ] = false;
				continue;
			}

			$supplied_meta = ( $new_value[ $meta_key ] ?? false );
			if ( \is_array( $supplied_meta ) && $supplied_meta !== [] ) {
				// The caller supplied a meta blob explicitly — respect it.
				continue;
			}

			$computed               = $this->image->get_best_attachment_variation( $new_id );
			$new_value[ $meta_key ] = ( \is_array( $computed ) && $computed !== [] ) ? $computed : false;
		}

		return $new_value;
	}
}
