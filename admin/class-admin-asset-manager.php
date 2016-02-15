<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class registers all the necessary styles and scripts. Also has methods for the enqueing of scripts and styles. It automatically adds a prefix to the handle.
 */
class WPSEO_Admin_Asset_Manager {

	/**
	 *  Prefix for naming the assets.
	 */
	const PREFIX = 'yoast-seo-';

	/**
	 * Enqueues scripts.
	 *
	 * @param string $script The name of the script to enqueue.
	 */
	public function enqueue_script( $script ) {
		wp_enqueue_script( self::PREFIX . $script );
	}

	/**
	 * Enqueues styles.
	 *
	 * @param string $style The name of the style to enqueue.
	 */
	public function enqueue_style( $style ) {
		wp_enqueue_style( self::PREFIX . $style );
	}

	/**
	 * Registers scripts based on it's parameters.
	 *
	 * @param string       $handle The unique name of the registered script.
	 * @param string       $src The path to the script relative to the plugin JS root.
	 * @param string|array $deps Array of the handles of the registered scripts this script depends on.
	 * @param string       $ver The script version number.
	 * @param bool         $in_footer Option to have the script placed at the bottom of the body.
	 */
	protected function register_script( $handle, $src, $deps, $ver = WPSEO_VERSION, $in_footer = true ) {
		wp_register_script(
			self::PREFIX . $handle,
			plugins_url( 'js/' . $src . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ),
			$deps,
			$ver,
			$in_footer
		);
	}

	/**
	 * Registers styles based on it's parameters.
	 *
	 * @param string       $handle The unique name of the registered style.
	 * @param string       $src The path to the style relative to the plugin CSS root.
	 * @param string|array $deps Array of the handles of the registered style this style depends on.
	 * @param string       $ver The style version number.
	 */
	protected function register_style( $handle, $src, $deps = array(), $ver = WPSEO_VERSION ) {
		wp_register_style(
			self::PREFIX . $handle,
			plugins_url( 'css/' . $src . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ),
			$deps,
			$ver
		);
	}

	/**
	 * Calls the functions that register scripts and styles with the scripts and styles to be registered as arguments.
	 */
	public function register_assets() {
		$this->register_scripts( $this->scripts_to_be_registered() );
		$this->register_styles( $this->styles_to_be_registered() );
	}

	/**
	 * Registers all the scripts passed to it.
	 *
	 * @param array $scripts The scripts passed to it.
	 */
	protected function register_scripts( $scripts ) {
		foreach ( $scripts as $item ) {
			if ( ! isset( $item['version'] ) ) {
				$item['version'] = WPSEO_VERSION;
			}

			if ( ! isset( $item['in_footer'] ) ) {
				$item['in_footer'] = true;
			}
			$this->register_script(
				$item['name'],
				$item['src'],
				$item['deps'],
				$item['version'],
				$item['in_footer']
			);
		}
	}

	/**
	 * Registers all the styles it recieves.
	 *
	 * @param array $styles Styles that need to be registerd.
	 */
	protected function register_styles( $styles ) {
		foreach ( $styles as $item ) {
			if ( ! isset( $item['version'] ) ) {
				$item['version'] = WPSEO_VERSION;
			}
			$this->register_style(
				$item['name'],
				$item['src'],
				array(),
				$item['version']
			);
		}
	}

	/**
	 * Returns the scripts that need to be registered.
	 *
	 * @return array scripts that need to be registered.
	 */
	protected function scripts_to_be_registered() {
		return array(
			array(
				'name' => 'admin-script',
				'src'  => 'wp-seo-admin-306',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
				),
			),
			array(
				'name' => 'admin-media',
				'src'  => 'wp-seo-admin-media-302',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
				),
			),
			array(
				'name' => 'bulk-editor',
				'src'  => 'wp-seo-bulk-editor',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'export',
				'src'  => 'wp-seo-export-302',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'dismissible',
				'src'  => 'wp-seo-dismissible',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'admin-global-script',
				'src'  => 'wp-seo-admin-global-302',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'jquery-qtip',
				'src'  => 'jquery.qtip',
				'deps' => array( 'jquery' ),
				'ver'  => '2.2.1',
			),
			array(
				'name' => 'metabox',
				'src'  => 'wp-seo-metabox-302',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					self::PREFIX . 'jquery-qtip',
				),
				'inf' => false,
			),
			array(
				'name' => 'featured-image',
				'src'  => 'wp-seo-featured-image-302',
				'deps' => array(
					'jquery',
					self::PREFIX . 'yoast-seo',
				),
			),
			array(
				'name' => 'metabox-taxonomypage',
				'src'  => 'wp-seo-metabox-302',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-autocomplete',
				),
			),
			array(
				'name' => 'admin-gsc',
				'src'  => 'wp-seo-admin-gsc-302',
				'deps' => array( 'jquery' ),
				'ver'  => WPSEO_VERSION,
				'inf'  => false,
			),
			array(
				'name' => 'yoast-seo',
				'src'  => 'dist/yoast-seo/yoast-seo-307',
			),
			array(
				'name' => 'post-scraper',
				'src'  => 'wp-seo-post-scraper-305',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
					self::PREFIX . 'replacevar-plugin',
					self::PREFIX . 'shortcode-plugin',
				),
			),
			array(
				'name' => 'term-scraper',
				'src'  => 'wp-seo-term-scraper-305',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
					self::PREFIX . 'replacevar-plugin',
				),
			),
			array(
				'name' => 'replacevar-plugin',
				'src'  => 'wp-seo-replacevar-plugin-302',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
				),
			),
			array(
				'name' => 'shortcode-plugin',
				'src'  => 'wp-seo-shortcode-plugin-305',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
				),
			),
		);
	}

	/**
	 * Returns the styles that need to be registered.
	 *
	 * @return array styles that need to be registered.
	 */
	protected function styles_to_be_registered() {
		return array(
			array(
				'name' => 'admin-css',
				'src'  => 'yst_plugin_tools-302',
			),
			array(
				'name' => 'rtl',
				'src'  => 'wpseo-rtl',
			),
			array(
				'name' => 'dismissible',
				'src'  => 'wpseo-dismissible',
			),
			array(
				'name' => 'edit-page',
				'src'  => 'edit-page-302',
			),
			array(
				'name' => 'featured-image',
				'src'  => 'featured-image',
			),
			array(
				'name' => 'jquery-qtip.js',
				'src'  => 'jquery.qtip',
				'ver'  => '2.2.1',
			),
			array(
				'name' => 'metabox-css',
				'src'  => 'metabox-302',
			),
			array(
				'name' => 'wp-dashboard',
				'src'  => 'dashboard-305',
			),
			array(
				'name' => 'scoring',
				'src'  => 'yst_seo_score-302',
			),
			array(
				'name' => 'snippet',
				'src'  => 'snippet-307',
			),
			array(
				'name' => 'yoast-seo',
				'src'  => 'dist/yoast-seo/yoast-seo-307',
			),
			array(
				'name' => 'adminbar',
				'src'  => 'adminbar-302',
			),
		);
	}
}
