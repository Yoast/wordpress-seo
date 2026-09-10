<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;

/**
 * The ability that returns the readability scores of the most recently modified posts.
 */
class Get_Readability_Scores_Ability extends Abstract_Score_Ability {

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-readability-scores';
	}

	/**
	 * Returns the name of the analysis feature the ability depends on.
	 *
	 * @return string The analysis feature name.
	 */
	protected function get_feature_name(): string {
		return Readability_Analysis::NAME;
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Get Readability Scores', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \__( 'Get the readability scores for the most recently modified posts.', 'wordpress-seo' );
	}

	/**
	 * Returns the callback that executes the ability.
	 *
	 * @return array<int, object|string> The execute callback.
	 */
	protected function get_execute_callback(): array {
		return [ $this->score_retriever, 'get_readability_scores' ];
	}
}
