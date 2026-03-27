<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Language_Helper;

/**
 * Checks whether analysis features are enabled.
 */
class Enabled_Analysis_Features_Checker {

	/**
	 * The enabled analysis features repository.
	 *
	 * @var Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * The language helper.
	 *
	 * @var Language_Helper
	 */
	private $language_helper;

	/**
	 * Constructor.
	 *
	 * @param Enabled_Analysis_Features_Repository $enabled_analysis_features_repository The enabled analysis features repository.
	 * @param Language_Helper                      $language_helper                      The language helper.
	 */
	public function __construct(
		Enabled_Analysis_Features_Repository $enabled_analysis_features_repository,
		Language_Helper $language_helper
	) {
		$this->enabled_analysis_features_repository = $enabled_analysis_features_repository;
		$this->language_helper                      = $language_helper;
	}

	/**
	 * Checks if the SEO (keyphrase) analysis feature is enabled.
	 *
	 * @return bool Whether the feature is enabled.
	 */
	public function is_keyword_analysis_enabled(): bool {
		$features = $this->get_enabled_features();

		return isset( $features[ Keyphrase_Analysis::NAME ] ) && $features[ Keyphrase_Analysis::NAME ] !== false;
	}

	/**
	 * Checks if the readability (content) analysis feature is enabled.
	 *
	 * @return bool Whether the feature is enabled.
	 */
	public function is_content_analysis_enabled(): bool {
		$features = $this->get_enabled_features();

		return isset( $features[ Readability_Analysis::NAME ] ) && $features[ Readability_Analysis::NAME ] !== false;
	}

	/**
	 * Checks if the inclusive language analysis feature is enabled.
	 *
	 * @return bool Whether the feature is enabled.
	 */
	public function is_inclusive_language_enabled(): bool {
		$features = $this->get_enabled_features();

		return isset( $features[ Inclusive_Language_Analysis::NAME ] )
			&& $features[ Inclusive_Language_Analysis::NAME ] !== false
			&& $this->language_helper->has_inclusive_language_support( $this->language_helper->get_language() );
	}

	/**
	 * Retrieves the enabled features as an array.
	 *
	 * @return array<string, bool> The enabled features.
	 */
	private function get_enabled_features(): array {
		return $this->enabled_analysis_features_repository->get_enabled_features()->to_array();
	}
}
