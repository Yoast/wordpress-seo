<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_Article_Publish_Time_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class OG_Article_Publish_Time_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests whether an empty string is returned.
	 *
	 * @covers ::generate_og_article_publish_time
	 */
	public function test_generate_og_article_publish_time_and_return_empty() {
		$this->assertEmpty( $this->instance->generate_og_article_publish_time() );
	}
}
