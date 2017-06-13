<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the classifier for a link. Determines of a link is an outbound or internal one.
 */
class WPSEO_Link_Type_Classifier {

	const TYPE_EXTERNAL = 'external';
	const TYPE_INTERNAL = 'internal';

	/** @var string */
	protected $base_url = '';

	/**
	 * Constructor setting the base url
	 *
	 * @param string $base_url The base url to set.
	 */
	public function __construct( $base_url ) {
		$this->base_url = $base_url;
	}

	/**
	 * Determines if the given link is an outbound or an internal link.
	 *
	 * @param string $link The link to classify.
	 *
	 * @return string Returns outbound or internal.
	 */
	public function classify( $link ) {
		if ( $this->contains_protocol( $link ) && $this->is_external_link( $link ) ) {
			return self::TYPE_EXTERNAL;
		}

		return self::TYPE_INTERNAL;
	}

	/**
	 * Returns true when the link starts with https:// or http://
	 *
	 * @param string $link The link to check.
	 *
	 * @return bool True if the url starts with a protocol.
	 */
	protected function contains_protocol( $link ) {
		return strpos( $link, 'https://' ) === 0 || strpos( $link, 'http://' ) === 0;
	}

	/**
	 * Checks if the link contains the home_url. Returns true if this isn't the case.
	 *
	 * @param string $link The link to check.
	 *
	 * @return bool True when the link doesn't contain the home url.
	 */
	protected function is_external_link( $link ) {
		return ( strpos( $link, $this->base_url ) === false );
	}
}
