<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Scores;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Application\Scores\SEO_Scores\SEO_Scores_Repository;
use Yoast\WP\SEO\Dashboard\Domain\Content_Types\Content_Type;
use Yoast\WP\SEO\Dashboard\Domain\Taxonomies\Taxonomy;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to get SEO scores.
 */
class SEO_Scores_Route implements Route_Interface {

	use Scores_Route_Trait;
	use No_Conditionals;

	/**
	 * Represents the prefix.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/seo_scores';

	/**
	 * The SEO Scores repository.
	 *
	 * @var SEO_Scores_Repository
	 */
	private $seo_scores_repository;

	/**
	 * Constructs the class.
	 *
	 * @param SEO_Scores_Repository $seo_scores_repository The SEO Scores repository.
	 */
	public function __construct(
		SEO_Scores_Repository $seo_scores_repository
	) {
		$this->seo_scores_repository = $seo_scores_repository;
	}

	/**
	 * Returns the SEO scores of a content type.
	 *
	 * @param Content_Type  $content_type The content type.
	 * @param Taxonomy|null $taxonomy     The taxonomy of the term we're filtering for.
	 * @param int|null      $term_id      The ID of the term we're filtering for.
	 *
	 * @return array<array<string, string|int|array<string, string>>> The SEO scores.
	 */
	public function calculate_scores( Content_Type $content_type, ?Taxonomy $taxonomy, ?int $term_id ) {
		return $this->seo_scores_repository->get_seo_scores( $content_type, $taxonomy, $term_id );
	}
}
