<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Debug_Info_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Permalink_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the permalink getter method.
	 *
	 * @covers ::generate_permalink
	 */
	public function test_get_permalink() {
		$this->indexable->permalink = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( false );

		$this->assertEquals( 'https://example.com/permalink/', $this->instance->permalink );
	}

	/**
	 * Tests the permalink getter method with dynamic permalinks enabled.
	 *
	 * @covers ::generate_permalink
	 * @covers ::get_permalink
	 */
	public function test_get_permalink_with_dynamic_permalinks() {
		$this->indexable->permalink = 'https://example.com/permalink/';

		$this->indexable_helper
			->expects( 'dynamic_permalinks_enabled' )
			->once()
			->andReturn( true );

		$this->permalink_helper
			->expects( 'get_permalink_for_indexable' )
			->with( $this->instance->model )
			->once()
			->andReturn( 'https://example.com/dynamic-permalink/' );

		$this->assertEquals( 'https://example.com/dynamic-permalink/', $this->instance->get_permalink() );
	}
}
