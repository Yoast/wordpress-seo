<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abilities_Integration class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration
 */
final class Abilities_Integration_Test extends TestCase {

	/**
	 * An ability that is available.
	 *
	 * @var Mockery\MockInterface|Ability_Interface
	 */
	private $available_ability;

	/**
	 * An ability that is not available.
	 *
	 * @var Mockery\MockInterface|Ability_Interface
	 */
	private $unavailable_ability;

	/**
	 * The instance under test.
	 *
	 * @var Abilities_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->available_ability   = Mockery::mock( Ability_Interface::class );
		$this->unavailable_ability = Mockery::mock( Ability_Interface::class );

		$this->instance = new Abilities_Integration( $this->available_ability, $this->unavailable_ability );
	}

	/**
	 * Tests that get_conditionals returns the Abilities API conditional.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame( [ Abilities_API_Conditional::class ], Abilities_Integration::get_conditionals() );
	}

	/**
	 * Tests that register_hooks registers the correct actions.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'wp_abilities_api_init' )
			->once()
			->with( [ $this->instance, 'register_abilities' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that register_abilities registers the available abilities and skips the unavailable ones.
	 *
	 * @covers ::__construct
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities() {
		$args = [ 'label' => 'An available ability' ];

		$this->available_ability->expects( 'is_available' )->once()->andReturnTrue();
		$this->available_ability->expects( 'get_name' )->once()->andReturn( 'yoast-seo/available' );
		$this->available_ability->expects( 'get_args' )->once()->andReturn( $args );

		$this->unavailable_ability->expects( 'is_available' )->once()->andReturnFalse();
		$this->unavailable_ability->expects( 'get_name' )->never();
		$this->unavailable_ability->expects( 'get_args' )->never();

		Monkey\Functions\expect( 'wp_register_ability' )
			->once()
			->with( 'yoast-seo/available', $args );

		$this->instance->register_abilities();
	}

	/**
	 * Tests that register_abilities registers nothing when no abilities were injected.
	 *
	 * @covers ::__construct
	 * @covers ::register_abilities
	 *
	 * @return void
	 */
	public function test_register_abilities_without_abilities() {
		Monkey\Functions\expect( 'wp_register_ability' )->never();

		( new Abilities_Integration() )->register_abilities();
	}
}
