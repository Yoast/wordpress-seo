<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Domain\Usage_Parameters;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Generator\Domain\Usage_Parameters;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Usage_Parameters constructor and getters.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Usage_Parameters::__construct
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Usage_Parameters::get_user
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Usage_Parameters::is_free
 * @covers \Yoast\WP\SEO\AI\Generator\Domain\Usage_Parameters::get_period
 */
final class Usage_Parameters_Test extends TestCase {

	/**
	 * Tests the constructor populates all fields and the getters return them.
	 *
	 * @return void
	 */
	public function test_constructor_populates_all_fields() {
		$user = Mockery::mock( WP_User::class );

		$parameters = new Usage_Parameters( $user, true, '2026-06' );

		$this->assertSame( $user, $parameters->get_user() );
		$this->assertTrue( $parameters->is_free() );
		$this->assertSame( '2026-06', $parameters->get_period() );
	}

	/**
	 * Tests the is_free getter returns false when set to false.
	 *
	 * @return void
	 */
	public function test_is_free_returns_false_when_set_false() {
		$user = Mockery::mock( WP_User::class );

		$parameters = new Usage_Parameters( $user, false, '2026-06' );

		$this->assertFalse( $parameters->is_free() );
	}
}
