<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the classifier for a link. Determines of a link is an outbound or internal one.
 */
class WPSEO_Link_Type_Classifier {

	const TYPE_OUTBOUND = 'outbound';
	const TYPE_INTERNAL = 'internal';

	/** @var string */
	protected $home_url;

	/**
	 * Constructor setting the home url
	 *
	 * @param string $home_url The home url to set.
	 */
	public function __construct( $home_url ) {
		$this->home_url = $home_url;
	}

	/**
	 * Determines if the given link is an outbound or an internal link.
	 *
	 * @param string $link The link to classify.
	 *
	 * @return string Returns outbound or internal.
	 */
	public function classify( $link ) {
		if ( $this->contains_protocol( $link ) && $this->is_outbound_link( $link ) ) {
			return self::TYPE_OUTBOUND;
		}

		return self::TYPE_INTERNAL;
	}

	/**
	 * Returns true when the link contains https:// or http://
	 *
	 * @param string $link The link to check.
	 *
	 * @return bool True if the url contains a protocol.
	 */
	private function contains_protocol( $link ) {
		return strstr( $link, 'https://' ) || strstr( $link, 'http://' );
	}

	/**
	 * Checks if the link contains the home_url. Returns true if this isn't the case.
	 *
	 * @param string $link The link to check.
	 *
	 * @return bool True when the link doesn't contain the home url.
	 */
	private function is_outbound_link( $link ) {
		return ( strstr( $link, $this->home_url ) === false );
	}
}
