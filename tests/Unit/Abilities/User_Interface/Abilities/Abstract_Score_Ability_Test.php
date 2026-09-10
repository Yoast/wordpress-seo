<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Mockery;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Score_Ability;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the score ability tests.
 */
abstract class Abstract_Score_Ability_Test extends TestCase {

	/**
	 * The score retriever mock.
	 *
	 * @var Mockery\MockInterface|Score_Retriever
	 */
	protected $score_retriever;

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	protected $capability_helper;

	/**
	 * The enabled analysis features repository mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Repository
	 */
	protected $enabled_analysis_features_repository;

	/**
	 * The should index indexables conditional mock.
	 *
	 * @var Mockery\MockInterface|Should_Index_Indexables_Conditional
	 */
	protected $should_index_indexables_conditional;

	/**
	 * The instance under test.
	 *
	 * @var Abstract_Score_Ability
	 */
	protected $instance;

	/**
	 * Creates the instance under test.
	 *
	 * @return Abstract_Score_Ability The instance under test.
	 */
	abstract protected function create_instance(): Abstract_Score_Ability;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->score_retriever                      = Mockery::mock( Score_Retriever::class );
		$this->capability_helper                    = Mockery::mock( Capability_Helper::class );
		$this->enabled_analysis_features_repository = Mockery::mock( Enabled_Analysis_Features_Repository::class );
		$this->should_index_indexables_conditional  = Mockery::mock( Should_Index_Indexables_Conditional::class );

		$this->instance = $this->create_instance();
	}

	/**
	 * Data provider for the boolean outcome tests.
	 *
	 * @return array<string, array<bool>> The outcomes.
	 */
	public static function provide_boolean_outcomes(): array {
		return [
			'true'  => [ true ],
			'false' => [ false ],
		];
	}

	/**
	 * Mocks the indexables as being built and the given analysis feature state.
	 *
	 * @param string              $feature_name The analysis feature name the ability should ask for.
	 * @param array<string, bool> $features     The feature states the repository returns.
	 *
	 * @return void
	 */
	protected function mock_available_features( string $feature_name, array $features ): void {
		$this->should_index_indexables_conditional->expects( 'is_met' )->once()->andReturnTrue();

		$features_list = Mockery::mock( Analysis_Features_List::class );
		$features_list
			->expects( 'to_array' )
			->once()
			->andReturn( $features );

		$this->enabled_analysis_features_repository
			->expects( 'get_features_by_keys' )
			->once()
			->with( [ $feature_name ] )
			->andReturn( $features_list );
	}

	/**
	 * Returns the registration arguments shared by all score abilities.
	 *
	 * @param string               $execute_method The Score_Retriever method the ability executes.
	 * @param array<string, mixed> $item_schema    The expected output item schema.
	 *
	 * @return array<string, mixed> The expected arguments, without label and description.
	 */
	protected function get_expected_shared_args( string $execute_method, array $item_schema ): array {
		return [
			'category'            => 'yoast-seo',
			'input_schema'        => [
				'type'                 => 'object',
				'additionalProperties' => false,
				'properties'           => [
					'number_of_posts' => [
						'type'        => 'integer',
						'description' => 'The number of recently modified posts to retrieve scores for. Defaults to 10.',
						'minimum'     => 1,
						'maximum'     => 100,
						'default'     => 10,
					],
				],
			],
			'output_schema'       => [
				'type'  => 'array',
				'items' => $item_schema,
			],
			'permission_callback' => [ $this->instance, 'can_manage_seo' ],
			'execute_callback'    => [ $this->score_retriever, $execute_method ],
			'meta'                => [
				'show_in_rest' => true,
				'annotations'  => [
					'readonly'    => true,
					'destructive' => false,
					'idempotent'  => true,
				],
				'mcp'          => [
					'public' => true,
				],
			],
		];
	}

	/**
	 * Returns the expected output item schema shared by all score abilities.
	 *
	 * @return array<string, mixed> The item schema.
	 */
	protected function get_expected_item_schema(): array {
		return [
			'type'       => 'object',
			'properties' => [
				'title' => [
					'type'        => 'string',
					'description' => 'The post title.',
				],
				'score' => [
					'type'        => 'string',
					'enum'        => [ 'na', 'bad', 'ok', 'good' ],
					'description' => 'The score slug.',
				],
				'label' => [
					'type'        => 'string',
					'description' => 'A human-readable label for the score.',
				],
			],
		];
	}
}
