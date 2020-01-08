<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Tests\Integrations\Third_Party;

use Mockery;
use Brain\Monkey;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Third_Party\WooCommerce;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\TestCase;


/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\WooCommerce
 *
 * @group integrations
 * @group front-end
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
	 * @var Indexable
	 */
	private $indexable;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->options      = Mockery::mock( Options_Helper::class );
		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->instance     = Mockery::mock( WooCommerce::class, [ $this->options, $this->replace_vars ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$presentation       = new Indexable_Presentation();
		$this->indexable    = new Indexable();
		$this->presentation = $presentation->of( [ 'model' => $this->indexable ] );
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
	 */
	public function test_get_page_id_when_woocommerce_function_does_not_exist() {
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
	 * Tests the situation where the indexable has a set title.
	 *
	 * @covers ::title
	 */
	public function test_title_with_having_title_set() {
		$this->indexable->title = 'This is a set title';

		$this->assertEquals(
			'This is a set title',
			$this->instance->title( 'This is a set title', $this->presentation )
		);
	}

	/**
	 * Tests the situation where the given title is returned because we aren't on a
	 * shop page.
	 *
	 * @covers ::title
	 */
	public function test_title_with_fallback_title_not_on_shop_page() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnFalse();

		$this->assertEquals(
			'This is a fallback title',
			$this->instance->title( 'This is a fallback title', $this->presentation )
		);
	}

	/**
	 * Tests the situation where the product archive title template is used.
	 *
	 * @covers ::title
	 */
	public function test_title_by_using_the_product_archive_template() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_product_template' )
			->with( 'title-ptarchive-product' )
			->once()
			->andReturn( 'This is a product archive title template' );

		$this->assertEquals(
			'This is a product archive title template',
			$this->instance->title( 'This is a fallback title', $this->presentation )
		);
	}

	/**
	 * Tests the situation where nothing meets our conditions, thus results in
	 * returning the given value.
	 *
	 * @covers ::title
	 */
	public function test_title_no_set_product_template() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_product_template' )
			->with( 'title-ptarchive-product' )
			->once()
			->andReturn( '' );

		$this->assertEquals(
			'This is a fallback title',
			$this->instance->title( 'This is a fallback title', $this->presentation )
		);
	}

	/**
	 * Tests the situation where the indexable has a set description.
	 *
	 * @covers ::description
	 */
	public function test_description_with_having_description_set() {
		$this->indexable->description = 'This is a set description';

		$this->assertEquals(
			'This is a set description',
			$this->instance->description( 'This is a set description', $this->presentation )
		);
	}

	/**
	 * Tests the situation where the given description is returned because we aren't on a
	 * shop page.
	 *
	 * @covers ::description
	 */
	public function test_description_with_fallback_description_not_on_shop_page() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnFalse();

		$this->assertEquals(
			'This is a fallback description',
			$this->instance->description( 'This is a fallback description', $this->presentation )
		);
	}

	/**
	 * Tests the situation where the product archive description template is used.
	 *
	 * @covers ::description
	 */
	public function test_description_by_using_the_product_archive_template() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_product_template' )
			->with( 'metadesc-ptarchive-product' )
			->once()
			->andReturn( 'This is a product archive description template' );

		$this->assertEquals(
			'This is a product archive description template',
			$this->instance->description( 'This is a fallback description', $this->presentation )
		);
	}

	/**
	 * Tests the situation where nothing meets our conditions, thus results in
	 * returning the given value.
	 *
	 * @covers ::description
	 */
	public function test_description_no_set_product_template() {
		$this->instance
			->expects( 'is_shop_page' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_product_template' )
			->with( 'metadesc-ptarchive-product' )
			->once()
			->andReturn( '' );

		$this->assertEquals(
			'This is a fallback description',
			$this->instance->description( 'This is a fallback description', $this->presentation )
		);
	}
}
