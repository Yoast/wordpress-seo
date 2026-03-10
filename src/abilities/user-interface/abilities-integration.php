<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Integration that registers Yoast SEO abilities with the WordPress Abilities API.
 */
class Abilities_Integration implements Integration_Interface {

	/**
	 * The score retriever.
	 *
	 * @var Score_Retriever
	 */
	private $score_retriever;

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The language helper.
	 *
	 * @var Language_Helper
	 */
	private $language_helper;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ Abilities_API_Conditional::class ];
	}

	/**
	 * Constructor.
	 *
	 * @param Score_Retriever   $score_retriever   The score retriever.
	 * @param Capability_Helper $capability_helper The capability helper.
	 * @param Options_Helper    $options_helper    The options helper.
	 * @param Language_Helper   $language_helper   The language helper.
	 */
	public function __construct(
		Score_Retriever $score_retriever,
		Capability_Helper $capability_helper,
		Options_Helper $options_helper,
		Language_Helper $language_helper
	) {
		$this->score_retriever   = $score_retriever;
		$this->capability_helper = $capability_helper;
		$this->options_helper    = $options_helper;
		$this->language_helper   = $language_helper;
	}

	/**
	 * Registers hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_abilities_api_categories_init', [ $this, 'register_categories' ] );
		\add_action( 'wp_abilities_api_init', [ $this, 'register_abilities' ] );
	}

	/**
	 * Registers the Yoast SEO ability category.
	 *
	 * @return void
	 */
	public function register_categories() {
		\wp_register_ability_category(
			'yoast-seo',
			[
				'label'       => \__( 'Yoast SEO', 'wordpress-seo' ),
				'description' => \__( 'SEO analysis capabilities provided by Yoast SEO.', 'wordpress-seo' ),
			],
		);
	}

	/**
	 * Registers the Yoast SEO abilities.
	 *
	 * @return void
	 */
	public function register_abilities() {
		$post_id_schema = [
			'type'       => 'object',
			'properties' => [
				'post_id' => [
					'type'        => 'integer',
					'description' => \__( 'The ID of the post to retrieve the score for.', 'wordpress-seo' ),
					'minimum'     => 1,
				],
			],
			'required'   => [ 'post_id' ],
		];

		$score_output_schema = [
			'type'       => 'object',
			'properties' => [
				'score'  => [
					'type'        => 'integer',
					'description' => \__( 'The numeric score from 0 to 100.', 'wordpress-seo' ),
				],
				'rating' => [
					'type'        => 'string',
					'enum'        => [ 'na', 'bad', 'ok', 'good', 'noindex' ],
					'description' => \__( 'The rating slug.', 'wordpress-seo' ),
				],
				'label'  => [
					'type'        => 'string',
					'description' => \__( 'A human-readable label for the rating.', 'wordpress-seo' ),
				],
			],
		];

		$seo_output_schema                                  = $score_output_schema;
		$seo_output_schema['properties']['focus_keyphrase'] = [
			'type'        => [ 'string', 'null' ],
			'description' => \__( 'The focus keyphrase for the post, or null if not set.', 'wordpress-seo' ),
		];

		\wp_register_ability(
			'yoast-seo/get-seo-score',
			[
				'label'               => \__( 'Get SEO Score', 'wordpress-seo' ),
				'category'            => 'yoast-seo',
				'description'         => \__( 'Get the SEO score for a post.', 'wordpress-seo' ),
				'input_schema'        => $post_id_schema,
				'output_schema'       => $seo_output_schema,
				'permission_callback' => [ $this, 'can_read_scores' ],
				'execute_callback'    => [ $this->score_retriever, 'get_seo_score' ],
				'meta'                => [
					'show_in_rest' => true,
					'readonly'     => true,
				],
			],
		);

		\wp_register_ability(
			'yoast-seo/get-readability-score',
			[
				'label'               => \__( 'Get Readability Score', 'wordpress-seo' ),
				'category'            => 'yoast-seo',
				'description'         => \__( 'Get the readability score for a post.', 'wordpress-seo' ),
				'input_schema'        => $post_id_schema,
				'output_schema'       => $score_output_schema,
				'permission_callback' => [ $this, 'can_read_scores' ],
				'execute_callback'    => [ $this->score_retriever, 'get_readability_score' ],
				'meta'                => [
					'show_in_rest' => true,
					'readonly'     => true,
				],
			],
		);

		if ( $this->is_inclusive_language_enabled() ) {
			\wp_register_ability(
				'yoast-seo/get-inclusive-language-score',
				[
					'label'               => \__( 'Get Inclusive Language Score', 'wordpress-seo' ),
					'category'            => 'yoast-seo',
					'description'         => \__( 'Get the inclusive language score for a post.', 'wordpress-seo' ),
					'input_schema'        => $post_id_schema,
					'output_schema'       => $score_output_schema,
					'permission_callback' => [ $this, 'can_read_scores' ],
					'execute_callback'    => [ $this->score_retriever, 'get_inclusive_language_score' ],
					'meta'                => [
						'show_in_rest' => true,
						'readonly'     => true,
					],
				],
			);
		}

		$all_scores_output_schema = [
			'type'       => 'object',
			'properties' => [
				'seo'                => $seo_output_schema,
				'readability'        => $score_output_schema,
				'inclusive_language' => [
					'oneOf' => [
						$score_output_schema,
						[ 'type' => 'null' ],
					],
				],
			],
		];

		\wp_register_ability(
			'yoast-seo/get-all-scores',
			[
				'label'               => \__( 'Get All Analysis Scores', 'wordpress-seo' ),
				'category'            => 'yoast-seo',
				'description'         => \__( 'Get all analysis scores (SEO, readability, inclusive language) for a post.', 'wordpress-seo' ),
				'input_schema'        => $post_id_schema,
				'output_schema'       => $all_scores_output_schema,
				'permission_callback' => [ $this, 'can_read_scores' ],
				'execute_callback'    => [ $this->score_retriever, 'get_all_scores' ],
				'meta'                => [
					'show_in_rest' => true,
					'readonly'     => true,
				],
			],
		);
	}

	/**
	 * Checks whether the current user can read scores.
	 *
	 * @return bool Whether the current user can read scores.
	 */
	public function can_read_scores(): bool {
		return $this->capability_helper->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Checks if the inclusive language analysis feature is enabled.
	 *
	 * @return bool Whether the feature is enabled.
	 */
	private function is_inclusive_language_enabled(): bool {
		return (bool) $this->options_helper->get( 'inclusive_language_analysis_active', false )
			&& $this->language_helper->has_inclusive_language_support( $this->language_helper->get_language() );
	}
}
