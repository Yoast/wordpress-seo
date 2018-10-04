<?php
/**
 * WPSEO plugin file.
 *
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
	const RTL = 'rtl';

	// Script specific.
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
	 * @var boolean
	 */
	protected $rtl;

	/**
	 * @var string
	 */
	protected $suffix;

	/**
	 * Default asset arguments.
	 *
	 * @var array
	 */
	private $defaults = array(
		'deps'      => array(),
		'version'   => WPSEO_VERSION,
		'in_footer' => true,
		'rtl'       => true,
		'media'     => 'all',
		'suffix'    => WPSEO_CSSJS_SUFFIX,
	);

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

		$args = array_merge( $this->defaults, $args );

		$this->name      = $args['name'];
		$this->src       = $args['src'];
		$this->deps      = $args['deps'];
		$this->version   = $args['version'];
		$this->media     = $args['media'];
		$this->in_footer = $args['in_footer'];
		$this->rtl       = $args['rtl'];
		$this->suffix    = $args['suffix'];
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
	 * @return boolean
	 */
	public function has_rtl() {
		return $this->rtl;
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
	 * @param string $type        Type of asset.
	 * @param string $plugin_file Absolute path to the plugin file.
	 *
	 * @return string The full URL to the asset.
	 */
	public function get_url( $type, $plugin_file ) {
		_deprecated_function( __CLASS__ . '::get_url', '6.2', 'WPSEO_Admin_Asset_SEO_Location::get_url' );

		$asset_location = new WPSEO_Admin_Asset_SEO_Location( $plugin_file );

		return $asset_location->get_url( $this, $type );
	}
}
