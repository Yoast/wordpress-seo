<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Woocommerce_Helper;
use Yoast\WP\SEO\Integrations\Third_Party\WooCommerce;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Presentations\Indexable_Presentation_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WooCommerce_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WooCommerce
 *
 * @group integrations
 * @group front-end
 * @group woocommerce
 */
final class WooCommerce_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var WooCommerce
	 */
	private $instance;

	/**
	 * The replace vars.
	 *
	 * @var Mockery\MockInterface|WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The presentation.
	 *
	 * @var Indexable_Presentation|Indexable_Presentation_Mock|Mockery\MockInterface
	 */
	private $presentation;

	/**
	 * The indexable.
	 *
	 * @var Indexable_Mock
	 */
	private $indexable;

	/**
	 * The memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	protected $context_memoizer;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * The pagination helper.
	 *
	 * @var Mockery\MockInterface|Pagination_Helper
	 */
	protected $pagination_helper;

	/**
	 * The WooCommerce helper.
	 *
	 * @var Mockery\MockInterface|Woocommerce_Helper
	 */
	protected $woocommerce_helper;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options            = Mockery::mock( Options_Helper::class );
		$this->replace_vars       = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->context_memoizer   = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->repository         = Mockery::mock( Indexable_Repository::class );
		$this->pagination_helper  = Mockery::mock( Pagination_Helper::class );
		$this->woocommerce_helper = Mockery::mock( Woocommerce_Helper::class );
		$this->instance           = new WooCommerce(
			$this->options,
			$this->replace_vars,
			$this->context_memoizer,
			$this->repository,
			$this->pagination_helper,
			$this->woocommerce_helper
		);

		$presentation       = new Indexable_Presentation();
		$this->indexable    = new Indexable_Mock();
		$this->presentation = $presentation->of( [ 'model' => $this->indexable ] );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ WooCommerce_Conditional::class, Front_End_Conditional::class ],
			WooCommerce::get_conditionals()
		);
	}

	/**
	 * Tests if the constructor sets the right properties.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$instance = new WooCommerce(
			$this->options,
			$this->replace_vars,
			$this->context_memoizer,
			$this->repository,
			$this->pagination_helper,
			$this->woocommerce_helper
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $instance, 'options' )
		);
		$this->assertInstanceOf(
			WPSEO_Replace_Vars::class,
			$this->getPropertyValue( $instance, 'replace_vars' )
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_frontend_page_type_simple_page_id', [ $this->instance, 'get_page_id' ] ) );
		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_title', [ $this->instance, 'title' ] ) );
		$this->assertNotFalse( Monkey\Filters\has( 'wpseo_metadesc', [ $this->instance, 'description' ] ) );
	}

	/**
	 * Tests the add shop to breadcrumbs function.
	 *
	 * @covers ::add_shop_to_breadcrumbs
	 *
	 * @return void
	 */
	public function test_add_shop_to_breadcrumbs() {
		$indexables = [
			(object) [
				'object_type'     => 'post-type-archive',
				'object_sub_type' => 'product',
			],
		];

		$this->woocommerce_helper->expects( 'get_shop_page_id' )
			->once()
			->andReturn( 707 );

		$indexable_mock = Mockery::mock( Indexable::class );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 707, 'post' )->andReturn( $indexable_mock );

		$this->assertEquals( [ $indexable_mock ], $this->instance->add_shop_to_breadcrumbs( $indexables ) );
	}

	/**
	 * Tests the add shop to breadcrumbs function when finding no indexable for the shop page.
	 *
	 * @covers ::add_shop_to_breadcrumbs
	 *
	 * @return void
	 */
	public function test_add_shop_to_breadcrumbs_no_indexable_shop_page() {
		$indexables = [
			(object) [
				'object_type'     => 'post-type-archive',
				'object_sub_type' => 'product',
			],
		];

		$this->woocommerce_helper->expects( 'get_shop_page_id' )
			->once()
			->andReturn( 707 );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 707, 'post' )->andReturn( false );

		$this->assertEquals( $indexables, $this->instance->add_shop_to_breadcrumbs( $indexables ) );
	}

	/**
	 * Tests the situation where the page isn't a shop page.
	 *
	 * @covers ::get_page_id
	 *
	 * @return void
	 */
	public function test_get_page_id_for_non_shop_page() {
		$this->woocommerce_helper->expects( 'is_shop_page' )
			->once()
			->andReturnFalse();

		$this->assertEquals( 1337, $this->instance->get_page_id( 1337 ) );
	}

	/**
	 * Tests the situation where the WooCommerce function doesn't exist (for some reason).
	 *
	 * @covers ::get_page_id
	 *
	 * @return void
	 */
	public function test_get_page_id_when_woocommerce_function_does_not_exist() {
		// Sets the stubs.
		$this->woocommerce_helper->expects( 'get_shop_page_id' )
			->andReturn( -1 );

		$this->woocommerce_helper->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$this->assertEquals( -1, $this->instance->get_page_id( 1337 ) );
	}

	/**
	 * Tests the happy path where we have a page id.
	 *
	 * @covers ::get_page_id
	 *
	 * @return void
	 */
	public function test_get_page_id() {
		$this->woocommerce_helper->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$this->woocommerce_helper->expects( 'get_shop_page_id' )
			->once()
			->andReturn( 707 );

		$this->assertEquals( 707, $this->instance->get_page_id( 1337 ) );
	}

	/**
	 * Tests the title method.
	 *
	 * @dataProvider meta_value_provider
	 *
	 * @covers ::title
	 *
	 * @param string   $expected       The expected value.
	 * @param string   $model_value    Value that is set as indexable title.
	 * @param string   $template_value Value returned by the get_product_template_method.
	 * @param bool     $is_shop_page   Whether or not the current page is a shop page.
	 * @param int|bool $shop_page_id   What the current shop page ID is, false if none.
	 * @param bool     $is_archive     Whether or not the current page is an archive.
	 *
	 * @return void
	 */
	public function test_title( $expected, $model_value, $template_value, $is_shop_page, $shop_page_id, $is_archive ) {
		if ( $is_shop_page !== null ) {
			$this->woocommerce_helper->expects( 'is_shop_page' )
				->once()
				->andReturn( $is_shop_page );
		}

		if ( $shop_page_id ) {
			$this->woocommerce_helper->expects( 'get_shop_page_id' )
				->once()
				->andReturn( $shop_page_id );
		}

		Monkey\Functions\expect( 'is_archive' )->andReturn( $is_archive );

		$this->indexable->title = $model_value;

		$this->options->shouldReceive( 'get' )->zeroOrMoreTimes()->with( 'title-product' )->andReturn( $template_value );

		Monkey\Functions\expect( 'get_post' )->with( 1337 )->andReturn( [] );

		$this->replace_vars->shouldReceive( 'replace' )->zeroOrMoreTimes()->with( $template_value, [] )->andReturn( $template_value );

		$this->assertEquals(
			$expected,
			$this->instance->title( 'This is a value', $this->presentation )
		);
	}

	/**
	 * Tests the description method.
	 *
	 * @dataProvider meta_value_provider
	 *
	 * @covers ::description
	 *
	 * @param string   $expected       The expected value.
	 * @param string   $model_value    Value that is set as indexable title.
	 * @param string   $template_value Value returned by the get_product_template_method.
	 * @param bool     $is_shop_page   Whether or not the current page is a shop page.
	 * @param int|bool $shop_page_id   What the current shop page ID is, false if none.
	 * @param bool     $is_archive     Whether or not the current page is an archive.
	 *
	 * @return void
	 */
	public function test_description( $expected, $model_value, $template_value, $is_shop_page, $shop_page_id, $is_archive ) {
		if ( $is_shop_page !== null ) {
			$this->woocommerce_helper->expects( 'is_shop_page' )
				->once()
				->andReturn( $is_shop_page );
		}

		if ( $shop_page_id ) {
			$this->woocommerce_helper->expects( 'get_shop_page_id' )
				->once()
				->andReturn( $shop_page_id );
		}

		Monkey\Functions\expect( 'is_archive' )->andReturn( $is_archive );

		$this->indexable->description = $model_value;

		$this->options->shouldReceive( 'get' )->zeroOrMoreTimes()->with( 'metadesc-product' )->andReturn( $template_value );

		Monkey\Functions\expect( 'get_post' )->with( 1337 )->andReturn( [] );

		$this->replace_vars->shouldReceive( 'replace' )->zeroOrMoreTimes()->with( $template_value, [] )->andReturn( $template_value );

		$this->assertEquals(
			$expected,
			$this->instance->description( 'This is a value', $this->presentation )
		);
	}

	/**
	 * This data provider can be used for the title and for the description provider.
	 *
	 * @return array The test data.
	 */
	public static function meta_value_provider() {
		return [
			'has_model_value' => [
				'expected'       => 'This is a value',
				'model_value'    => 'This is a value',
				'template_value' => '',
				'is_shop_page'   => null,
				'shop_page_id'   => false,
				'is_archive'     => false,
			],
			'is_not_on_shop_page' => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'is_shop_page'   => false,
				'shop_page_id'   => false,
				'is_archive'     => false,
			],
			'is_not_archive' => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'is_shop_page'   => true,
				'shop_page_id'   => false,
				'is_archive'     => false,
			],
			'no_set_shop_page_id' => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'is_shop_page'   => true,
				'shop_page_id'   => -1,
				'is_archive'     => true,
			],
			'with_no_product_template' => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'is_shop_page'   => true,
				'shop_page_id'   => 1337,
				'is_archive'     => true,
			],
			'with_product_template' => [
				'expected'       => 'The is a template value',
				'model_value'    => null,
				'template_value' => 'The is a template value',
				'is_shop_page'   => true,
				'shop_page_id'   => 1337,
				'is_archive'     => true,
			],
		];
	}

	/**
	 * Tests the situation where the product archive title template is used.
	 *
	 * @covers ::title
	 * @covers ::get_product_template
	 *
	 * @return void
	 */
	public function test_title_by_using_the_product_archive_template() {
		$this->woocommerce_helper->expects( 'is_shop_page' )
				->once()
				->andReturn( true );

		$this->woocommerce_helper->expects( 'get_shop_page_id' )
			->once()
			->andReturn( 1337 );

		Monkey\Functions\expect( 'is_archive' )->andReturn( true );
		Monkey\Functions\expect( 'get_post' )->with( 1337 )->andReturn( [ 'post' ] );

		$this->options
			->expects( 'get' )
			->with( 'title-product' )
			->andReturn( 'template' );

		$this->replace_vars
			->expects( 'replace' )
			->once()
			->with( 'template', [ 'post' ] )
			->andReturn( 'This is a template value' );

		$this->assertEquals(
			'This is a template value',
			$this->instance->title( 'This is a value', $this->presentation )
		);
	}

	/**
	 * Tests the situation where the product archive description template is used.
	 *
	 * @covers ::description
	 * @covers ::get_product_template
	 *
	 * @return void
	 */
	public function test_description_by_using_the_product_archive_template() {
		$this->woocommerce_helper->expects( 'is_shop_page' )
				->once()
				->andReturn( true );

		$this->woocommerce_helper->expects( 'get_shop_page_id' )
			->once()
			->andReturn( 1337 );

		Monkey\Functions\expect( 'is_archive' )->andReturn( true );
		Monkey\Functions\expect( 'get_post' )->with( 1337 )->andReturn( [ 'post' ] );

		$this->options
			->expects( 'get' )
			->with( 'metadesc-product' )
			->andReturn( 'template' );

		$this->replace_vars
			->expects( 'replace' )
			->once()
			->with( 'template', [ 'post' ] )
			->andReturn( 'This is a template value' );

		$this->assertEquals(
			'This is a template value',
			$this->instance->description( 'This is a value', $this->presentation )
		);
	}

	/**
	 * Tests the canonical url for a paginated shop page.
	 *
	 * @covers ::canonical
	 *
	 * @return void
	 */
	public function test_canonical_on_paginated_shop_page() {
		$presentation = Mockery::mock( Indexable_Presentation_Mock::class );

		$presentation->permalink = 'https://example.com/permalink/';

		$this->pagination_helper
			->expects( 'get_current_archive_page_number' )
			->andReturn( 5 );

		$this->pagination_helper
			->expects( 'get_paginated_url' )
			->andReturn( 'https://example.com/permalink/page/5' );

		$this->woocommerce_helper->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/page/5', $actual );
	}

	/**
	 * Tests the canonical url for a paginated shop page.
	 *
	 * @covers ::canonical
	 *
	 * @return void
	 */
	public function test_canonical_on_non_paginated_shop_page() {
		$presentation = Mockery::mock( Indexable_Presentation_Mock::class );

		$presentation->permalink = 'https://example.com/permalink/';

		$this->pagination_helper
			->expects( 'get_current_archive_page_number' )
			->andReturn( 1 );

		$this->woocommerce_helper->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/', $actual );
	}

	/**
	 * Tests the canonical url for a paginated shop page.
	 *
	 * @covers ::canonical
	 *
	 * @return void
	 */
	public function test_canonical_on_non_shop_page() {
		$presentation = Mockery::mock( Indexable_Presentation_Mock::class );

		$this->woocommerce_helper->expects( 'is_shop_page' )
			->once()
			->andReturnFalse();

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/', $actual );
	}

	/**
	 * Tests the canonical url for a paginated shop page.
	 *
	 * @covers ::canonical
	 *
	 * @return void
	 */
	public function test_canonical_on_invalid_permalink() {
		$presentation = Mockery::mock( Indexable_Presentation_Mock::class );

		$this->woocommerce_helper->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$presentation->permalink = null;

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/', $actual );
	}
}
