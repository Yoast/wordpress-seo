<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Infrastructure\Indexables;

use Yoast\WP\SEO\Dashboard\Application\Score_Groups\SEO_Score_Groups\SEO_Score_Groups_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_SEO_Data;

/**
 * Collector that retrieves recent content items with their SEO scores.
 */
class Recent_Content_Indexable_Collector {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The SEO score groups repository.
	 *
	 * @var SEO_Score_Groups_Repository
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
	 * Gets recent content items with SEO scores for the given post type.
	 *
	 * @param string   $post_type  The post type to query.
	 * @param string   $date_limit The date limit (content modified after this date).
	 * @param int|null $limit      Optional. Maximum number of items to retrieve.
	 *
	 * @return Content_Item_SEO_Data[] Array of content item SEO data value objects.
	 */
	public function get_recent_content_with_seo_scores( string $post_type, string $date_limit, ?int $limit = null ): array {
		$raw_results = $this->indexable_repository->get_recent_posts_with_keywords_for_post_type(
			$post_type,
			$limit,
			$date_limit
		);

		return $this->map_to_content_item_seo_data( $raw_results, $post_type );
	}

	/**
	 * Maps raw database results to Content_Item_SEO_Data value objects.
	 *
	 * @param array<array<string, string>> $raw_results The raw results from the repository.
	 * @param string                       $post_type   The post type.
	 *
	 * @return Content_Item_SEO_Data[] Array of content item SEO data value objects.
	 */
	private function map_to_content_item_seo_data( array $raw_results, string $post_type ): array {
		$content_items = [];

		foreach ( $raw_results as $result ) {
			$seo_score_group = $this->seo_score_groups_repository->get_seo_score_group( $result['primary_focus_keyword_score'] );

			$content_items[] = new Content_Item_SEO_Data(
				$result['object_id'],
				$result['breadcrumb_title'],
				$seo_score_group->get_name(),
				$post_type
			);
		}

		return $content_items;
	}
}
