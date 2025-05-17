<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Mockery;
use Yoast\WP\SEO\Generators\Schema\Breadcrumb;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Presentations\Indexable_Presentation_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Breadcrumb_Test.
 *
 * @group generators
 * @group breadcrumbs
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Breadcrumb
 */
final class Breadcrumb_Test extends TestCase {

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
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page = Mockery::mock( Current_Page_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );
		$this->html         = Mockery::mock( HTML_Helper::class );

		$this->meta_tags_context               = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->meta_tags_context->presentation = Mockery::mock( Indexable_Presentation_Mock::class );
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
	 *
	 * @return void
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
		$this->current_page->expects( 'is_home_static_page' )->once()->andReturnFalse();

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
					'name'     => 'Home',
					'item'     => 'https://wordpress.example.com/',
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'name'     => 'Test post',
				],
			],
		];

		self::assertEquals( $expected, $actual );
	}

	/**
	 * Tests the generation of the breadcrumbs when a non-nested page is set as the static front page.
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 *
	 * @return void
	 */
	public function test_generate_non_nested_static_front_page() {
		$breadcrumb_data = [
			[
				'url'  => 'https://basic.wordpress.test/',
				'text' => 'Home',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$this->current_page->expects( 'is_paged' )->andReturnFalse();
		$this->current_page->expects( 'is_home_static_page' )->once()->andReturnTrue();

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
					'name'     => 'Home',
				],
			],
		];

		self::assertEquals( $expected, $actual );
	}

	/**
	 * Tests the generation of the breadcrumbs when a nested page is set as the static front page.
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 *
	 * @return void
	 */
	public function test_generate_nested_static_front_page() {
		$breadcrumb_data = [
			[
				'url'  => 'https://wordpress.example.com/',
				'text' => 'Home',
			],
			[
				'url'  => 'https://basic.wordpress.test/',
				'text' => 'Test post',
				'id'   => '123',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;

		$this->current_page->expects( 'is_paged' )->andReturnFalse();
		$this->current_page->expects( 'is_home_static_page' )->once()->andReturnTrue();

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
					'name'     => 'Home',
				],
			],
		];

		self::assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether a breadcrumb is hidden when it has a `hide_in_schema` property set to `true`.
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 *
	 * @return void
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
		$this->current_page->expects( 'is_home_static_page' )->once()->andReturnFalse();

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
					'name'     => 'Home',
				],
			],
		];

		self::assertEquals( $expected, $actual );
	}

	/**
	 * Generate method should break on broken breadcrumbs.
	 *
	 * @covers ::generate
	 * @covers ::is_broken
	 *
	 * @return void
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

		$this->current_page
			->expects( 'is_paged' )
			->once()
			->andReturnFalse();

		$actual = $this->instance->generate();

		$this->assertEquals( false, $actual );
	}

	/**
	 * Tests the generate method when the page is paginated (as detected through 'is_paged').
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 *
	 * @return void
	 */
	public function test_generate_when_page_is_paginated_through_is_paged() {
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
			[
				'text' => 'Page 2',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;
		$this->meta_tags_context->title                     = 'Page title';

		$this->current_page->expects( 'is_paged' )->andReturnTrue();
		$this->current_page->expects( 'is_static_posts_page' )->once()->andReturnFalse();
		$this->current_page->expects( 'is_home_static_page' )->once()->andReturnFalse();

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
					'name'     => 'Home',
					'item'     => 'https://wordpress.example.com/',
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'name'     => 'Test post',
				],
			],
		];

		$actual = $this->instance->generate();

		self::assertEquals( $expected, $actual );
	}

	/**
	 * Tests the generate method when the page is paginated (as detected through 'number_of_pages').
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 *
	 * @return void
	 */
	public function test_generate_when_page_is_paginated_through_number_of_pages() {
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
			[
				'text' => 'Page 2',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs  = $breadcrumb_data;
		$this->meta_tags_context->title                      = 'Page title';
		$this->meta_tags_context->indexable->number_of_pages = 3;

		$this->current_page->expects( 'is_paged' )->andReturnFalse();
		$this->current_page->expects( 'is_static_posts_page' )->once()->andReturnFalse();
		$this->current_page->expects( 'is_home_static_page' )->andReturnFalse();

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
					'name'     => 'Home',
					'item'     => 'https://wordpress.example.com/',
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'name'     => 'Test post',
				],
			],
		];

		$actual = $this->instance->generate();

		self::assertEquals( $expected, $actual );
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
	 *
	 * @return void
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
		$this->current_page->expects( 'is_home_static_page' )->once()->andReturnFalse();

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
					'name'     => 'Home',
					'item'     => 'https://wordpress.example.com/',
				],
				[
					'@type'    => 'ListItem',
					'position' => 2,
					'name'     => 'Test post',
				],
			],
		];

		$actual = $this->instance->generate();

		self::assertEquals( $expected, $actual );
	}

	/**
	 * Generate method should omit the entity when
	 * text is empty.
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 *
	 * @return void
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
		$this->current_page->expects( 'is_home_static_page' )->once()->andReturnFalse();

		$this->html
			->expects( 'smart_strip_tags' )
			->once()
			->with( 'Home' )
			->andReturn( 'Home' );

		$expected = [
			'@type'           => 'BreadcrumbList',
			'@id'             => 'https://wordpress.example.com/canonical#breadcrumb',
			'itemListElement' => [
				[
					'@type'    => 'ListItem',
					'position' => 1,
					'name'     => 'Home',
					'item'     => 'https://wordpress.example.com/',
				],
			],
		];

		$actual = $this->instance->generate();

		self::assertEquals( $expected, $actual );
	}

	/**
	 * Tests that breadcrumbs are not shown on error pages.
	 *
	 * @covers ::is_needed
	 *
	 * @return void
	 */
	public function test_is_not_needed_on_error_page() {
		$this->meta_tags_context->indexable->object_type     = 'system-page';
		$this->meta_tags_context->indexable->object_sub_type = '404';
		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests that breadcrumbs are shown in all other cases.
	 *
	 * @covers ::is_needed
	 *
	 * @return void
	 */
	public function test_is_needed_default() {
		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests the generate method when the page is paginated (as detected through 'is_paged').
	 *
	 * @covers ::generate
	 * @covers ::not_hidden
	 * @covers ::is_broken
	 * @covers ::create_breadcrumb
	 * @covers ::format_last_breadcrumb
	 *
	 * @return void
	 */
	public function test_generate_when_page_is_paginated_and_static_page() {
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
			[
				'text' => 'Page 2',
			],
		];

		$this->meta_tags_context->presentation->breadcrumbs = $breadcrumb_data;
		$this->meta_tags_context->title                     = 'Page title';

		$this->current_page->expects( 'is_paged' )->andReturnTrue();
		$this->current_page->expects( 'is_static_posts_page' )->once()->andReturnTrue();
		$this->current_page->expects( 'is_home_static_page' )->never();

		$this->html
			->expects( 'smart_strip_tags' )
			->never();

		$actual = $this->instance->generate();

		self::assertEquals( false, $actual );
	}
}
