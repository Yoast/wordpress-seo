<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents a way to determine the analysis worker asset location.
 */
final class WPSEO_Admin_Asset_Analysis_Worker_Location implements WPSEO_Admin_Asset_Location {

	/**
	 * @var WPSEO_Admin_Asset_Location $asset_location.
	 */
	private $asset_location;

	/**
	 * @var WPSEO_Admin_Asset $asset.
	 */
	private $asset;

	/**
	 * Constructs the location of the analysis worker asset.
	 *
	 * @param string $flat_version The flat version of the asset.
	 * @param string $name         The name of the analysis worker asset.
	 */
	public function __construct( $flat_version = '', $name = 'analysis-worker' ) {
		if ( $flat_version === '' ) {
			$asset_manager = new WPSEO_Admin_Asset_Manager();
			$flat_version  = $asset_manager->flatten_version( WPSEO_VERSION );
		}

		$analysis_worker = 'wp-seo-' . $name . '-' . $flat_version;
		if ( $name === 'analysis-worker' && WPSEO_Recalibration_Beta::is_enabled() ) {
			/*
			 * Using a flag to determine whether the local file or the proxy is used.
			 * This is for the recalibration development.
			 */
			$analysis_worker = 'wp-seo-' . $name . '-recalibration-' . $flat_version;
			if ( ! $this->use_recalibration_local_file() ) {
				$analysis_worker = admin_url( 'admin.php?page=wpseo_myyoast_proxy&file=research-webworker&plugin_version=' . $flat_version );
			}
		}

		$this->asset_location = WPSEO_Admin_Asset_Manager::create_default_location();
		$this->asset          = new WPSEO_Admin_Asset(
			array(
				'name' => $name,
				'src'  => $analysis_worker,
			)
		);
	}

	/**
	 * Retrieves the analysis worker asset.
	 *
	 * @return WPSEO_Admin_Asset The analysis worker asset.
	 */
	public function get_asset() {
		return $this->asset;
	}

	/**
	 * Determines the URL of the asset on the dev server.
	 *
	 * @param WPSEO_Admin_Asset $asset The asset to determine the URL for.
	 * @param string            $type  The type of asset. Usually JS or CSS.
	 *
	 * @return string The URL of the asset.
	 */
	public function get_url( WPSEO_Admin_Asset $asset, $type ) {
		$scheme = wp_parse_url( $asset->get_src(), PHP_URL_SCHEME );
		if ( in_array( $scheme, array( 'http', 'https' ), true ) ) {
			return $asset->get_src();
		}

		return $this->asset_location->get_url( $asset, $type );
	}

	/**
	 * Checks if the recalibration beta should use the local file.
	 *
	 * If false, the my-yoast-proxy should be used.
	 *
	 * @return bool Whether the local file should be used.
	 */
	protected function use_recalibration_local_file() {
		return defined( 'YOAST_SEO_RECALIBRATION_USE_LOCAL_FILE' ) && YOAST_SEO_RECALIBRATION_USE_LOCAL_FILE;
	}
}
