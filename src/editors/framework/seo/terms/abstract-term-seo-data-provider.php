<?php

namespace Yoast\WP\SEO\Editors\Framework\Seo\Terms;

abstract class Abstract_Term_Seo_Data_Provider {

	/**
	 * The term the metabox formatter is for.
	 *
	 * @var \WP_Term
	 */
	protected $term;

	/**
	 * @param \WP_Term $term The term.
	 */
	public function __construct( $term ) {
		$this->term = $term;
	}


}
