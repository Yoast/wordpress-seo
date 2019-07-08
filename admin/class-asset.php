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

	/**
	 * Constant used to identify file type as a JS file.
	 *
	 * @var string
	 */
	const TYPE_JS = 'js';

	/**
	 * Constant used to identify file type as a CSS file.
	 *
	 * @var string
	 */
	const TYPE_CSS = 'css';

	/**
	 * @var string
	 */
	const NAME = 'name';

	/**
	 * @var string
	 */
	const SRC = 'src';

	/**
	 * @var string
	 */
	const DEPS = 'deps';

	/**
	 * @var string
	 */
	const VERSION = 'version';

	/* Style specific. */

	/**
	 * @var string
	 */
	const MEDIA = 'media';

	/**
	 * @var string
	 */
	const RTL = 'rtl';

	/* Script specific. */

	/**
	 * @var string
	 */
	const IN_FOOTER = 'in_footer';

	/**
	 * Asset identifier.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * Path to the asset.
	 *
	 * @var string
	 */
	protected $src;

	/**
	 * Asset dependencies.
	 *
	 * @var string|array
	 */
	protected $deps;

	/**
	 * Asset version.
	 *
	 * @var string
	 */
	protected $version;

	/**
	 * For CSS Assets. The type of media for which this stylesheet has been defined.
	 *
	 * See https://www.w3.org/TR/CSS2/media.html#media-types.
	 *
	 * @var string
	 */
	protected $media;

	/**
	 * For JS Assets. Whether or not the script should be loaded in the footer.
	 *
	 * @var boolean
	 */
	protected $in_footer;

	/**
	 * For CSS Assets. Whether this stylesheet is a right-to-left stylesheet.
	 *
	 * @var boolean
	 */
	protected $rtl;

	/**
	 * File suffix.
	 *
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
	 * Returns the asset identifier.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Returns the path to the asset.
	 *
	 * @return string
	 */
	public function get_src() {
		return $this->src;
	}

	/**
	 * Returns the asset dependencies.
	 *
	 * @return array|string
	 */
	public function get_deps() {
		return $this->deps;
	}

	/**
	 * Returns the asset version.
	 *
	 * @return string
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Returns the media type for CSS assets.
	 *
	 * @return string
	 */
	public function get_media() {
		return $this->media;
	}

	/**
	 * Returns whether a script asset should be loaded in the footer of the page.
	 *
	 * @return boolean
	 */
	public function is_in_footer() {
		return $this->in_footer;
	}

	/**
	 * Returns whether this CSS has a RTL counterpart.
	 *
	 * @return boolean
	 */
	public function has_rtl() {
		return $this->rtl;
	}

	/**
	 * Returns the file suffix.
	 *
	 * @return string
	 */
	public function get_suffix() {
		return $this->suffix;
	}

	/**
	 * Returns the full URL for this asset based on the path to the plugin file.
	 *
	 * @deprecated 6.2
	 * @codeCoverageIgnore
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
