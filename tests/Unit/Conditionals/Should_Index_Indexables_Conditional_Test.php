<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Should_Index_Indexables_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Should_Index_Indexables_Conditional
 */
final class Should_Index_Indexables_Conditional_Test extends TestCase {

	/**
	 * Represents the conditional to test.
	 *
	 * @var Should_Index_Indexables_Conditional
	 */
	private $instance;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Does the setup for testing.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_helper = Mockery::mock( Indexable_Helper::class );
		$this->instance         = new Should_Index_Indexables_Conditional( $this->indexable_helper );
	}

	/**
	 * Tests if the class attributes are set properly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Indexable_Helper::class,
			$this->getPropertyValue( $this->instance, 'indexable_helper' ),
		);
	}

	/**
	 * Tests that the conditional is met when indexables should be indexed.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_when_indexables_should_be_indexed() {
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturnTrue();

		$this->assertTrue( $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is not met when indexables should not be indexed.
	 *
	 * @covers ::is_met
	 *
	 * @return void
	 */
	public function test_is_met_when_indexables_should_not_be_indexed() {
		$this->indexable_helper
			->expects( 'should_index_indexables' )
			->once()
			->andReturnFalse();

		$this->assertFalse( $this->instance->is_met() );
	}
}
