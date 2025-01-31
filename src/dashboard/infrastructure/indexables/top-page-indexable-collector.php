<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Dashboard\Infrastructure\Indexables;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Data_Provider\Data_Container;
use Yoast\WP\SEO\Dashboard\Domain\Search_Rankings\Top_Page_Data;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The indexable collector that gets SEO scores from the indexables of top pages.
 */
class Top_Page_Indexable_Collector {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository $indexable_repository
	 */
	private $indexable_repository;

	/**
	 * The SEO score groups repository.
	 *
	 * @var SEO_Score_Groups_Repository $seo_score_groups_repository
	 */
	private $seo_score_groups_repository;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository        $indexable_repository        The indexable repository.
	 * @param SEO_Score_Groups_Repository $seo_score_groups_repository The SEO score groups repository.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		SEO_Score_Groups_Repository $seo_score_groups_repository
	) {
		$this->indexable_repository        = $indexable_repository;
		$this->seo_score_groups_repository = $seo_score_groups_repository;
	}

	/**
	 * Gets SEO scores for top pages.
	 *
	 * @param Data_Container $top_pages The top pages.
	 *
	 * @return Data_Container Data about SEO scores of top pages.
	 */
	public function get_seo_scores( Data_Container $top_pages ): Data_Container {
		$top_page_data_container = new Data_Container();

		foreach ( $top_pages->get_data() as $top_page ) {
			$url = $top_page->get_subject();

			/**
			 * Filter: 'wpseo_transform_dashboard_url_for_testing' - Allows overriding the URLs for the dashboard, to facilitate testing in local environments.
			 *
			 * @internal
			 *
			 * @param string $url The URL to be transformed.
			 */
			$url = \apply_filters( 'wpseo_transform_dashboard_url_for_testing', $url );

			$indexable = $this->indexable_repository->find_by_permalink( $url );
			$seo_score = ( $indexable ) ? $indexable->primary_focus_keyword_score : 0;

			$seo_score_group = $this->seo_score_groups_repository->get_seo_score_group( $seo_score );

			$top_page_data_container->add_data( new Top_Page_Data( $top_page, $seo_score_group ) );
		}

		return $top_page_data_container;
	}
}
