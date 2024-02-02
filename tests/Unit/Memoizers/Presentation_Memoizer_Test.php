<?php

namespace Yoast\WP\SEO\Tests\Unit\Memoizers;

use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Memoizers\Presentation_Memoizer_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class Presentation_Memoizer_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Memoizers\Presentation_Memoizer
 *
 * @group memoizers
 */
final class Presentation_Memoizer_Test extends TestCase {

	/**
	 * The service container.
	 *
	 * @var ContainerInterface
	 */
	protected $container;

	/**
	 * The meta tags context mock.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	protected $meta_tags_context_mock;

	/**
	 * The indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * The indexable presentation mock.
	 *
	 * @var Indexable_Presentation
	 */
	protected $indexable_presentation;

	/**
	 * Represents the instance to test.
	 *
	 * @var Presentation_Memoizer_Double
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		// Mock classes.
		$this->container              = Mockery::mock( ContainerInterface::class );
		$this->indexable_presentation = Mockery::mock( Indexable_Presentation::class );

		// Use existing mock classes.
		$this->indexable              = new Indexable_Mock();
		$this->meta_tags_context_mock = new Meta_Tags_Context_Mock();

		// Set values on mocks.
		$this->meta_tags_context_mock->presentation = new Indexable_Presentation();
		$this->indexable->id                        = 301;

		$this->instance = new Presentation_Memoizer_Double( $this->container );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			ContainerInterface::class,
			$this->getPropertyValue( $this->instance, 'container' )
		);
	}

	/**
	 * Tests getting the presentation of an indexable, when it already has been cached.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_when_presentation_has_been_cached() {
		$this->instance->set_cache( $this->indexable->id, $this->meta_tags_context_mock->presentation );

		$this->assertEquals( $this->meta_tags_context_mock->presentation, $this->instance->get( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' ) );
	}

	/**
	 * Tests getting the presentation of an indexable, when it has not been cached.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_without_cache() {
		$this->container
			->expects( 'get' )
			->once()
			->andReturn( $this->indexable_presentation );

		$this->indexable_presentation
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock->presentation );

		$this->assertEquals( $this->meta_tags_context_mock->presentation, $this->instance->get( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' ) );
	}

	/**
	 * Tests getting the presentation of an indexable, when it has not been cached,
	 * and the presentation has not been set.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get_without_cache_and_without_presentation() {
		$this->container
			->expects( 'get' )
			->once()
			->andReturnFalse();

		$this->container
			->expects( 'get' )
			->once()
			->andReturn( $this->indexable_presentation );

		$this->indexable_presentation
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock->presentation );

		$this->assertEquals( $this->meta_tags_context_mock->presentation, $this->instance->get( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' ) );
	}

	/**
	 * Tests clearing the memoization of an indexable when the indexable is given.
	 *
	 * If the cache is indeed empty, the 'get' method must call
	 * a number of other methods to fill the cache again.
	 *
	 * @covers ::clear
	 *
	 * @return void
	 */
	public function test_clear_for_indexable() {
		$this->instance->set_cache( 'not_an_instance_of_Indexable', $this->meta_tags_context_mock->presentation );

		$this->instance->clear( $this->indexable );

		$this->container
			->expects( 'get' )
			->once()
			->andReturn( $this->indexable_presentation );

		$this->indexable_presentation
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock->presentation );

		$this->instance->get( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' );
	}

	/**
	 * Tests clearing the memoization of an indexable when the ID is given.
	 *
	 * @covers ::clear
	 *
	 * @return void
	 */
	public function test_clear_for_indexable_when_id_is_given() {
		$this->instance->set_cache( $this->indexable->id, $this->meta_tags_context_mock->presentation );

		$this->instance->clear( $this->indexable->id );

		$this->container
			->expects( 'get' )
			->once()
			->andReturn( $this->indexable_presentation );

		$this->indexable_presentation
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock->presentation );

		$this->instance->get( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' );
	}

	/**
	 * Tests clearing the memoization of an indexable when the indexable is null.
	 *
	 * @covers ::clear
	 *
	 * @return void
	 */
	public function test_clear_for_indexable_when_indexable_is_null() {
		$this->instance->set_cache( $this->indexable->id, $this->meta_tags_context_mock->presentation );

		$this->instance->clear( null );

		$this->container
			->expects( 'get' )
			->once()
			->andReturn( $this->indexable_presentation );

		$this->indexable_presentation
			->expects( 'of' )
			->once()
			->andReturn( $this->meta_tags_context_mock->presentation );

		$this->instance->get( $this->indexable, $this->meta_tags_context_mock, 'the_page_type' );
	}
}
