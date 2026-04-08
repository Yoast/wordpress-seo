<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Collects the most recent published posts from indexables.
 */
class Recent_Content_Collector {

	/**
	 * The maximum number of posts to collect.
	 */
	private const LIMIT = 100;
	/**
	 * The valid schema types that we want to send to the API. Otherwise this field is omitted.
	 */
	public const         VALID_SCHEMA_TYPES = [
		'SocialMediaPosting',
		'NewsArticle',
		'AdvertiserContentArticle',
		'SatiricalArticle',
		'ScholarlyArticle',
		'TechArticle',
		'Report',
	];

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Collects the 100 most recent published, indexed posts.
	 *
	 * @param string $post_type The post type to collect.
	 *
	 * @return Post_List The list of recent posts.
	 */
	public function collect( string $post_type ): Post_List {
		$results = $this->indexable_repository->get_recently_modified_posts( $post_type, self::LIMIT, false );

		return $this->map_to_post_list( $results );
	}

	/**
	 * Collects the most recent indexed about page.
	 *
	 * @param string $post_type The post type to collect.
	 *
	 * @return array<string>|false The about page needed information.
	 */
	public function collect_about_page( string $post_type ) {
		$indexable = $this->indexable_repository->get_most_recent_about_page( $post_type );

		if ( $indexable ) {
			return [
				'title'       => ( $indexable->breadcrumb_title ?? '' ),
				'description' => ( $indexable->description ?? '' ),
			];
		}

		return false;
	}

	/**
	 * Maps indexable results to a Post_List.
	 *
	 * @param Indexable[] $indexables The indexable results.
	 *
	 * @return Post_List The mapped post list.
	 */
	private function map_to_post_list( array $indexables ): Post_List {
		$post_list = new Post_List();

		foreach ( $indexables as $indexable ) {
			$post_list->add(
				new Post(
					( $indexable->breadcrumb_title ?? '' ),
					( $indexable->description ?? '' ),
					new Category( 'My placeholder', '1' ),
					( $indexable->primary_focus_keyword ?? '' ),
					( $indexable->is_cornerstone ?? false ),
					( $indexable->object_last_modified ?? '' ),
					( \in_array( $indexable->schema_article_type, self::VALID_SCHEMA_TYPES, true ) ? $indexable->schema_article_type : null ),
				),
			);
		}

		return $post_list;
	}
}
