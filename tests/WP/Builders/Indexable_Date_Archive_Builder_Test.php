<?php

namespace Yoast\WP\SEO\Tests\WP\Builders;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Integration Test Class.
 *
 * @coversDefaultClass Yoast\WP\SEO\Builders\Indexable_Date_Archive_Builder
 */
final class Indexable_Date_Archive_Builder_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Indexable_Date_Archive_Builder
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		$this->instance = new Indexable_Date_Archive_Builder(
			\YoastSEO()->helpers->options,
			\YoastSEO()->classes->get( 'Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions' )
		);
	}

	/**
	 * Tests the build method's happy path.
	 *
	 * @covers ::build
	 *
	 * @return void
	 */
	public function test_build() {
		$indexable      = new Indexable();
		$indexable->orm = ORM::for_table( 'wp_yoast_indexable' );

		$result = $this->instance->build( $indexable );

		$this->assertInstanceOf( Indexable::class, $result, 'The result should be an instance of Indexable.' );
		$this->assertEquals( 'date-archive', $result->object_type, 'object_type should be "post-type-archive".' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'title-archive-wpseo' ), $result->title, 'The title is not correct.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'metadesc-archive-wpseo' ), $result->description, 'The description is not correct.' );
		$this->assertEquals( null, $result->permalink, 'permalink is not correct.' );
		$this->assertEquals( \YoastSEO()->helpers->options->get( 'noindex-archive-wpseo' ), $result->is_robots_noindex, 'noindex-ptarchive-wpseo is not correct.' );
		$this->assertEquals( \get_current_blog_id(), $result->blog_id, 'The blog id is not correct.' );
	}
}
