<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Integrations\Third_Party\WooCommerce;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
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
class WooCommerce_Test extends TestCase {

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
	 * @var Indexable_Presentation
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
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options           = Mockery::mock( Options_Helper::class );
		$this->replace_vars      = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->context_memoizer  = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->repository        = Mockery::mock( Indexable_Repository::class );
		$this->pagination_helper = Mockery::mock( Pagination_Helper::class );
		$this->instance          = Mockery::mock(
			WooCommerce::class,
			[
				$this->options,
				$this->replace_vars,
				$this->context_memoizer,
				$this->repository,
				$this->pagination_helper,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$presentation       = new Indexable_Presentation();
		$this->indexable    = new Indexable_Mock();
		$this->presentation = $presentation->of( [ 'model' => $this->indexable ] );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
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
	 */
	public function test_constructor() {
		$instance = new WooCommerce(
			$this->options,
			$this->replace_vars,
			$this->context_memoizer,
			$this->repository,
			$this->pagination_helper
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
	 */
	public function test_add_shop_to_breadcrumbs() {
		$indexables = [
			(object) [
				'object_type'     => 'post-type-archive',
				'object_sub_type' => 'product',
			],
		];

		Monkey\Functions\expect( 'wc_get_page_id' )
			->once()
			->andReturn( 707 );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 707, 'post' )->andReturn( 'shop' );

		$this->assertEquals( [ 'shop' ], $this->instance->add_shop_to_breadcrumbs( $indexables ) );
	}

	/**
	 * Tests the situation where the page isn't a shop page.
	 *
	 * @covers ::get_page_id
	 */
	public function test_get_page_id_for_non_shop_page() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnFalse();

		$this->assertEquals( 1337, $this->instance->get_page_id( 1337 ) );
	}

	/**
	 * Tests the situation where the WooCommerce function doesn't exist (for some reason).
	 *
	 * @covers ::get_page_id
	 * @covers ::get_shop_page_id
	 */
	public function test_get_page_id_when_woocommerce_function_does_not_exist() {
		// Sets the stubs.
		Monkey\Functions\expect( 'wc_get_page_id' )
			->andReturn( -1 );

		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$this->assertEquals( -1, $this->instance->get_page_id( 1337 ) );
	}

	/**
	 * Tests the happy path where we have a page id.
	 *
	 * @covers ::get_page_id
	 * @covers ::get_shop_page_id
	 */
	public function test_get_page_id() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'wc_get_page_id' )
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
	 * @covers ::is_shop_page
	 * @covers ::get_shop_page_id
	 *
	 * @param string $expected       The expected value.
	 * @param string $model_value    Value that is set as indexable title.
	 * @param string $template_value Value returned by the get_product_template_method.
	 * @param string $stubs          Array with stubs.
	 */
	public function test_title( $expected, $model_value, $template_value, $stubs ) {
		// Sets the stubs.
		Monkey\Functions\stubs( $stubs );

		$this->indexable->title = $model_value;

		$this->instance
			->shouldReceive( 'get_product_template' )
			->with( 'title-product', 1337 )
			->andReturn( $template_value );

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
	 * @covers ::is_shop_page
	 * @covers ::get_shop_page_id
	 *
	 * @param string $expected       The expected value.
	 * @param string $model_value    Value that is set as indexable description.
	 * @param string $template_value Value returned by the get_product_template_method.
	 * @param string $stubs          Array with stubs.
	 */
	public function test_description( $expected, $model_value, $template_value, $stubs ) {
		// Sets the stubs.
		Monkey\Functions\stubs( $stubs );

		$this->indexable->description = $model_value;

		$this->instance
			->shouldReceive( 'get_product_template' )
			->with( 'metadesc-product', 1337 )
			->andReturn( $template_value );

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
	public function meta_value_provider() {
		return [
			'has_model_value'            => [
				'expected'       => 'This is a value',
				'model_value'    => 'This is a value',
				'template_value' => '',
				'stubs'          => [],
			],
			'is_not_on_shop_page'        => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'stubs'          => [
					'is_shop' => false,
				],
			],
			'is_shop_page_and_searching' => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'stubs'          => [
					'is_shop'   => true,
					'is_search' => true,
				],
			],
			'is_not_archive'             => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'stubs'          => [
					'is_shop'    => true,
					'is_search'  => false,
					'is_archive' => false,
				],
			],
			'no_set_shop_page_id'        => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'stubs'          => [
					'is_shop'        => true,
					'is_search'      => false,
					'is_archive'     => true,
					'wc_get_page_id' => -1,
				],
			],
			'with_no_product_template'   => [
				'expected'       => 'This is a value',
				'model_value'    => null,
				'template_value' => '',
				'stubs'          => [
					'is_shop'        => true,
					'is_search'      => false,
					'is_archive'     => true,
					'wc_get_page_id' => 1337,
				],
			],
			'with_product_template'      => [
				'expected'       => 'The is a template value',
				'model_value'    => null,
				'template_value' => 'The is a template value',
				'stubs'          => [
					'is_shop'        => true,
					'is_search'      => false,
					'is_archive'     => true,
					'wc_get_page_id' => 1337,
				],
			],
		];
	}

	/**
	 * Tests the situation where the product archive title template is used.
	 *
	 * @covers ::title
	 * @covers ::get_product_template
	 */
	public function test_title_by_using_the_product_archive_template() {
		// Sets the stubs.
		Monkey\Functions\stubs(
			[
				'is_shop'        => true,
				'is_search'      => false,
				'is_archive'     => true,
				'wc_get_page_id' => 1337,
				'get_post'       => [ 'post' ],
			]
		);

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
	 */
	public function test_description_by_using_the_product_archive_template() {
		// Sets the stubs.
		Monkey\Functions\stubs(
			[
				'is_shop'        => true,
				'is_search'      => false,
				'is_archive'     => true,
				'wc_get_page_id' => 1337,
				'get_post'       => [ 'post' ],
			]
		);

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
	 */
	public function test_canonical_on_paginated_shop_page() {
		$presentation = Mockery::mock( Indexable_Presentation::class );

		$presentation
			->expects( 'get_permalink' )
			->once()
			->andReturn( 'https://example.com/permalink/' );

		$this->pagination_helper
			->expects( 'get_current_archive_page_number' )
			->andReturn( 5 );

		$this->pagination_helper
			->expects( 'get_paginated_url' )
			->andReturn( 'https://example.com/permalink/page/5' );

		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/page/5', $actual );
	}

	/**
	 * Tests the canonical url for a paginated shop page.
	 *
	 * @covers ::canonical
	 */
	public function test_canonical_on_non_paginated_shop_page() {
		$presentation = Mockery::mock( Indexable_Presentation::class );

		$presentation
			->expects( 'get_permalink' )
			->once()
			->andReturn( 'https://example.com/permalink/' );

		$this->pagination_helper
			->expects( 'get_current_archive_page_number' )
			->andReturn( 1 );

		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/', $actual );
	}

	/**
	 * Tests the canonical url for a paginated shop page.
	 *
	 * @covers ::canonical
	 */
	public function test_canonical_on_non_shop_page() {
		$presentation = Mockery::mock( Indexable_Presentation::class );

		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnFalse();

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/', $actual );
	}

	/**
	 * Tests the canonical url for a paginated shop page.
	 *
	 * @covers ::canonical
	 */
	public function test_canonical_on_invalid_permalink() {
		$presentation = Mockery::mock( Indexable_Presentation::class );

		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$presentation
			->expects( 'get_permalink' )
			->once()
			->andReturn( null );

		$actual = $this->instance->canonical( 'https://example.com/permalink/', $presentation );

		self::assertEquals( 'https://example.com/permalink/', $actual );
	}
}
