<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content;

use WP_Term;
use WPSEO_Meta;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

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
	 * The primary term repository.
	 *
	 * @var Primary_Term_Repository
	 */
	private $primary_term_repository;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository    $indexable_repository    The indexable repository.
	 * @param Primary_Term_Repository $primary_term_repository The primary term repository.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Primary_Term_Repository $primary_term_repository
	) {
		$this->indexable_repository    = $indexable_repository;
		$this->primary_term_repository = $primary_term_repository;
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
					$this->get_primary_category( $indexable->object_id ?? 0 ),
					( $indexable->primary_focus_keyword ?? '' ),
					( $indexable->is_cornerstone ?? false ),
					( $indexable->object_last_modified ?? '' ),
					( \in_array( $indexable->schema_article_type, self::VALID_SCHEMA_TYPES, true ) ? $indexable->schema_article_type : null ),
				),
			);
		}

		return $post_list;
	}

	/**
	 * Resolves the post's primary category into a Category value object.
	 *
	 * Looks up Yoast's explicit primary term first, then the `_yoast_wpseo_primary_category` post meta,
	 * and finally falls back to the first category WordPress has assigned to the post.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return Category|null The primary category, or null when the post has no category at all.
	 */
	private function get_primary_category( int $post_id ): ?Category {
		// We try to find the primary term using the repository first, which uses indexables.
		$primary_term = $this->primary_term_repository->find_by_post_id_and_taxonomy( $post_id, 'category', false );

		if ( $primary_term ) {
			$term_id = $primary_term->term_id;
		}
		// If the repository did not return a primary term, we try to find it using the post meta, which is how older versions of Yoast SEO stored the primary category.
		else {
			$term_id = \get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'primary_category', true );
		}

		// No primary term has been set in Yoast SEO, so we fall back to the first category WordPress has assigned to the post, if any.
		if ( empty( $term_id ) ) {
			$category_ids = \wp_get_post_categories( $post_id );
			$term_id      = ( $category_ids[0] ?? 0 );
		}

		// If there are no categories at all, we return null.
		if ( empty( $term_id ) ) {
			return null;
		}

		$term = \get_term( (int) $term_id, 'category' );
		if ( ! $term instanceof WP_Term ) {
			return null;
		}

		return new Category( $term->name, $term->term_id );
	}
}
