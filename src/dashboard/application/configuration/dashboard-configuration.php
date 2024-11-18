<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Dashboard\Application\Configuration;

use Yoast\WP\SEO\Dashboard\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Responsible for the dashboard configuration.
 */
class Dashboard_Configuration {

	/**
	 * The content types repository.
	 *
	 * @var Content_Types_Repository $content_types_repository
	 */
	private $content_types_repository;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper $indexable_helper
	 */
	private $indexable_helper;

	/**
	 * The user helper.
	 *
	 * @var User_Helper $user_helper
	 */
	private $user_helper;

	/**
	 * The repository.
	 *
	 * @var Analysis_Features_Repository
	 */
	private $analysis_features_repository;

	/**
	 * The constructor.
	 *
	 * @param Content_Types_Repository     $content_types_repository     The content types repository.
	 * @param Indexable_Helper             $indexable_helper             The indexable helper repository.
	 * @param User_Helper                  $user_helper                  The user helper.
	 * @param Analysis_Features_Repository $analysis_features_repository The analysis feature repository.
	 */
	public function __construct(
		Content_Types_Repository $content_types_repository,
		Indexable_Helper $indexable_helper,
		User_Helper $user_helper,
		Analysis_Features_Repository $analysis_features_repository
	) {
		$this->content_types_repository     = $content_types_repository;
		$this->indexable_helper             = $indexable_helper;
		$this->user_helper                  = $user_helper;
		$this->analysis_features_repository = $analysis_features_repository;
	}

	/**
	 * Returns a configuration
	 *
	 * @return array<string,array<string>>
	 */
	public function get_configuration(): array {
		return [
			'contentTypes'      => $this->content_types_repository->get_content_types(),
			'indexablesEnabled' => $this->indexable_helper->should_index_indexables(),
			'displayName'       => $this->user_helper->get_current_user_display_name(),
			'analysisFeatures'  => $this->analysis_features_repository->get_analysis_features_by_keys(
				[
					Readability_Analysis::NAME,
					Keyphrase_Analysis::NAME,
				]
			)->to_array(),
		];
	}
}
