<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Title_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group title
 */
class Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $option;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Presentation
	 */
	protected $instance;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->set_instance();

		return parent::setUp();
	}

	/**
	 * Tests the situation where the SEO title is given.
	 *
	 * @covers ::generate_title
	 */
	public function test_generate_title_with_set_title() {
		$this->indexable->title = 'SEO title';

		$this->assertEquals( 'SEO title', $this->instance->generate_title() );
	}

	/**
	 * Tests the situation where an empty value is returned.
	 *
	 * @covers ::generate_title
	 */
	public function test_generate_title_with_empty_return_value() {
		$this->assertEmpty( $this->instance->generate_title() );
	}
}
