<?php

namespace Yoast\WP\SEO\Editors\Framework\Seo\Terms;

use WPSEO_Meta;
use WPSEO_Taxonomy_Meta;
use Yoast\WP\SEO\Editors\Framework\Seo\Keywords_Interface;
use function apply_filters;

class Keywords_Data_Provider extends Abstract_Term_Seo_Data_Provider implements Keywords_Interface {

	/**
	 * Counting the number of given keyword used for other term than given term_id.
	 *
	 * @return array
	 */
	public function get_focus_keyword_usage(): array  {
		$focuskw = WPSEO_Taxonomy_Meta::get_term_meta( $this->term, $this->term->taxonomy, 'focuskw' );

		return WPSEO_Taxonomy_Meta::get_keyword_usage( $focuskw, $this->term->term_id, $this->term->taxonomy );
	}

}
