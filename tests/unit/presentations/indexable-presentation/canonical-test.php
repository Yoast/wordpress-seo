<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group canonical
 */
class Canonical_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the canonical is given.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_canonical() {
		$this->indexable->canonical = 'https://example.com/canonical';

		$this->assertEquals( 'https://example.com/canonical', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where the permalink is given.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_with_permalink() {
		$this->indexable->permalink = 'https://example.com/permalink';

		$this->assertEquals( 'https://example.com/permalink', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_canonical
	 */
	public function test_without_canonical_or_permalink() {
		$this->assertEmpty( $this->instance->generate_canonical() );
	}
}
