<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Hold_Back_Premium_Update_Conditional;

/**
 * Hides the Yoast SEO Premium update while a compatible Yoast SEO version is not yet available to the site.
 *
 * Yoast SEO Premium x.y requires Yoast SEO x.y. When the Premium version offered by the My Yoast API is ahead of the
 * latest Yoast SEO version the site can currently see, this integration moves the Premium entry out of the available
 * updates, mirroring how WordPress core silently holds back updates. It runs after the add-on manager has populated
 * the update list and never modifies the add-on manager itself.
 */
class Hold_Back_Premium_Update implements Integration_Interface {

	/**
	 * The My Yoast slug of Yoast SEO Premium.
	 *
	 * @var string
	 */
	private const PREMIUM_SLUG = 'yoast-seo-wordpress-premium';

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ Hold_Back_Premium_Update_Conditional::class ];
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Priority 11 so this runs after the add-on manager has populated the update list at the default priority.
		\add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'hold_back_premium_update' ], 11 );
	}

	/**
	 * Hides the Premium update when its version is ahead of the latest Yoast SEO version the site can see.
	 *
	 * Patch releases (x.y.z) do not tighten the requirement, so only the major and minor components are compared.
	 *
	 * @param mixed $data The value of the update_plugins site transient.
	 *
	 * @return mixed The (possibly adjusted) transient value.
	 */
	public function hold_back_premium_update( $data ) {
		if ( ! \is_object( $data ) || empty( $data->response ) || ! \is_array( $data->response ) ) {
			return $data;
		}

		$free_version = $this->get_latest_free_version( $data );
		if ( $free_version === null ) {
			return $data;
		}

		foreach ( $data->response as $plugin_file => $plugin_data ) {
			if ( ! isset( $plugin_data->slug, $plugin_data->new_version ) || $plugin_data->slug !== self::PREMIUM_SLUG ) {
				continue;
			}

			if ( ! $this->is_ahead_of_free( $plugin_data->new_version, $free_version ) ) {
				continue;
			}

			if ( ! isset( $data->no_update ) || ! \is_array( $data->no_update ) ) {
				$data->no_update = [];
			}

			$data->no_update[ $plugin_file ] = $plugin_data;
			unset( $data->response[ $plugin_file ] );
		}

		return $data;
	}

	/**
	 * Reads the latest available Yoast SEO version from the update list.
	 *
	 * @param object $data The update_plugins transient value.
	 *
	 * @return string|null The latest Yoast SEO version, or null when it is unknown.
	 */
	private function get_latest_free_version( $data ) {
		foreach ( [ 'response', 'no_update' ] as $bucket ) {
			if ( isset( $data->{$bucket}[ \WPSEO_BASENAME ]->new_version ) ) {
				return $data->{$bucket}[ \WPSEO_BASENAME ]->new_version;
			}
		}

		return null;
	}

	/**
	 * Determines whether an add-on version is ahead of the Yoast SEO version by major.minor.
	 *
	 * @param string $addon_version The add-on version offered by the My Yoast API.
	 * @param string $free_version  The latest available Yoast SEO version.
	 *
	 * @return bool True when the add-on is ahead of Yoast SEO.
	 */
	private function is_ahead_of_free( $addon_version, $free_version ) {
		$addon_major_minor = $this->get_major_minor( $addon_version );
		$free_major_minor  = $this->get_major_minor( $free_version );

		if ( $addon_major_minor === null || $free_major_minor === null ) {
			return false;
		}

		return \version_compare( $addon_major_minor, $free_major_minor, '>' );
	}

	/**
	 * Extracts the major.minor part of a version string, ignoring any patch or pre-release suffix.
	 *
	 * @param string $version The version string.
	 *
	 * @return string|null The major.minor version, or null when it cannot be determined.
	 */
	private function get_major_minor( $version ) {
		if ( ! \is_string( $version ) || ! \preg_match( '/^(\d+)\.(\d+)/', $version, $matches ) ) {
			return null;
		}

		return $matches[1] . '.' . $matches[2];
	}
}
