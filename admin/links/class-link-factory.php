<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the conversion from array with string links into WPSEO_Link objects.
 */
class WPSEO_Link_Factory {

	/**
	 * @var WPSEO_Link_Type_Classifier
	 */
	protected $classifier;

	/**
	 * @var WPSEO_Link_Internal_Lookup
	 */
	protected $internal_lookup;

	/**
	 * @var WPSEO_Link_Filter
	 */
	protected $filter;

	/**
	 * Sets the dependencies for this object.
	 *
	 * @param WPSEO_Link_Type_Classifier $classifier      The classifier to use.
	 * @param WPSEO_Link_Internal_Lookup $internal_lookup The internal lookup to use.
	 * @param WPSEO_Link_Filter          $filter          The link filter.
	 */
	public function __construct( WPSEO_Link_Type_Classifier $classifier, WPSEO_Link_Internal_Lookup $internal_lookup, WPSEO_Link_Filter $filter ) {
		$this->classifier      = $classifier;
		$this->internal_lookup = $internal_lookup;
		$this->filter          = $filter;
	}

	/**
	 * Formats an array of links to WPSEO_Link object.
	 *
	 * @param array $extracted_links The links for format.
	 *
	 * @return WPSEO_Link[] The formatted links.
	 */
	public function build( array $extracted_links ) {
		$extracted_links = array_map( array( $this, 'build_link' ), $extracted_links );
		$filtered_links  = array_filter(
			$extracted_links,
			array( $this->filter, 'internal_link_with_fragment_filter' )
		);

		return $filtered_links;
	}

	/**
	 * Builds the link.
	 *
	 * @param string $link The link to build.
	 *
	 * @return WPSEO_Link The built link.
	 */
	public function build_link( $link ) {
		$link_type = $this->classifier->classify( $link );

		$target_post_id = 0;
		if ( $link_type === WPSEO_Link::TYPE_INTERNAL ) {
			$target_post_id = $this->internal_lookup->lookup( $link );
		}

		return self::get_link( $link, $target_post_id, $link_type );
	}

	/**
	 * Returns the link object.
	 *
	 * @param string $url            The URL of the link.
	 * @param int    $target_post_id The target post ID.
	 * @param string $type           The link type.
	 *
	 * @return WPSEO_Link Generated link object.
	 */
	public static function get_link( $url, $target_post_id, $type ) {
		return new WPSEO_Link( $url, $target_post_id, $type );
	}
}
