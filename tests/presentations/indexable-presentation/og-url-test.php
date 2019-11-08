<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class OG_URL_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class OG_URL_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the situation where the canonical is returned.
	 *
	 * @covers ::generate_og_url
	 */
	public function test_generate_og_url_and_return_canonical() {
		$this->indexable->canonical = 'http://example.com/canonical';
		$this->indexable->permalink = 'http://example.com/permalink';

		$this->assertEquals( 'http://example.com/canonical', $this->instance->generate_og_url() );
	}

	/**
	 * Tests the situation where the canonical is returned.
	 *
	 * @covers ::generate_og_url
	 */
	public function test_generate_og_url_fallback_to_permalink() {
		$this->indexable->permalink = 'http://example.com/permalink';

		$this->assertEquals( 'http://example.com/permalink', $this->instance->generate_og_url() );
	}
}
