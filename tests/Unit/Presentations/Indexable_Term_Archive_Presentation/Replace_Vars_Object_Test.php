<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Term_Archive_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Replace_Vars_Object_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
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
		$this->indexable->object_id       = 11;
		$this->indexable->object_sub_type = 'Object subtype';
	}

	/**
	 * Tests whether the term is returned.
	 *
	 * @covers ::generate_source
	 *
	 * @return void
	 */
	public function test_generate_source() {
		Monkey\Functions\expect( 'get_term' )
			->with( 11, 'Object subtype' )
			->once()
			->andReturn( 'Example term' );

		$this->assertEquals( 'Example term', $this->instance->generate_source() );
	}
}
