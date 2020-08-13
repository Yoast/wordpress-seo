<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Tests\Unit\Doubles\Indexable_Social_Image_Trait_Double;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Social_Image_Trait_Test
 *
 * @group indexables
 * @group builders
 */
class Indexable_Social_Image_Trait_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Indexable_Social_Image_Trait_Double
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 */
	protected function setUp() {
		parent::setUp();

		$this->instance = new Indexable_Social_Image_Trait_Double();
	}

	/**
	 * Tests the resetting of social images.
	 */
	public function test_reset_social_images() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image', null );
		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image_id', null );
		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image_source', null );
		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image_meta', null );

		$this->indexable->orm->expects( 'set' )->with( 'twitter_image', null );
		$this->indexable->orm->expects( 'set' )->with( 'twitter_image_id', null );
		$this->indexable->orm->expects( 'set' )->with( 'twitter_image_source', null );

		$this->instance->reset_social_images_double( $this->indexable );
	}
}
