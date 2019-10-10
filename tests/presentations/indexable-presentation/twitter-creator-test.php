<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Twitter_Creator_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 */
class Twitter_Creator_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the generation of the default twitter creator, an empty string.
	 *
	 * ::covers generate_twitter_creator
	 */
	public function test_generate_twitter_creator() {
		$this->assertEquals( '', $this->instance->generate_twitter_creator() );
	}

}
