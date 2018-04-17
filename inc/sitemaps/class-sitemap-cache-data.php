<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Sitemap Cache Data object, manages sitemap data stored in cache
 */
class WPSEO_Sitemap_Cache_Data implements WPSEO_Sitemap_Cache_Data_Interface, Serializable {

	/** @var string Sitemap XML data. */
	private $sitemap = '';

	/** @var string Status of the sitemap, usable or not. */
	private $status = self::UNKNOWN;

	/**
	 * Set the sitemap XML data
	 *
	 * @param string $sitemap XML Content of the sitemap.
	 */
	public function set_sitemap( $sitemap ) {

		if ( ! is_string( $sitemap ) ) {
			$sitemap = '';
		}

		$this->sitemap = $sitemap;

		/**
		 * Empty sitemap is not usable.
		 */
		if ( ! empty( $sitemap ) ) {
			$this->set_status( self::OK );
		}
		else {
			$this->set_status( self::ERROR );
		}
	}

	/**
	 * Set the status of the sitemap, is it usable.
	 *
	 * @param bool|string $valid Is the sitemap valid or not.
	 *
	 * @return void
	 */
	public function set_status( $valid ) {

		if ( self::OK === $valid ) {
			$this->status = self::OK;

			return;
		}

		if ( self::ERROR === $valid ) {
			$this->status  = self::ERROR;
			$this->sitemap = '';

			return;
		}

		$this->status = self::UNKNOWN;
	}

	/**
	 * Is the sitemap usable.
	 *
	 * @return bool True if usable, False if bad or unknown.
	 */
	public function is_usable() {

		return self::OK === $this->status;
	}

	/**
	 * Get the XML content of the sitemap.
	 *
	 * @return string The content of the sitemap.
	 */
	public function get_sitemap() {

		return $this->sitemap;
	}

	/**
	 * Get the status of the sitemap.
	 *
	 * @return string Status of the sitemap, 'ok'/'error'/'unknown'
	 */
	public function get_status() {

		return $this->status;
	}

	/**
	 * String representation of object
	 *
	 * @link  http://php.net/manual/en/serializable.serialize.php
	 * @return string the string representation of the object or null
	 * @since 5.1.0
	 */
	public function serialize() {

		$data = array(
			'status' => $this->status,
			'xml'    => $this->sitemap,
		);

		return serialize( $data );
	}

	/**
	 * Constructs the object
	 *
	 * @link  http://php.net/manual/en/serializable.unserialize.php
	 *
	 * @param string $serialized The string representation of the object.
	 *
	 * @return void
	 * @since 5.1.0
	 */
	public function unserialize( $serialized ) {

		$data = unserialize( $serialized );
		$this->set_sitemap( $data['xml'] );
		$this->set_status( $data['status'] );
	}
}
