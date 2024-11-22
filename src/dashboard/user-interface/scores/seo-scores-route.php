<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Scores;

use Yoast\WP\SEO\Dashboard\Application\Scores\SEO_Scores\SEO_Scores_Repository;

/**
 * Registers a route to get SEO scores.
 */
class SEO_Scores_Route extends Abstract_Scores_Route {

	/**
	 * The prefix of the route.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/seo_scores';

	/**
	 * Constructs the class.
	 *
	 * @param SEO_Scores_Repository $seo_scores_repository The SEO scores repository.
	 */
	public function __construct(
		SEO_Scores_Repository $seo_scores_repository
	) {
		$this->scores_repository = $seo_scores_repository;
	}
}
