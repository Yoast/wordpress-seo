<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents a WPSEO asset
 */
class WPSEO_Admin_Asset {

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
		), $args );

		$this->name = $args['name'];
		$this->src = $args['src'];
		$this->deps = $args['deps'];
		$this->version = $args['version'];
		$this->media = $args['media'];
		$this->in_footer = $args['in_footer'];
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
}
