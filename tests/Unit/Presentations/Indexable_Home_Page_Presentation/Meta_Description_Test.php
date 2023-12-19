<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Home_Page_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Meta_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Home_Page_Presentation
 *
 * @group presentations
 * @group meta-description
 */
final class Meta_Description_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the meta description is set.
	 *
	 * @covers ::generate_meta_description
	 *
	 * @return void
	 */
	public function test_with_meta_description() {
		$this->indexable->description = 'This is the meta description';

		$this->assertEquals( 'This is the meta description', $this->instance->generate_meta_description() );
	}

	/**
	 * Tests the situation where the meta description is not set.
	 *
	 * @covers ::generate_meta_description
	 *
	 * @return void
	 */
	public function test_without_meta_description() {
		$this->indexable->description = null;
		$this->options
			->expects( 'get' )
			->once()
			->with( 'metadesc-home-wpseo' )
			->andReturn( 'This is the home meta description' );

		$this->assertEquals( 'This is the home meta description', $this->instance->generate_meta_description() );
	}
}
