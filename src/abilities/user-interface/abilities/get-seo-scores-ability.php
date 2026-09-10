<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;

/**
 * The ability that returns the SEO scores of the most recently modified posts.
 */
class Get_SEO_Scores_Ability extends Abstract_Score_Ability {

	/**
	 * Returns the full name of the ability.
	 *
	 * @return string The ability name.
	 */
	public function get_name(): string {
		return Ability_Categories_Integration::CATEGORY_SLUG . '/get-seo-scores';
	}

	/**
	 * Returns the name of the analysis feature the ability depends on.
	 *
	 * @return string The analysis feature name.
	 */
	protected function get_feature_name(): string {
		return Keyphrase_Analysis::NAME;
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Get SEO Scores', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \__( 'Get the SEO scores for the most recently modified posts.', 'wordpress-seo' );
	}

	/**
	 * Returns the callback that executes the ability.
	 *
	 * @return array<int, object|string> The execute callback.
	 */
	protected function get_execute_callback(): array {
		return [ $this->score_retriever, 'get_seo_scores' ];
	}

	// phpcs:disable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint -- The JSON schema arrays are heterogeneous by nature.

	/**
	 * Returns the output schema: an array of score items, each including the focus keyphrase.
	 *
	 * @return array<string, mixed> The output schema.
	 */
	protected function get_output_schema(): array {
		$output_schema                                  = $this->get_score_output_schema();
		$output_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => \__( 'The focus keyphrase for the post, or null if not set.', 'wordpress-seo' ),
		];

		return $this->wrap_in_array_schema( $output_schema );
	}

	// phpcs:enable SlevomatCodingStandard.TypeHints.DisallowMixedTypeHint.DisallowedMixedTypeHint
}
