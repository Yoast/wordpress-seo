<?php


use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Breadcrumb_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\Breadcrumb
 */
class Breadcrumb_Test extends TestCase {

	/**
	 * Holds the breadcrumb instance.
	 *
	 * @var Breadcrumb
	 */
	private $instance;

	/**
	 * Holds the current page helper mock instance.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page;

	/**
	 * Holds the id helper mock instance.
	 *
	 * @var Mockery\MockInterface|ID_Helper
	 */
	private $id;

	/**
	 * Holds the meta tags context mock instance.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context
	 */
	private $meta_tags_context;

	/**
	 * Set up tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );

		$this->id->breadcrumb_hash = '#breadcrumbs';

		$this->meta_tags_context               = Mockery::mock( Meta_Tags_Context::class );
		$this->meta_tags_context->presentation = Mockery::mock( Indexable_Presentation::class );
		$this->meta_tags_context->indexable    = Mockery::mock( Indexable::class );
		$this->meta_tags_context->canonical    = 'https://wordpress.example.com/canonical';

		$this->instance = new Breadcrumb( $this->current_page );
		$this->instance->set_id_helper( $this->id );
	}

	/**
	 * Tests the generation of the breadcrumbs.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumb
	 */
	public function test_generate() {
		$breadcrumb_data = [
			[
				'url'  => 'https://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				'url'  => 'https://basic.wordpress.test/test_post/',
				'text' => 'Test post',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$this->current_page->expects( 'is_paged' )->andReturnFalse();

		$actual = $this->instance->generate( $this->meta_tags_context );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumbs',
			'itemListElement' => [
				[
					'@type'    => 'ListItem',
					'position' => 1,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'https://wordpress.example.com/',
						'url'   => 'https://wordpress.example.com/',
						'name'  => 'Home',
					],
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'https://basic.wordpress.test/test_post/',
						'url'   => 'https://basic.wordpress.test/test_post/',
						'name'  => 'Test post',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether a breadcrumb is hidden when it has a `hide_in_schema` property set to `true`.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumb
	 */
	public function test_do_not_generate_when_hide_in_schema_is_true() {
		$breadcrumb_data = [
			[
				'url'  => 'https://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				// This item should be hidden in the breadcrumbs schema output.
				'url'            => 'https://basic.wordpress.test/test_post/',
				'text'           => 'Test post',
				'id'             => '123',
				'hide_in_schema' => true,
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$this->current_page->expects( 'is_paged' )->andReturnFalse();

		$actual = $this->instance->generate( $this->meta_tags_context );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumbs',
			'itemListElement' => [
				[
					'@type'    => 'ListItem',
					'position' => 1,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'https://wordpress.example.com/',
						'url'   => 'https://wordpress.example.com/',
						'name'  => 'Home',
					],
				],
			],
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Generate method should break on broken breadcrumbs.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumb
	 */
	public function test_generate_break_on_broken_breadcrumbs() {
		$breadcrumb_data = [
			[
				'url'  => 'https://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				// Invalid breadcrumb: no URL.
				'text' => 'Test post',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$actual = $this->instance->generate( $this->meta_tags_context );

		$this->assertEquals( false, $actual );
	}

	/**
	 * Generate method should break on broken breadcrumbs.
	 *
	 * @covers ::generate
	 * @covers ::add_breadcrumb
	 * @covers ::add_paginated_state
	 */
	public function test_generate_when_page_is_paginated() {
		$breadcrumb_data = [
			[
				'url'  => 'https://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				'url'  => 'https://wordpress.example.com/post-title',
				'text' => 'Test post',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;
		$this->meta_tags_context->title                     = 'Page title';

		$this->current_page->expects( 'is_paged' )->andReturnTrue();

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumbs',
			'itemListElement' => [
				[
					'@type'    => 'ListItem',
					'position' => 1,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'https://wordpress.example.com/',
						'url'   => 'https://wordpress.example.com/',
						'name'  => 'Home',
					],
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'https://wordpress.example.com/post-title',
						'url'   => 'https://wordpress.example.com/post-title',
						'name'  => 'Test post',
					],
				],
				[
					'@type'    => 'ListItem',
					'position' => 3,
					'item'     => [
						'@type' => 'WebPage',
						'@id'   => 'https://wordpress.example.com/canonical',
						'url'   => 'https://wordpress.example.com/canonical',
						'name'  => 'Page title',
					],
				],
			],
		];

		$actual = $this->instance->generate( $this->meta_tags_context );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that breadcrumbs are not shown on error pages.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_on_error_page() {
		$this->meta_tags_context->indexable->object_type = 'error-page';
		$this->assertFalse( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Tests that breadcrumbs are not shown on the home page.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_on_home_page() {
		$this->meta_tags_context->indexable->object_type = 'home-page';
		$this->assertFalse( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Tests that breadcrumbs are not shown on static home pages.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_on_static_home_page() {
		$this->current_page->expects( 'is_home_static_page' )->andReturnTrue();
		$this->assertFalse( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Tests that breadcrumbs are shown when breadcrumbs are enabled.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed_when_breadcrumbs_are_enabled() {
		$this->current_page->expects( 'is_home_static_page' )->andReturnFalse();
		$this->meta_tags_context->breadcrumbs_enabled = true;
		$this->assertTrue( $this->instance->is_needed( $this->meta_tags_context ) );
	}

	/**
	 * Tests that breadcrumbs are not shown when breadcrumbs are disabled.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_when_breadcrumbs_are_disabled() {
		$this->current_page->expects( 'is_home_static_page' )->andReturnFalse();
		$this->meta_tags_context->breadcrumbs_enabled = false;
		$this->assertFalse( $this->instance->is_needed( $this->meta_tags_context ) );
	}
}
