<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Canonical_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 */
class Canonical_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the situation where the canonical is given.
	 *
	 * ::covers generate_canonical
	 */
	public function test_generate_canonical_when_canonical_is_given() {
		$this->indexable->canonical = 'Example of canonical';

		$this->assertEquals( 'Example of canonical', $this->instance->generate_canonical() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * ::covers generate_canonical
	 */
	public function test_generate_canonical_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_canonical() );
	}
}
