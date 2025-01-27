<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Search_Rankings;

use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Interface;
use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Interface;

/**
 * Domain object that represents a single Top Page Data record.
 */
class Top_Page_Data implements Data_Interface {

	/**
	 * The search data for the top page.
	 *
	 * @var Search_Data $search_data
	 */
	private $search_data;

	/**
	 * The SEO score group the top page belongs to.
	 *
	 * @var SEO_Score_Groups_Interface
	 */
	private $seo_score_group;

	/**
	 * The constructor.
	 *
	 * @param Search_Data                $search_data     The search data for the top page.
	 * @param SEO_Score_Groups_Interface $seo_score_group The SEO score group the top page belongs to.
	 */
	public function __construct( Search_Data $search_data, SEO_Score_Groups_Interface $seo_score_group ) {
		$this->search_data     = $search_data;
		$this->seo_score_group = $seo_score_group;
	}

	/**
	 * The array representation of this domain object.
	 *
	 * @return array<string|float|int|string[]>
	 */
	public function to_array(): array {
		$top_page_data             = $this->search_data->to_array();
		$top_page_data['seoScore'] = $this->seo_score_group->get_name();

		return $top_page_data;
	}
}
