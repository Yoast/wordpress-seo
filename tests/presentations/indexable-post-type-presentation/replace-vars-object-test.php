<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Replace_Vars_Object_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 */
class Replace_Vars_Object_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
		$this->indexable->object_id = 11;
	}

	/**
	 * Tests whether the term is returned.
	 *
	 * @covers ::generate_source
	 */
	public function test_generate_source() {
		Monkey\Functions\expect( 'get_post' )
			->with( 11 )
			->once()
			->andReturn( 'Example post' );

		$this->assertEquals( 'Example post', $this->instance->generate_source() );
	}
}

