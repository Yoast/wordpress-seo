<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\HowTo;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class HowToTest
 *
 * @package Yoast\WP\SEO\Tests\Generators\Schema
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\HowTo
 */
class HowToTest extends TestCase {

	/**
	 * Holds the meta tags context mock.
	 *
	 * @var Meta_Tags_Context
	 */
	private $meta_tags_context;

	/**
	 * Holds the how to instance under test.
	 *
	 * @var HowTo
	 */
	private $instance;

	/**
	 * @var HTML_Helper
	 */
	private $html;

	/**
	 * @var \Mockery\LegacyMockInterface|\Mockery\MockInterface|Image_Helper
	 */
	private $image;

	/**
	 * @var \Mockery\LegacyMockInterface|\Mockery\MockInterface|Post_Helper
	 */
	private $post;

	/**
	 * @var \Mockery\LegacyMockInterface|\Mockery\MockInterface|Language_Helper
	 */
	private $language;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->meta_tags_context = \Mockery::mock( Meta_Tags_Context::class );

		$this->html     = \Mockery::mock( HTML_Helper::class );
		$this->image    = \Mockery::mock( Image_Helper::class );
		$this->post     = \Mockery::mock( Post_Helper::class );
		$this->language = \Mockery::mock( Language_Helper::class );

		$this->instance = new HowTo( $this->html, $this->image, $this->post, $this->language );
	}

	/**
	 * Tests whether the how to Schema piece is needed.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->meta_tags_context->blocks = [
			'yoast/how-to-block' => [
				[
					'blockName' => 'yoast/how-to-block',
				],
			],
		];

		$this->assertTrue( $this->instance->is_needed( $this->meta_tags_context ) );
	}
}
