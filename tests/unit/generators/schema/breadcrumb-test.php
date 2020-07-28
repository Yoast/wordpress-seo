<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Mockery;
use Yoast\WP\SEO\Generators\Schema\Breadcrumb;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Breadcrumb_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Breadcrumb
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
	 * Holds the html helper mock instance.
	 *
	 * @var Mockery\MockInterface|HTML_Helper
	 */
	private $html;

	/**
	 * Holds the meta tags context mock instance.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Mock
	 */
	private $meta_tags_context;

	/**
	 * Set up tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );
		$this->html         = Mockery::mock( HTML_Helper::class );

		$this->meta_tags_context               = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->meta_tags_context->presentation = Mockery::mock( Indexable_Presentation::class );
		$this->meta_tags_context->indexable    = Mockery::mock( Indexable_Mock::class );
		$this->meta_tags_context->canonical    = 'https://wordpress.example.com/canonical';

		$this->instance = new Breadcrumb();

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'current_page' => $this->current_page,
			'schema'       => (object) [
				'id'   => $this->id,
				'html' => $this->html,
			],
		];
	}

	/**
	 * Tests the generation of the breadcrumbs.
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
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

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Home' )
			->once()
			->andReturnArg( 0 );

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Test post' )
			->once()
			->andReturnArg( 0 );

		$actual = $this->instance->generate();

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumb',
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
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
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

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Home' )
			->once()
			->andReturnArg( 0 );

		$actual = $this->instance->generate();

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumb',
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
	 * @covers ::is_broken
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

		$actual = $this->instance->generate();

		$this->assertEquals( false, $actual );
	}

	/**
	 * Generate method should break on broken breadcrumbs.
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
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

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Home' )
			->once()
			->andReturnArg( 0 );

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Test post' )
			->once()
			->andReturnArg( 0 );

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Page title' )
			->once()
			->andReturnArg( 0 );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumb',
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

		$actual = $this->instance->generate();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Generate method should fall back to the canonical URL when the
	 * URL is empty, but only for the current page
	 * (last item in the breadcrumb list).
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 */
	public function test_generate_fallbacks_for_url_on_empty_last_item() {
		$breadcrumb_data = [
			[
				'url'  => 'https://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				'url'  => '',
				'text' => 'Test post',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;
		$this->meta_tags_context->title                     = 'Page title';

		$this->current_page->expects( 'is_paged' )->andReturnFalse();

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Home' )
			->once()
			->andReturnArg( 0 );

		$this->html
			->expects( 'smart_strip_tags' )
			->with( 'Test post' )
			->once()
			->andReturnArg( 0 );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumb',
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
						// Fall back to canonical for ID and URL properties.
						'@id'   => 'https://wordpress.example.com/canonical',
						'url'   => 'https://wordpress.example.com/canonical',
						'name'  => 'Test post',
					],
				],
			],
		];

		$actual = $this->instance->generate();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Generate method should fall back to the page title when the
	 * text is empty, but only for the current page.
	 * (last item in the breadcrumb list).
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 */
	public function test_generate_fallbacks_for_text_on_empty_last_item() {
		$breadcrumb_data = [
			[
				'url'  => 'https://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				'url'  => 'https://wordpress.example.com/post-title',
				'text' => '',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;
		$this->meta_tags_context->title                     = 'Page title';

		$this->current_page->expects( 'is_paged' )->andReturnFalse();
		$this->html->expects( 'smart_strip_tags' )->once()->with( 'Home' )->andReturn( 'Home' );
		$this->html->expects( 'smart_strip_tags' )->twice()->with( 'Page title' )->andReturn( 'Page title' );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumb',
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
						// Fall back to canonical for ID and URL properties.
						'@id'   => 'https://wordpress.example.com/post-title',
						'url'   => 'https://wordpress.example.com/post-title',
						'name'  => 'Page title',
					],
				],
			],
		];

		$actual = $this->instance->generate();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that breadcrumbs are not shown on error pages.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_on_error_page() {
		$this->meta_tags_context->indexable->object_type     = 'system-page';
		$this->meta_tags_context->indexable->object_sub_type = '404';
		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests that breadcrumbs are not shown on the home page.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_on_home_page() {
		$this->meta_tags_context->indexable->object_type = 'home-page';
		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests that breadcrumbs are not shown on static home pages.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_on_static_home_page() {
		$this->current_page->expects( 'is_home_static_page' )->andReturnTrue();
		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests that breadcrumbs are shown when breadcrumbs are enabled.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed_when_breadcrumbs_are_enabled() {
		$this->current_page->expects( 'is_home_static_page' )->andReturnFalse();
		$this->meta_tags_context->breadcrumbs_enabled = true;
		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests that breadcrumbs are not shown when breadcrumbs are disabled.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed_when_breadcrumbs_are_disabled() {
		$this->current_page->expects( 'is_home_static_page' )->andReturnFalse();
		$this->meta_tags_context->breadcrumbs_enabled = false;
		$this->assertFalse( $this->instance->is_needed() );
	}
}
