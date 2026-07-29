<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Collector;
use Yoast\WP\SEO\Abilities\Application\Post_SEO_Data_Updater;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Editors\Framework\Readability_Analysis;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abilities_Integration class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration
 */
final class Abilities_Integration_Test extends TestCase {

	/**
	 * The score retriever mock.
	 *
	 * @var Mockery\MockInterface|Score_Retriever
	 */
	private $score_retriever;

	/**
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The enabled analysis features repository mock.
	 *
	 * @var Mockery\MockInterface|Enabled_Analysis_Features_Repository
	 */
	private $enabled_analysis_features_repository;

	/**
	 * The post SEO data collector mock.
	 *
	 * @var Mockery\MockInterface|Post_SEO_Data_Collector
	 */
	private $post_seo_data_collector;

	/**
	 * The post SEO data updater mock.
	 *
	 * @var Mockery\MockInterface|Post_SEO_Data_Updater
	 */
	private $post_seo_data_updater;

	/**
	 * The instance under test.
	 *
	 * @var Abilities_Integration
	 */
	private $instance;

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
		$this->post_seo_data_collector              = Mockery::mock( Post_SEO_Data_Collector::class );
		$this->post_seo_data_updater                = Mockery::mock( Post_SEO_Data_Updater::class );

		$this->instance = new Abilities_Integration(
			$this->score_retriever,
			$this->capability_helper,
			$this->enabled_analysis_features_repository,
			$this->post_seo_data_collector,
			$this->post_seo_data_updater,
		);
	}

	/**
	 * Tests that get_conditionals returns the Abilities API and indexables conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[
				Abilities_API_Conditional::class,
				Should_Index_Indexables_Conditional::class,
			],
			Abilities_Integration::get_conditionals(),
		);
	}

	/**
	 * Tests that register_hooks registers the correct actions.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'wp_abilities_api_init' )
			->once()
			->with( [ $this->instance, 'register_abilities' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that can_manage_seo checks the manage options capability and returns its result.
	 *
	 * @covers ::can_manage_seo
	 *
	 * @dataProvider provide_can_manage_seo
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
	 * Data provider for test_can_manage_seo.
	 *
	 * @return array<string, array<bool>> The capability outcomes.
	 */
	public static function provide_can_manage_seo(): array {
		return [
			'capability granted' => [ true ],
			'capability denied'  => [ false ],
		];
	}

	/**
	 * Tests that can_edit_advanced_metadata checks the advanced metadata capability and returns its result.
	 *
	 * @covers ::can_edit_advanced_metadata
	 *
	 * @dataProvider provide_can_manage_seo
	 *
	 * @param bool $allowed Whether the capability is granted.
	 *
	 * @return void
	 */
	public function test_can_edit_advanced_metadata( bool $allowed ) {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_edit_advanced_metadata' )
			->andReturn( $allowed );

		$this->assertSame( $allowed, $this->instance->can_edit_advanced_metadata() );
	}

	/**
	 * Tests that register_abilities registers all score abilities when all analyses are enabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_inclusive_language_enabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => true,
				Readability_Analysis::NAME        => true,
				Inclusive_Language_Analysis::NAME => true,
			],
		);

		$this->expect_score_ability( 'yoast-seo/get-seo-scores' );
		$this->expect_score_ability( 'yoast-seo/get-readability-scores' );
		$this->expect_score_ability( 'yoast-seo/get-inclusive-language-scores' );

		$this->instance->register_abilities();
	}

	/**
	 * Tests that no abilities are registered when all analysis features are disabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_all_analysis_disabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => false,
				Readability_Analysis::NAME        => false,
				Inclusive_Language_Analysis::NAME => false,
			],
		);

		Monkey\Functions\expect( 'wp_register_ability' )->never();

		$this->instance->register_abilities();
	}

	/**
	 * Tests that only the keyphrase score ability registers when only that analysis is enabled.
	 *
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_with_only_keyphrase_enabled() {
		$this->mock_enabled_features(
			[
				Keyphrase_Analysis::NAME          => true,
				Readability_Analysis::NAME        => false,
				Inclusive_Language_Analysis::NAME => false,
			],
		);

		$this->expect_score_ability( 'yoast-seo/get-seo-scores' );

		$this->instance->register_abilities();
	}

	/**
	 * Registers a loose expectation for a score ability registration.
	 *
	 * @param string $slug The ability slug.
	 *
	 * @return void
	 */
	private function expect_score_ability( string $slug ): void {
		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with( $slug, Mockery::type( 'array' ) );
	}

	/**
	 * Mocks the enabled features repository to return the given features array.
	 *
	 * @param array<string, bool> $features The features array.
	 *
	 * @return void
	 */
	private function mock_enabled_features( array $features ): void {
		$features_list = Mockery::mock( Analysis_Features_List::class );

		$features_list
			->expects( 'to_array' )
			->once()
			->andReturn( $features );

		$this->enabled_analysis_features_repository
			->expects( 'get_features_by_keys' )
			->once()
			->with(
				[
					Keyphrase_Analysis::NAME,
					Readability_Analysis::NAME,
					Inclusive_Language_Analysis::NAME,
				],
			)
			->andReturn( $features_list );
	}
}
