<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class OG_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class OG_Description_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the OG description is given.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_generate_og_description_when_og_description_is_given() {
		$this->indexable->og_description = 'Example of OG description';

		$this->assertEquals( 'Example of OG description', $this->instance->generate_open_graph_description() );
	}

	/**
	 * Tests the situation where the OG description is not given, and the meta description is returned.
	 *
	 * @covers ::generate_open_graph_description
	 */
	public function test_generate_og_description_with_meta_description() {
		$this->indexable->description = 'Example of meta description';
		$this->assertEquals( 'Example of meta description', $this->instance->generate_open_graph_description() );
	}
}
