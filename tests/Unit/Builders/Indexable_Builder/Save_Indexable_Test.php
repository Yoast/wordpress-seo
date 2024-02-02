<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Builder_Double;

/**
 * Class Save_Indexable_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Builder
 */
final class Save_Indexable_Test extends Abstract_Indexable_Builder_TestCase {

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Indexable_Builder_Double(
			$this->author_builder,
			$this->post_builder,
			$this->term_builder,
			$this->home_page_builder,
			$this->post_type_archive_builder,
			$this->date_archive_builder,
			$this->system_page_builder,
			$this->hierarchy_builder,
			$this->primary_term_builder,
			$this->indexable_helper,
			$this->version_manager,
			$this->link_builder
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Provider for testing save_indexable method.
	 *
	 * @return array The test data.
	 */
	public static function save_indexable_provider() {
		$before = Mockery::mock( Indexable::class );
		return [
			'Should index and save' => [
				'indexable_before'            => null,
				'should_index_indexables'     => true,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 0,
			],
			'Should not index and not save' => [
				'indexable_before'            => null,
				'should_index_indexables'     => false,
				'wpseo_should_save_indexable' => false,
				'save_times'                  => 0,
				'action_times'                => 0,
			],
			'Should not index but wpseo_should_save_indexable filter is true, should save' => [
				'indexable_before'            => null,
				'should_index_indexables'     => false,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 0,
			],
			'Should index but wpseo_should_save_indexable filter is false, should not save' => [
				'indexable_before'            => null,
				'should_index_indexables'     => true,
				'wpseo_should_save_indexable' => false,
				'save_times'                  => 0,
				'action_times'                => 0,
			],
			'Updating existing indexable' => [
				'indexable_before'            => $before,
				'should_index_indexables'     => true,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 1,
			],
			'Updating existing indexable when should_index_indexables is false' => [
				'indexable_before'            => $before,
				'should_index_indexables'     => false,
				'wpseo_should_save_indexable' => true,
				'save_times'                  => 1,
				'action_times'                => 1,
			],
		];
	}

	/**
	 * Test save_indexable.
	 *
	 * @covers ::save_indexable
	 *
	 * @dataProvider save_indexable_provider
	 *
	 * @param Indexable_Mock $indexable_before  The indexable to expect.
	 * @param bool           $should_index      The return value of should_index_indexables method.
	 * @param bool           $wpseo_should_save The return value for wpseo_should_save_indexable.
	 * @param int            $save_times        The times save method should be executed.
	 * @param int            $action_times      The times wpseo_save_indexable action should be executed.
	 * @return void
	 */
	public function test_save_indexable( $indexable_before, $should_index, $wpseo_should_save, $save_times, $action_times ) {

		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->withNoArgs()
			->andReturn( $should_index );

		Monkey\Filters\expectApplied( 'wpseo_should_save_indexable' )
			->once()
			->with( $should_index, $this->indexable )
			->andReturn( $wpseo_should_save );

		$this->indexable
			->expects( 'save' )
			->times( $save_times );

		Monkey\Actions\expectDone( 'wpseo_save_indexable' )
			->times( $action_times )
			->with( $this->indexable, $indexable_before );

		$result = $this->instance->exposed_save_indexable( $this->indexable, $indexable_before );

		$this->assertSame( $result, $this->indexable );
	}
}
