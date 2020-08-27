<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Brain\Monkey\Filters;
use Mockery;
use Yoast\WP\SEO\Conditionals\Should_Index_Links_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Should_Index_Links_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Should_Index_Links_Conditional
 */
class Should_Index_Links_Conditional_Test extends TestCase {

	/**
	 * Represents the conditional to test.
	 *
	 * @var Should_Index_Links_Conditional
	 */
	private $instance;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = new Should_Index_Links_Conditional( $this->options );
	}

	/**
	 * Tests if the class attributes are set propertly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( Options_Helper::class, 'options_helper', $this->instance );
	}

	/**
	 * Tests that the conditional returns the correct option value.
	 *
	 * @covers ::is_met
	 */
	public function test_option_enabled_option() {
		$this->options
			->expects( 'get' )
			->once()
			->with( 'enable_text_link_counter' )
			->andReturnTrue();

		Filters\expectApplied( 'wpseo_should_index_links' )->once()->andReturnFirstArg();

		$this->assertTrue( $this->instance->is_met() );
	}
}
