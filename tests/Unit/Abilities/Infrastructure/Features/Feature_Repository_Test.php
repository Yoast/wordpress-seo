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
	 * The Open Graph feature.
	 *
	 * @var Mockery\MockInterface|Feature_Interface
	 */
	private $open_graph_feature;

	/**
	 * The llms.txt feature.
	 *
	 * @var Mockery\MockInterface|Feature_Interface
	 */
	private $llms_txt_feature;

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

		$this->open_graph_feature = Mockery::mock( Feature_Interface::class, [ 'get_key' => 'open_graph' ] );
		$this->llms_txt_feature   = Mockery::mock( Feature_Interface::class, [ 'get_key' => 'llms_txt' ] );

		$this->instance = new Feature_Repository( $this->open_graph_feature, $this->llms_txt_feature );
	}

	/**
	 * Tests that get returns the feature with the given key.
	 *
	 * @covers ::__construct
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->assertSame( $this->open_graph_feature, $this->instance->get( 'open_graph' ) );
		$this->assertSame( $this->llms_txt_feature, $this->instance->get( 'llms_txt' ) );
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
	 * Tests that get_all returns all the features, as a list.
	 *
	 * @covers ::get_all
	 *
	 * @return void
	 */
	public function test_get_all() {
		$this->assertSame( [ $this->open_graph_feature, $this->llms_txt_feature ], $this->instance->get_all() );
	}
}
