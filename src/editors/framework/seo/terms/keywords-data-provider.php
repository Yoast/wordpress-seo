<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Editors\Framework\Seo\Terms;

use WPSEO_Taxonomy_Meta;
use Yoast\WP\SEO\Editors\Domain\Seo\Keywords;
use Yoast\WP\SEO\Editors\Domain\Seo\Seo_Plugin_Data_Interface;
use Yoast\WP\SEO\Editors\Framework\Seo\Keywords_Interface;
/**
 * Describes if the keyword SEO data.
 */
class Keywords_Data_Provider extends Abstract_Term_Seo_Data_Provider implements Keywords_Interface {

	/**
	 * Counting the number of given keyword used for other term than given term_id.
	 *
	 * @return array<string>
	 */
	public function get_focus_keyword_usage(): array {
		$focuskw = WPSEO_Taxonomy_Meta::get_term_meta( $this->term, $this->term->taxonomy, 'focuskw' );

		return WPSEO_Taxonomy_Meta::get_keyword_usage( $focuskw, $this->term->term_id, $this->term->taxonomy );
	}

	/**
	 * Method to return the Keyword domain object with SEO data.
	 *
	 * @return Seo_Plugin_Data_Interface The specific seo data.
	 */
	public function get_data(): Seo_Plugin_Data_Interface {
		$keyword_usage = $this->get_focus_keyword_usage();
		return new Keywords( $keyword_usage, [] );
	}
}
