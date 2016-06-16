<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents a WPSEO asset
 */
class WPSEO_Admin_Asset {

	const TYPE_JS = 'js';
	const TYPE_CSS = 'css';

	const NAME = 'name';
	const SRC = 'src';
	const DEPS = 'deps';
	const VERSION = 'version';

	// Style specific.
	const MEDIA = 'media';

	// Script specififc.
	const IN_FOOTER = 'in_footer';

	/**
	 * @var string
	 */
	protected $name;

	/**
	 * @var string
	 */
	protected $src;

	/**
	 * @var string|array
	 */
	protected $deps;

	/**
	 * @var string
	 */
	protected $version;

	/**
	 * @var string
	 */
	protected $media;

	/**
	 * @var boolean
	 */
	protected $in_footer;

	/**
	 * @var string
	 */
	protected $suffix;

	/**
	 * @param array $args The arguments for this asset.
	 *
	 * @throws InvalidArgumentException Throws when no name or src has been provided.
	 */
	public function __construct( array $args ) {
		if ( ! isset( $args['name'] ) ) {
			throw new InvalidArgumentException( 'name is a required argument' );
		}

		if ( ! isset( $args['src'] ) ) {
			throw new InvalidArgumentException( 'src is a required argument' );
		}

		$args = array_merge( array(
			'deps'      => array(),
			'version'   => WPSEO_VERSION,
			'in_footer' => true,
			'media'     => 'all',
			'suffix'    => WPSEO_CSSJS_SUFFIX,
		), $args );

		$this->name = $args['name'];
		$this->src = $args['src'];
		$this->deps = $args['deps'];
		$this->version = $args['version'];
		$this->media = $args['media'];
		$this->in_footer = $args['in_footer'];
		$this->suffix = $args['suffix'];
	}

	/**
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * @return string
	 */
	public function get_src() {
		return $this->src;
	}

	/**
	 * @return array|string
	 */
	public function get_deps() {
		return $this->deps;
	}

	/**
	 * @return string
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * @return string
	 */
	public function get_media() {
		return $this->media;
	}

	/**
	 * @return boolean
	 */
	public function is_in_footer() {
		return $this->in_footer;
	}

	/**
	 * @return string
	 */
	public function get_suffix() {
		return $this->suffix;
	}

	/**
	 * Returns the full URL for this asset based on the path to the plugin file.
	 *
	 * @param string $type Type of asset.
	 * @param string $plugin_file Absolute path to the plugin file.
	 * @return string The full URL to the asset.
	 */
	public function get_url( $type, $plugin_file ) {

		$relative_file = $this->get_relative_file( $type );
		if ( empty( $relative_file ) ) {
			return '';
		}

		if ( ! $this->get_suffix() ) {

			$plugin_path = plugin_dir_path( $plugin_file );

			if ( ! file_exists( $plugin_path . $relative_file ) ) {

				// Give a notice to the user in the console (only once)
				WPSEO_Utils::javascript_console_notification(
					'Development Files',
					'You are trying to load non-minified files, these are only available in our development package. Check out https://github.com/Yoast/wordpress-seo to see all the source files.',
					true
				);

				// Just load the .min
				$relative_file = $this->get_relative_file( $type, '.min' );
			}
		}

		return plugins_url( $relative_file, $plugin_file );
	}

	/**
	 * Get the relative file for this asset
	 *
	 * @param string $type Type of this asset.
	 * @param null $force_suffix Force use suffix.
	 *
	 * @return string
	 */
	protected function get_relative_file( $type, $force_suffix = null ) {
		$relative_file = '';

		$suffix = ( is_null( $force_suffix ) ) ? $this->get_suffix() : $force_suffix;

		switch ( $type ) {
			case self::TYPE_JS:
				$relative_file = 'js/dist/' . $this->get_src() . $suffix . '.js';
				break;

			case self::TYPE_CSS:
				$relative_file = 'css/' . $this->get_src() . $suffix . '.css';
				break;
		}

		return $relative_file;
	}
}
