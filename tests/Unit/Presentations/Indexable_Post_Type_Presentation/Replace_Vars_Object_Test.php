<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Post_Type_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Replace_Vars_Object_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 */
final class Replace_Vars_Object_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
		$this->indexable->object_id = 11;
	}

	/**
	 * Tests whether the term is returned.
	 *
	 * @covers ::generate_source
	 *
	 * @return void
	 */
	public function test_generate_source() {
		Monkey\Functions\expect( 'get_post' )
			->with( 11 )
			->once()
			->andReturn( 'Example post' );

		$this->assertEquals( 'Example post', $this->instance->generate_source() );
	}
}
