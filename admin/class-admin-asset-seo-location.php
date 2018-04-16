<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Determines the location of an asset within the SEO plugin.
 */
final class WPSEO_Admin_Asset_SEO_Location implements WPSEO_Admin_Asset_Location {

	/**
	 * @var string
	 */
	protected $plugin_file;

	/**
	 * The plugin file to base the asset location upon.
	 *
	 * @param string $plugin_file The plugin file string.
	 */
	public function __construct( $plugin_file ) {
		$this->plugin_file = $plugin_file;
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
		$path = $this->get_path( $asset, $type );
		if ( empty( $path ) ) {
			return '';
		}

		if ( YOAST_ENVIRONMENT !== 'development' && ! $asset->get_suffix() ) {
			$plugin_path = plugin_dir_path( $this->plugin_file );
			if ( ! file_exists( $plugin_path . $path ) ) {

				// Give a notice to the user in the console (only once).
				WPSEO_Utils::javascript_console_notification(
					'Development Files',
					sprintf(
						/* translators: %1$s resolves to https://github.com/Yoast/wordpress-seo */
						__( 'You are trying to load non-minified files. These are only available in our development package. Check out %1$s to see all the source files.', 'wordpress-seo' ),
						'https://github.com/Yoast/wordpress-seo'
					),
					true
				);

				// Just load the .min file.
				$path = $this->get_path( $asset, $type, '.min' );
			}
		}

		return plugins_url( $path, $this->plugin_file );
	}

	/**
	 * Determines the path relative to the plugin folder of an asset.
	 *
	 * @param WPSEO_Admin_Asset $asset        The asset to determine the path
	 *                                        for.
	 * @param string            $type         The type of asset.
	 * @param string|null       $force_suffix The suffix to force, or null when
	 *                                        to use the default suffix.
	 *
	 * @return string The path to the asset file.
	 */
	protected function get_path( WPSEO_Admin_Asset $asset, $type, $force_suffix = null ) {
		$relative_path = '';
		$rtl_suffix    = '';

		$suffix = ( $force_suffix === null ) ? $asset->get_suffix() : $force_suffix;

		switch ( $type ) {
			case WPSEO_Admin_Asset::TYPE_JS:
				$relative_path = 'js/dist/' . $asset->get_src() . $suffix . '.js';
				break;

			case WPSEO_Admin_Asset::TYPE_CSS:
				// Path and suffix for RTL stylesheets.
				if ( function_exists( 'is_rtl' ) && is_rtl() && $asset->has_rtl() ) {
					$rtl_suffix = '-rtl';
				}
				$relative_path = 'css/dist/' . $asset->get_src() . $rtl_suffix . $suffix . '.css';
				break;
		}

		return $relative_path;
	}
}
