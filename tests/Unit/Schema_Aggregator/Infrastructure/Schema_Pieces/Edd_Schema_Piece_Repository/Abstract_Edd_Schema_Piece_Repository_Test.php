<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository;

use Mockery;
use Yoast\WP\SEO\Conditionals\Third_Party\EDD_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\Edd_Schema_Piece_Repository;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Edd_Schema_Piece_Repository tests.
 *
 * @group schema-aggregator
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Edd_Schema_Piece_Repository_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Edd_Schema_Piece_Repository
	 */
	protected $instance;

	/**
	 * Holds the EDD_Conditional mock.
	 *
	 * @var Mockery\MockInterface|EDD_Conditional
	 */
	protected $edd_conditional;

	/**
	 * Holds the Meta_Surface mock.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	protected $meta;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->edd_conditional = Mockery::mock( EDD_Conditional::class );
		$this->meta            = Mockery::mock( Meta_Surface::class );

		$this->instance = new Edd_Schema_Piece_Repository(
			$this->edd_conditional,
			$this->meta
		);
	}
}
