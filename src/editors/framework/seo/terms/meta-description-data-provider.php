<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Editors\Framework\Seo\Terms;

use Yoast\WP\SEO\Editors\Domain\Seo\Meta_Description;
use Yoast\WP\SEO\Editors\Domain\Seo\Seo_Plugin_Data_Interface;
use Yoast\WP\SEO\Editors\Framework\Seo\Meta_Description_Data_Provider_Interface;
/**
 * Describes if the meta description SEO data.
 */
class Meta_Description_Data_Provider extends Abstract_Term_Seo_Data_Provider implements Meta_Description_Data_Provider_Interface {

	/**
	 * Retrieves the meta description template.
	 *
	 * @return string The meta description template.
	 */
	public function get_meta_description_template(): string {
		return $this->get_template( 'metadesc' );
	}

	/**
	 * Determines the date to be displayed in the snippet preview.
	 *
	 * @return string
	 */
	public function get_meta_description_date(): string {
		return '';
	}

	/**
	 * Method to return the Meta_Description domain object with SEO data.
	 *
	 * @return Seo_Plugin_Data_Interface The specific seo data.
	 */
	public function get_data(): Seo_Plugin_Data_Interface {
		return new Meta_Description( $this->get_meta_description_date(), $this->get_meta_description_template() );
	}
}
