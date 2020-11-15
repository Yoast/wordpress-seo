<?php

namespace Yoast\WP\SEO\Actions\SEMrush;

use Mockery;
use Yoast\WP\SEO\Actions\SEMrush\SEMrush_Options_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class SEMrush_Options_Action_Test
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\SEMrush\SEMrush_Options_Action
 */
class SEMrush_Options_Action_Test extends TestCase {

	/**
	 * The class instance.
	 *
	 * @var SEMrush_Options_Action
	 */
	protected $instance;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Set up the test fixtures.
	 */
	public function setUp() {
		parent::setUp();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new SEMrush_Options_Action( $this->options_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertAttributeInstanceOf( Options_Helper::class, 'options_helper', $this->instance );
	}

	/**
	 * Tests setting the country code in the database.
	 *
	 * @covers ::set_country_code
	 */
	public function test_successful_set_country_code() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'semrush_country_code', 'us' )
			->andReturnTrue();

		$this->assertEquals(
			(object) [
				'success' => true,
				'status'  => 200,
			],
			$this->instance->set_country_code( 'us' )
		);
	}

	/**
	 * Tests failing when setting the country code in the database.
	 *
	 * @covers ::set_country_code
	 */
	public function test_unsuccessful_set_country_code() {
		$this->options_helper
			->expects( 'set' )
			->once()
			->with( 'semrush_country_code', 'us' )
			->andReturnFalse();

		$this->assertEquals(
			(object) [
				'success' => false,
				'status'  => 500,
				'error'   => 'Could not save option in the database',
			],
			$this->instance->set_country_code( 'us' )
		);
	}
}
