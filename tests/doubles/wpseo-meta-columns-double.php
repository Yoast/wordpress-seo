<?php
/**
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Meta_Columns_Double extends WPSEO_Meta_Columns {
	public function determine_seo_filters( $seo_filter ) {
		return parent::determine_seo_filters( $seo_filter );
	}

	public function determine_readability_filters( $readability_filter ) {
		return parent::determine_readability_filters( $readability_filter );
	}

	public function is_valid_filter( $filter ) {
		return parent::is_valid_filter( $filter );
	}

	public function build_filter_query( $vars, $filter ) {
		return parent::build_filter_query( $vars, $filter );
	}
}
