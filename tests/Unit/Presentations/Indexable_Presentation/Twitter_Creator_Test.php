<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Twitter_Creator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 */
final class Twitter_Creator_Test extends TestCase {

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
	 * Tests the generation of the default twitter creator, an empty string.
	 *
	 * @covers ::generate_twitter_creator
	 *
	 * @return void
	 */
	public function test_generate_twitter_creator() {
		$this->assertEquals( '', $this->instance->generate_twitter_creator() );
	}
}
