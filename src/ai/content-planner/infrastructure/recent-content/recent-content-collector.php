<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

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
	 * @var Indexable_Repository The indexable repository.
	 */
	private Indexable_Repository $indexable_repository;

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
	 * Maps indexable results to a Post_List.
	 *
	 * @param Indexable[] $indexables The indexable results.
	 *
	 * @return Post_List The mapped post list.
	 */
	private function map_to_post_list( array $indexables ): Post_List {
		$post_list = new Post_List();

		foreach ( $indexables as $indexable ) {
			$post_list->add_post(
				new Post(
					( $indexable->breadcrumb_title ?? '' ),
					( $indexable->description ?? '' ),
					new Category( '', '' ),
					( $indexable->primary_focus_keyword ?? '' ),
					( $indexable->is_cornerstone ?? false ),
					( $indexable->object_last_modified ?? '' ),
					( $indexable->schema_article_type ?? '' ),
				),
			);
		}

		return $post_list;
	}
}
