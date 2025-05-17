<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Meta_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
final class Meta_Description_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_meta_description
	 *
	 * @return void
	 */
	public function test_generate_meta_description_when_meta_description_is_given() {
		$this->indexable->description = 'Example of meta description';

		$this->assertEquals( 'Example of meta description', $this->instance->generate_meta_description() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_meta_description
	 *
	 * @return void
	 */
	public function test_generate_meta_description_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_meta_description() );
	}
}
