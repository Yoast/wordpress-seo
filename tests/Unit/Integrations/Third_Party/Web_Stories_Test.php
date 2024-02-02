<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Integrations\Third_Party\Web_Stories;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Meta_Description_Presenter;
use Yoast\WP\SEO\Presenters\Title_Presenter;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Web Stories integration test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Web_Stories
 *
 * @group integrations
 * @group third-party
 */
final class Web_Stories_Test extends TestCase {

	/**
	 * The Web Stories integration.
	 *
	 * @var Web_Stories
	 */
	protected $instance;

	/**
	 * The front end integration.
	 *
	 * @var Front_End_Integration
	 */
	protected $front_end;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->front_end = Mockery::mock( Front_End_Integration::class );
		$this->instance  = new Web_Stories( $this->front_end );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Web_Stories_Conditional::class ],
			Web_Stories::get_conditionals()
		);
	}

	/**
	 * Tests constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Front_End_Integration::class,
			$this->getPropertyValue( $this->instance, 'front_end' )
		);
	}

	/**
	 * Tests register hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_filter( 'web_stories_enable_document_title', '__return_false' ), 'The enable document title filter is registered.' );
		$this->assertNotFalse( \has_filter( 'web_stories_enable_metadata', '__return_false' ), 'The enable metadata filter is registered.' );
		$this->assertNotFalse( \has_filter( 'wpseo_frontend_presenters', [ $this->instance, 'filter_frontend_presenters' ] ), 'The frontend presenters filter is registered.' );
		$this->assertNotFalse( \has_action( 'web_stories_enable_schemaorg_metadata', '__return_false' ), 'The enable metadata filter is registered.' );
		$this->assertNotFalse( \has_action( 'web_stories_enable_open_graph_metadata', '__return_false' ), 'The enable metadata filter is registered.' );
		$this->assertNotFalse( \has_action( 'web_stories_enable_twitter_metadata', '__return_false' ), 'The enable metadata filter is registered.' );
		$this->assertNotFalse( \has_action( 'web_stories_story_head', [ $this->instance, 'web_stories_story_head' ] ), 'The web-story head action is not registered' );
		$this->assertNotFalse( \has_filter( 'wpseo_schema_article_type', [ $this->instance, 'filter_schema_article_type' ] ), 'The filter schema article type function is registered.' );
		$this->assertNotFalse( \has_filter( 'wpseo_metadesc', [ $this->instance, 'filter_meta_description' ] ), 'The metadesc action is registered.' );
	}

	/**
	 * Tests filter_frontend_presenters method for stories.
	 *
	 * @covers ::filter_frontend_presenters
	 *
	 * @return void
	 */
	public function test_filter_frontend_presenters_stories() {
		$context                             = new Meta_Tags_Context_Mock();
		$context->indexable                  = new Indexable_Mock();
		$context->indexable->object_sub_type = 'web-story';

		$title_presenter = Mockery::mock( Title_Presenter::class );
		$other_presenter = Mockery::mock( Meta_Description_Presenter::class );

		// First case: a title presenter is already there.
		$presenters = [
			$title_presenter,
			$other_presenter,
		];

		$return_presenters = $this->instance->filter_frontend_presenters( $presenters, $context );

		$title_presenter_found = false;

		foreach ( $return_presenters as $item ) {
			if ( $item instanceof Title_Presenter ) {
				$title_presenter_found = true;
				$this->assertInstanceOf( Title_Presenter::class, $item );
			}
		}

		$this->assertTrue( $title_presenter_found );

		// Second case: a title presenter is not there yet, will be added.
		$presenters_no_title = [
			$other_presenter,
		];

		$return_presenters = $this->instance->filter_frontend_presenters( $presenters_no_title, $context );

		$title_presenter_found = false;

		foreach ( $return_presenters as $item ) {
			if ( $item instanceof Title_Presenter ) {
				$title_presenter_found = true;
				$this->assertInstanceOf( Title_Presenter::class, $item );
			}
		}

		$this->assertTrue( $title_presenter_found );
	}

	/**
	 * Tests filter_frontend_presenters method for other types.
	 *
	 * @covers ::filter_frontend_presenters
	 *
	 * @return void
	 */
	public function test_filter_frontend_presenters_other() {
		$context                             = new Meta_Tags_Context_Mock();
		$context->indexable                  = new Indexable_Mock();
		$context->indexable->object_sub_type = 'post';

		$title_presenter = Mockery::mock( Title_Presenter::class );
		$other_presenter = Mockery::mock( Meta_Description_Presenter::class );

		$presenters = [
			$title_presenter,
			$other_presenter,
		];

		$this->assertSame( $presenters, $this->instance->filter_frontend_presenters( $presenters, $context ) );
	}

	/**
	 * Tests web_stories_story_head integration.
	 *
	 * @covers ::web_stories_story_head
	 *
	 * @return void
	 */
	public function test_web_stories_story_head() {
		$this->instance->web_stories_story_head();

		$this->assertFalse( \has_action( 'web_stories_story_head', 'rel_canonical' ), 'The rel canonical action is not registered' );
		$this->assertNotFalse( \has_action( 'web_stories_story_head', [ $this->front_end, 'call_wpseo_head' ] ), 'The wpseo head action is registered.' );
	}

	/**
	 * Tests filtering the meta description.
	 *
	 * @covers ::filter_meta_description
	 *
	 * @return void
	 */
	public function test_filter_meta_description_prefilled() {
		$presentation = Mockery::mock( Indexable_Presentation::class );
		$actual       = $this->instance->filter_meta_description( 'Hello World', $presentation );
		$this->assertSame( 'Hello World', $actual );
	}

	/**
	 * Tests filtering the meta description.
	 *
	 * @covers ::filter_meta_description
	 *
	 * @return void
	 */
	public function test_filter_meta_description_different_object_sub_type() {
		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = Mockery::mock( ORM::class );
		$indexable->orm->expects( 'set' )->once();
		$indexable->orm->expects( 'get' )->withArgs( [ 'object_sub_type' ] )->andReturn( 'foo' );
		$indexable->object_sub_type = 'foo';

		$presentation        = Mockery::mock( Indexable_Presentation::class );
		$presentation->model = $indexable;

		$actual = $this->instance->filter_meta_description( '', $presentation );
		$this->assertSame( '', $actual );
	}

	/**
	 * Tests filtering the meta description.
	 *
	 * @covers ::filter_meta_description
	 *
	 * @return void
	 */
	public function test_filter_meta_description() {
		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = Mockery::mock( ORM::class );
		$indexable->orm->expects( 'set' )->once();
		$indexable->orm->expects( 'get' )->withArgs( [ 'object_sub_type' ] )->andReturn( 'web-story' );
		$indexable->orm->expects( 'get' )->withArgs( [ 'object_id' ] )->andReturn( 123 );
		$indexable->object_sub_type = 'foo';

		$presentation        = Mockery::mock( Indexable_Presentation::class );
		$presentation->model = $indexable;

		Monkey\Functions\expect( 'get_the_excerpt' )->once()->andReturn( 'Hello World' );

		$actual = $this->instance->filter_meta_description( '', $presentation );
		$this->assertSame( 'Hello World', $actual );
	}

	/**
	 * Tests filter schema article post types for stories.
	 *
	 * @covers ::filter_schema_article_type
	 *
	 * @return void
	 */
	public function test_filter_schema_article_type_stories() {
		Mockery::namedMock( '\Google\Web_Stories\Story_Post_Type', Story_Post_Type_Stub::class );

		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->orm->allows( 'get' )->with( 'object_sub_type' )->andReturn( 'web-story' );

		$actual = $this->instance->filter_schema_article_type( 'None', $indexable );
		$this->assertEquals( 'Article', $actual );

		$actual = $this->instance->filter_schema_article_type( 'TechArticle', $indexable );
		$this->assertEquals( 'TechArticle', $actual );
	}

	/**
	 * Tests filter schema article post types for other indexables.
	 *
	 * @covers ::filter_schema_article_type
	 *
	 * @return void
	 */
	public function test_filter_schema_article_type_others() {
		Mockery::namedMock( '\Google\Web_Stories\Story_Post_Type', Story_Post_Type_Stub::class );

		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$indexable->orm->allows( 'get' )->with( 'object_sub_type' )->andReturn( 'post' );

		$actual = $this->instance->filter_schema_article_type( 'None', $indexable );
		$this->assertEquals( 'None', $actual );
	}
}

// phpcs:ignore -- Convert this to a double if more logic is needed.
class Story_Post_Type_Stub {
	public const POST_TYPE_SLUG = 'web-story';
}
