<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Indexables\Infrastructure\Actions;

use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Links_Indexables_Action;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;
use function YoastSEO;

/**
 * Integration Test Class for Verify_Term_Links_Indexables_Action.
 *
 * @coversDefaultClass Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Links_Indexables_Action
 */
class Verify_Term_Links_Indexables_Action_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Verify_Term_Links_Indexables_Action
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();
		global $wpdb;
		$this->instance = new Verify_Term_Links_Indexables_Action(
			YoastSEO()->helpers->taxonomy,
			YoastSEO()->classes->get( Indexable_Repository::class ),
			YoastSEO()->classes->get( Indexable_Link_Builder::class )
		);
		$this->instance->set_wpdb( $wpdb );

		self::factory()->category->create(
			[
				'name'     => 'test_term',
				'taxonomy' => 'category',
			]
		);
	}

	/**
	 * Tests the re_build_indexables method.
	 *
	 * @covers ::re_build_indexables
	 */
	public function test_re_build_indexables() {
		$last_batch      = new Last_Batch_Count( 0 );
		$batch_size      = new Batch_Size( 10 );
		$should_continue = $this->instance->re_build_indexables( $last_batch, $batch_size );
		$taxonomies      = YoastSEO()->classes->get( Indexable_Repository::class )
			->find_all_with_type( 'term', false );

		foreach ( $taxonomies as $taxonomy ) {
			$this->assertInstanceOf( Indexable::class, $taxonomy );
		}
		$this->assertFalse( $should_continue );
	}

	/**
	 * Tests the re_build_indexables method.
	 *
	 * @covers ::re_build_indexables
	 */
	public function test_re_build_indexables_with_continue() {
		$last_batch      = new Last_Batch_Count( 0 );
		$batch_size      = new Batch_Size( 1 );
		$should_continue = $this->instance->re_build_indexables( $last_batch, $batch_size );
		$taxonomies      = YoastSEO()->classes->get( Indexable_Repository::class )
			->find_all_with_type( 'term', false );

		foreach ( $taxonomies as $taxonomy ) {
			$this->assertInstanceOf( Indexable::class, $taxonomy );
		}
		$this->assertTrue( $should_continue );
	}
}
