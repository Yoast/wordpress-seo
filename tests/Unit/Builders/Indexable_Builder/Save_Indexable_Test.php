<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders\Indexable_Builder;

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
			'Index with no indexable before' => [
				'indexable_before' => null,
			],
			'Index with indexable before' => [
				'indexable_before' => $before,
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
	 * @param Indexable_Mock $indexable_before The indexable to expect.
	 * @return void
	 */
	public function test_save_indexable( $indexable_before ) {

		$this->indexable_helper
			->expects( 'save_indexable' )
			->once()
			->with( $this->indexable, $indexable_before )
			->andReturn( $this->indexable );

		$result = $this->instance->exposed_save_indexable( $this->indexable, $indexable_before );

		$this->assertSame( $result, $this->indexable );
	}
}
