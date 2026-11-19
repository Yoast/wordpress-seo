<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Features;

use Mockery;
use Yoast\WP\SEO\Abilities\Domain\Feature_Interface;
use Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Feature_Repository class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Features\Feature_Repository
 */
final class Feature_Repository_Test extends TestCase {

	/**
	 * An available feature.
	 *
	 * @var Mockery\MockInterface|Feature_Interface
	 */
	private $available_feature;

	/**
	 * A feature that cannot be changed on the site.
	 *
	 * @var Mockery\MockInterface|Feature_Interface
	 */
	private $unavailable_feature;

	/**
	 * The instance under test.
	 *
	 * @var Feature_Repository
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->available_feature   = Mockery::mock(
			Feature_Interface::class,
			[
				'get_key'      => 'open_graph',
				'is_available' => true,
			],
		);
		$this->unavailable_feature = Mockery::mock(
			Feature_Interface::class,
			[
				'get_key'      => 'llms_txt',
				'is_available' => false,
			],
		);

		$this->instance = new Feature_Repository( $this->available_feature, $this->unavailable_feature );
	}

	/**
	 * Tests that get returns the feature with the given key, whether it is available or not.
	 *
	 * @covers ::__construct
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->assertSame( $this->available_feature, $this->instance->get( 'open_graph' ) );
		$this->assertSame( $this->unavailable_feature, $this->instance->get( 'llms_txt' ) );
	}

	/**
	 * Tests that get returns null for a key that no feature has.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_unknown_key() {
		$this->assertNull( $this->instance->get( 'unknown' ) );
	}

	/**
	 * Tests that get_available leaves out the features that cannot be changed on the site.
	 *
	 * @covers ::get_available
	 *
	 * @return void
	 */
	public function test_get_available() {
		$this->assertSame( [ $this->available_feature ], $this->instance->get_available() );
	}
}
