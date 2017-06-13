<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the conversion from array with string links into WPSEO_Link objects.
 */
class WPSEO_Link_Processor {

	/** @var WPSEO_Link_Type_Classifier */
	protected $classifier;

	/** @var WPSEO_Link_Populator */
	protected $populator;

	/**
	 * Sets the dependencies for this object.
	 *
	 * @param WPSEO_Link_Type_Classifier $classifier The classifier to use.
	 * @param WPSEO_Link_Populator       $populator  The populator to use.
	 */
	public function __construct( WPSEO_Link_Type_Classifier $classifier, WPSEO_Link_Populator $populator ) {
		$this->classifier = $classifier;
		$this->populator  = $populator;
	}

	/**
	 * Formats an array of links to WPSEO_Link object.
	 *
	 * @param array $extracted_links The links for format.
	 * @param int   $post_id         The post id.
	 *
	 * @return WPSEO_Link[] The formatted links.
	 */
	public function process( array $extracted_links, $post_id ) {
		$links = array();
		foreach ( $extracted_links as $extracted_link ) {
			$link_type = $this->classifier->classify( $extracted_link );
			$target_post_id = $this->populator->populate( $extracted_link, $link_type );

			$links[] = new WPSEO_Link( $extracted_link, $post_id, $target_post_id, $link_type );
		}

		return $links;
	}
}
