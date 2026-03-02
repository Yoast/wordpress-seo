<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO;

use Mockery;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Features_List;

/**
 * Test class for the Improve Content SEO is_valid method.
 *
 * @group Improve_Content_SEO
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Content_SEO::is_valid
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Is_Valid_Test extends Abstract_Improve_Content_SEO_Test {

	/**
	 * Tests that is_valid returns true when indexables are enabled and keyphrase analysis is active.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_true_when_all_conditions_met() {
		$this->assertTrue( $this->instance->is_valid() );
	}

	/**
	 * Tests that is_valid returns false when should_index_indexables returns false.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_false_when_indexables_disabled() {
		$this->indexable_helper
			->shouldReceive( 'should_index_indexables' )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_valid() );
	}

	/**
	 * Tests that is_valid returns false when keyphrase analysis is disabled.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_false_when_keyphrase_analysis_disabled() {
		$features_list = Mockery::mock( Analysis_Features_List::class );
		$features_list
			->shouldReceive( 'to_array' )
			->andReturn( [ 'keyphraseAnalysis' => false ] );

		$this->enabled_analysis_features_repository
			->shouldReceive( 'get_enabled_features' )
			->andReturn( $features_list );

		$this->assertFalse( $this->instance->is_valid() );
	}

	/**
	 * Tests that is_valid returns false when keyphrase analysis is not in the enabled features.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_false_when_keyphrase_analysis_not_present() {
		$features_list = Mockery::mock( Analysis_Features_List::class );
		$features_list
			->shouldReceive( 'to_array' )
			->andReturn( [] );

		$this->enabled_analysis_features_repository
			->shouldReceive( 'get_enabled_features' )
			->andReturn( $features_list );

		$this->assertFalse( $this->instance->is_valid() );
	}
}
