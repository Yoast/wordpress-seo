<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\User_Interface\Scores;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Dashboard\Application\Scores\Readability_Scores\Readability_Scores_Repository;
use Yoast\WP\SEO\Routes\Route_Interface;

/**
 * Registers a route to get readability scores.
 */
class Readability_Scores_Route implements Route_Interface {

	use Scores_Route_Trait;
	use No_Conditionals;

	/**
	 * Represents the prefix.
	 *
	 * @var string
	 */
	public const ROUTE_PREFIX = '/readability_scores';

	/**
	 * Constructs the class.
	 *
	 * @param Readability_Scores_Repository $readability_scores_repository The readability scores repository.
	 */
	public function __construct(
		Readability_Scores_Repository $readability_scores_repository
	) {
		$this->scores_repository = $readability_scores_repository;
	}
}
