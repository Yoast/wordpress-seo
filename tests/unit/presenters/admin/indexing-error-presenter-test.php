<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Error_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit test for the indexing error.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexing_Error_Presenter
 */
class Indexing_Error_Presenter_Test extends TestCase {

	/**
	 * The mocked short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The mocked product helper.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	protected $product_helper;

	/**
	 * The mocked addon manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * The indexing error presenter.
	 *
	 * @var Indexing_Error_Presenter
	 */
	protected $instance;

	/**
	 * Set up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->short_link_helper = Mockery::mock( Short_Link_Helper::class );
		$this->product_helper    = Mockery::mock( Product_Helper::class );
		$this->addon_manager     = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->instance = new Indexing_Error_Presenter(
			$this->short_link_helper,
			$this->product_helper,
			$this->addon_manager
		);

		$this->short_link_helper
			->allows( 'get' )
			->andReturnArg( 0 );

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Tests the constructor of the error presenter.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertInstanceOf(
			Short_Link_Helper::class,
			self::getPropertyValue( $this->instance, 'short_link_helper' )
		);
		self::assertInstanceOf(
			Product_Helper::class,
			self::getPropertyValue( $this->instance, 'product_helper' )
		);
		self::assertInstanceOf(
			WPSEO_Addon_Manager::class,
			self::getPropertyValue( $this->instance, 'addon_manager' )
		);
	}

	/**
	 * Tests whether the correct error message is shown when WordPress SEO Premium
	 * is not active and has no valid subscription.
	 *
	 * @covers ::present
	 * @covers ::generate_first_paragraph
	 * @covers ::generate_second_paragraph
	 */
	public function test_present_not_premium_no_valid_premium_subscription() {
		$this->product_helper
			->expects( 'is_premium' )
			->andReturnFalse();

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturnFalse();

		$actual = $this->instance->present();

		self::assertEquals(
			'<p>Oops, something has gone wrong and we couldn\'t complete the optimization of your SEO data. Please click the button again to re-start the process. </p>' .
			'<p>Below are the technical details for the error. See <a href="https://yoa.st/4f3">this page</a> for a more detailed explanation.</p>',
			$actual
		);
	}

	/**
	 * Tests whether the correct error message is shown when WordPress SEO Premium
	 * is active but has no valid subscription.
	 *
	 * @covers ::present
	 * @covers ::generate_first_paragraph
	 * @covers ::generate_second_paragraph
	 */
	public function test_present_premium_no_valid_premium_subscription() {
		$this->product_helper
			->expects( 'is_premium' )
			->andReturnTrue();

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturnFalse();

		$actual = $this->instance->present();

		self::assertEquals(
			'<p>Oops, something has gone wrong and we couldn\'t complete the optimization of your SEO data. ' .
			'Please make sure to activate your subscription in MyYoast by completing <a href="https://yoa.st/3wv">these steps</a>.</p>' .
			'<p>Below are the technical details for the error. See <a href="https://yoa.st/4f3">this page</a> for a more detailed explanation.</p>',
			$actual
		);
	}

	/**
	 * Tests whether the correct error message is shown when WordPress SEO Premium
	 * is not active and has a valid subscription.
	 *
	 * @covers ::present
	 * @covers ::generate_first_paragraph
	 * @covers ::generate_second_paragraph
	 */
	public function test_present_premium_valid_premium_subscription() {
		$this->product_helper
			->expects( 'is_premium' )
			->andReturnTrue();

		$this->addon_manager
			->expects( 'has_valid_subscription' )
			->with( WPSEO_Addon_Manager::PREMIUM_SLUG )
			->andReturnSelf();

		$actual = $this->instance->present();

		self::assertEquals(
			'<p>Oops, something has gone wrong and we couldn\'t complete the optimization of your SEO data. ' .
			'Please click the button again to re-start the process. If the problem persists, please contact support.</p>' .
			'<p>Below are the technical details for the error. See <a href="https://yoa.st/4f3">this page</a> for a more detailed explanation.</p>',
			$actual
		);
	}
}
