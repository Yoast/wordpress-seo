<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Indexables\Infrastructure\Actions;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_General_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Post_Type_Archives_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Outdated_Post_Indexables_Repository;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;
use function YoastSEO;

/**
 * Integration Test Class for Verify_Post_Type_Archives_Indexables_Action.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @coversDefaultClass Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Post_Type_Archives_Indexables_Action
 */
class Verify_Post_Type_Archives_Indexables_Action_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Verify_Post_Type_Archives_Indexables_Action
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();

		$this->instance = new Verify_Post_Type_Archives_Indexables_Action(
			YoastSEO()->helpers->post_type,
			YoastSEO()->classes->get( Indexable_Builder::class ),
			YoastSEO()->classes->get( Indexable_Repository::class )
		);
	}

	/**
	 * Tests the re_build_indexables method.
	 *
	 * @covers ::re_build_indexables
	 */
	public function test_re_build_indexables() {
		$repo            = YoastSEO()->classes->get( Indexable_Repository::class );
		$last_batch      = new Last_Batch_Count( 0 );
		$batch_size      = new Batch_Size( 10 );
		$should_continue = $this->instance->re_build_indexables( $last_batch, $batch_size );
		$archives        = YoastSEO()->helpers->post_type->get_indexable_post_archives();


		foreach ( $archives as $post_type_archive ) {
			$archive_indexable = YoastSEO()->classes->get( Indexable_Repository::class )
				->find_for_post_type_archive( $post_type_archive->name, false );
			$this->assertInstanceOf( Indexable::class, $archive_indexable );
		}
		$this->assertFalse( $should_continue );
	}

	/**
	 * Tests the re_build_indexables method.
	 *
	 * @covers ::re_build_indexables
	 */
	public function test_re_build_indexables_should_continue() {
		for ( $i = 0; $i < 10; $i++ ) {
			\register_post_type(
				'post_type_' . $i,
				[
					'public'      => true,
					'has_archive' => true,
					'description' => 'a cool post type',
					'label'       => 'post_type_' . $i,
				]
			);
			$post = [
				'post_date'   => '1978-09-13 08:50:00',
				'post_status' => 'publish',
				'post_type'   => 'post_type_' . $i,
			];
			self::factory()->post->create( $post );
		}
		$last_batch      = new Last_Batch_Count( 0 );
		$batch_size      = new Batch_Size( 2 );
		$should_continue = $this->instance->re_build_indexables( $last_batch, $batch_size );
		$archives        = YoastSEO()->helpers->post_type->get_indexable_post_archives();

		$archives = \array_slice( $archives, $last_batch->get_last_batch(), ( $last_batch->get_last_batch() + $batch_size->get_batch_size() ) );

		foreach ( $archives as $post_type_archive ) {
			$archive_indexable = YoastSEO()->classes->get( Indexable_Repository::class )
				->find_for_post_type_archive( $post_type_archive->name, false );
			$this->assertInstanceOf( Indexable::class, $archive_indexable );
		}
		$this->assertTrue( $should_continue );
	}
}
