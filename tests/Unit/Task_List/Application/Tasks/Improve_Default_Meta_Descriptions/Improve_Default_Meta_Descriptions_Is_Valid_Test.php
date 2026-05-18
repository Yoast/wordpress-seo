<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

/**
 * Test class for the Improve Default Meta Descriptions is_valid method.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::is_valid
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Is_Valid_Test extends Abstract_Improve_Default_Meta_Descriptions_Test {

	/**
	 * Tests that is_valid returns true when indexables are enabled and metadesc has no replacevars.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_true_when_metadesc_is_empty() {
		$this->instance->set_post_type( 'post' );

		$this->assertTrue( $this->instance->is_valid() );
	}

	/**
	 * Tests that is_valid returns true when the metadesc contains only hardcoded text without replacevars,
	 * as descriptions are not auto-generated and the task is still useful.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_true_when_metadesc_is_hardcoded() {
		$this->instance->set_post_type( 'post' );

		$this->options_helper
			->shouldReceive( 'get' )
			->with( 'metadesc-post' )
			->andReturn( 'This is a hardcoded meta description.' );

		$this->assertTrue( $this->instance->is_valid() );
	}

	/**
	 * Tests that is_valid returns false when the metadesc template contains replacevars.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_false_when_metadesc_contains_replacevars() {
		$this->instance->set_post_type( 'post' );

		$this->options_helper
			->shouldReceive( 'get' )
			->with( 'metadesc-post' )
			->andReturn( '%%excerpt%%' );

		$this->assertFalse( $this->instance->is_valid() );
	}

	/**
	 * Tests that is_valid returns false when the metadesc template contains a mix of hardcoded text and replacevars.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_false_when_metadesc_contains_replacevars_and_text() {
		$this->instance->set_post_type( 'post' );

		$this->options_helper
			->shouldReceive( 'get' )
			->with( 'metadesc-post' )
			->andReturn( 'Read more about %%title%% on our site.' );

		$this->assertFalse( $this->instance->is_valid() );
	}

	/**
	 * Tests that is_valid returns false when indexables are disabled.
	 *
	 * @return void
	 */
	public function test_is_valid_returns_false_when_indexables_disabled() {
		$this->instance->set_post_type( 'post' );

		$this->indexable_helper
			->shouldReceive( 'should_index_indexables' )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_valid() );
	}
}
