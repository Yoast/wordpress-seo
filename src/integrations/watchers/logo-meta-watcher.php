<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Stores the ID and the meta of the logos in the titles option whenever that option is saved.
 */
class Logo_Meta_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The settings that hold a logo.
	 */
	private const LOGO_SETTINGS = [ 'company_logo', 'person_logo' ];

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image_helper;

	/**
	 * Logo_Meta_Watcher constructor.
	 *
	 * @param Image_Helper $image_helper The image helper.
	 */
	public function __construct( Image_Helper $image_helper ) {
		$this->image_helper = $image_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Runs before the default priority, at which translation plugins restore the values that were not changed.
		\add_filter( 'pre_update_option_wpseo_titles', [ $this, 'add_logo_meta' ], 9, 2 );
	}

	/**
	 * Adds the ID and the meta of the logos to the titles option that is about to be saved.
	 *
	 * @param array<string, string|int|bool|array<string, string|int>>|bool $new_value The titles option that is about to be saved.
	 * @param array<string, string|int|bool|array<string, string|int>>|bool $old_value The titles option before the save.
	 *
	 * @return array<string, string|int|bool|array<string, string|int>>|bool The titles option, with the ID and the meta of each logo it holds.
	 */
	public function add_logo_meta( $new_value, $old_value = [] ) {
		if ( ! \is_array( $new_value ) ) {
			return $new_value;
		}

		foreach ( self::LOGO_SETTINGS as $setting ) {
			$new_value = $this->add_id_of_logo( $new_value, $old_value, $setting );
			$new_value = $this->add_meta_of_logo( $new_value, $setting );
		}

		return $new_value;
	}

	/**
	 * Adds the ID of a logo that only has a URL, unless this save is the one that removes the ID.
	 *
	 * @param array<string, string|int|bool|array<string, string|int>>      $new_value The titles option that is about to be saved.
	 * @param array<string, string|int|bool|array<string, string|int>>|bool $old_value The titles option before the save.
	 * @param string                                                        $setting   The setting that holds the logo.
	 *
	 * @return array<string, string|int|bool|array<string, string|int>> The titles option.
	 */
	private function add_id_of_logo( array $new_value, $old_value, $setting ) {
		$had_logo_id = \is_array( $old_value ) && (int) ( $old_value[ $setting . '_id' ] ?? 0 ) > 0;
		$logo_url    = ( $new_value[ $setting ] ?? '' );

		if ( $had_logo_id || (int) ( $new_value[ $setting . '_id' ] ?? 0 ) > 0 || ! \is_string( $logo_url ) || $logo_url === '' ) {
			return $new_value;
		}

		$logo_id = (int) $this->image_helper->get_attachment_by_url( $logo_url, false );
		if ( $logo_id > 0 ) {
			$new_value[ $setting . '_id' ] = $logo_id;
		}

		return $new_value;
	}

	/**
	 * Adds the meta of a logo that has none or that has the meta of another image, and removes the meta when there is no logo.
	 *
	 * @param array<string, string|int|bool|array<string, string|int>> $new_value The titles option that is about to be saved.
	 * @param string                                                   $setting   The setting that holds the logo.
	 *
	 * @return array<string, string|int|bool|array<string, string|int>> The titles option.
	 */
	private function add_meta_of_logo( array $new_value, $setting ) {
		$logo_id   = (int) ( $new_value[ $setting . '_id' ] ?? 0 );
		$logo_meta = ( $new_value[ $setting . '_meta' ] ?? false );

		if ( $logo_id > 0 && $this->is_meta_of_logo( $logo_meta, $logo_id ) ) {
			return $new_value;
		}

		$best_variation = ( $logo_id > 0 ) ? $this->image_helper->get_best_attachment_variation( $logo_id ) : false;

		if ( \is_array( $best_variation ) ) {
			$new_value[ $setting . '_meta' ] = $this->match_scheme_of_request( $best_variation );
		}
		elseif ( ! empty( $logo_meta ) ) {
			$new_value[ $setting . '_meta' ] = false;
		}

		return $new_value;
	}

	/**
	 * Checks whether the given meta belongs to the given logo.
	 *
	 * @param array<string, string|int>|bool $logo_meta The meta to check.
	 * @param int                            $logo_id   The attachment ID of the logo.
	 *
	 * @return bool Whether the meta belongs to the logo.
	 */
	private function is_meta_of_logo( $logo_meta, $logo_id ) {
		return \is_array( $logo_meta ) && isset( $logo_meta['id'] ) && (int) $logo_meta['id'] === $logo_id;
	}

	/**
	 * Gives the image URL the scheme WordPress gives it on the frontend of a site that is served over HTTPS.
	 *
	 * @param array<string, string|int> $image_meta The image meta.
	 *
	 * @return array<string, string|int> The image meta.
	 */
	private function match_scheme_of_request( array $image_meta ) {
		if ( isset( $image_meta['url'] ) && \is_ssl() ) {
			$image_meta['url'] = \set_url_scheme( $image_meta['url'] );
		}

		return $image_meta;
	}
}
