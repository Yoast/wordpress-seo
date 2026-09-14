<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface\Abilities;

use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Score_Ability;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Inclusive_Language_Scores_Ability;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;

/**
 * Tests the Get_Inclusive_Language_Scores_Ability class.
 *
 * @group abilities
 *
 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Get_Inclusive_Language_Scores_Ability
 * @covers \Yoast\WP\SEO\Abilities\User_Interface\Abilities\Abstract_Score_Ability
 */
final class Get_Inclusive_Language_Scores_Ability_Test extends Abstract_Score_Ability_Test {

	/**
	 * Creates the instance under test.
	 *
	 * @return Abstract_Score_Ability The instance under test.
	 */
	protected function create_instance(): Abstract_Score_Ability {
		return new Get_Inclusive_Language_Scores_Ability(
			$this->score_retriever,
			$this->capability_helper,
			$this->enabled_analysis_features_repository,
			$this->should_index_indexables_conditional,
		);
	}

	/**
	 * Tests that get_name returns the prefixed ability name.
	 *
	 * @return void
	 */
	public function test_get_name() {
		$this->assertSame( 'yoast-seo/get-inclusive-language-scores', $this->instance->get_name() );
	}

	/**
	 * Tests that is_available is false when the indexables are not being built, without consulting the analysis features.
	 *
	 * @return void
	 */
	public function test_is_available_when_indexables_are_not_indexed() {
		$this->should_index_indexables_conditional->expects( 'is_met' )->once()->andReturnFalse();
		$this->enabled_analysis_features_repository->expects( 'get_features_by_keys' )->never();

		$this->assertFalse( $this->instance->is_available() );
	}

	/**
	 * Tests that is_available follows the enabled state of the inclusive language analysis when the indexables are being built.
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $enabled Whether the inclusive language analysis is enabled.
	 *
	 * @return void
	 */
	public function test_is_available( bool $enabled ) {
		$this->mock_available_features( Inclusive_Language_Analysis::NAME, [ Inclusive_Language_Analysis::NAME => $enabled ] );

		$this->assertSame( $enabled, $this->instance->is_available() );
	}

	/**
	 * Tests that is_available returns false when the inclusive language analysis is unknown to the repository.
	 *
	 * @return void
	 */
	public function test_is_available_with_unknown_feature() {
		$this->mock_available_features( Inclusive_Language_Analysis::NAME, [] );

		$this->assertFalse( $this->instance->is_available() );
	}

	/**
	 * Tests that can_manage_seo checks the manage options capability and returns its result.
	 *
	 * @dataProvider provide_boolean_outcomes
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_manage_seo( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_manage_seo() );
	}

	/**
	 * Tests that get_args returns the expected registration arguments.
	 *
	 * @return void
	 */
	public function test_get_args() {
		$this->assertSame(
			\array_merge(
				[
					'label'       => 'Get Inclusive Language Scores',
					'description' => 'Get the inclusive language scores for the most recently modified posts.',
				],
				$this->get_expected_shared_args( 'get_inclusive_language_scores', $this->get_expected_item_schema() ),
			),
			$this->instance->get_args(),
		);
	}
}
