<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_Title_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class OG_Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the situation where the OG title is given.
	 *
	 * ::covers generate_og_title
	 */
	public function test_generate_og_title_when_og_title_is_given() {
		$this->indexable->og_title = 'Example of OG title';

		$this->assertEquals( 'Example of OG title', $this->instance->generate_og_title() );
	}

	/**
	 * Tests the situation where the OG title is not given, and the general title is returned.
	 *
	 * ::covers generate_og_title
	 */
	public function test_generate_og_title_with_general_title() {
		$this->indexable->title = 'Example of general title';
		$this->assertEquals( 'Example of general title', $this->instance->generate_og_title() );
	}
}
