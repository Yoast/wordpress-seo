<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class WordPress_Site_Name_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group opengraph
 */
class WordPress_Site_Name_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->setInstance();

		return parent::setUp();
	}

	/**
	 * Tests the situation where the OpenGraph site name is given.
	 *
	 * @covers ::generate_og_site_name
	 */
	public function test_generate_og_site_name() {
		$this->context->wordpress_site_name = 'My Site';

		$this->assertEquals( 'My Site', $this->instance->generate_og_site_name() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_og_site_name
	 */
	public function test_generate_title_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_og_site_name() );
	}
}
