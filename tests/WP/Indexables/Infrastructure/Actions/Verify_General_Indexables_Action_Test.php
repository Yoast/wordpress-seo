<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Indexables\Infrastructure\Actions;

use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Outdated_Posts_Found_Exception;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_General_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Outdated_Post_Indexables_Repository;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\WP\TestCase;
use function YoastSEO;

/**
 * Integration Test Class for Verify_General_Indexables_Action.
 *
 * @coversDefaultClass Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_General_Indexables_Action
 */
class Verify_General_Indexables_Action_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Verify_General_Indexables_Action
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp(): void {
		parent::setUp();

		$this->instance = new Verify_General_Indexables_Action(
			YoastSEO()->classes->get( Indexable_Repository::class ),
			YoastSEO()->classes->get( Indexable_Builder::class )
		);
	}

	/**
	 * Tests the re_build_indexables method.
	 *
	 * @covers ::re_build_indexables
	 */
	public function test_re_build_indexables() {
		$repo       = YoastSEO()->classes->get( Indexable_Repository::class );
		$last_batch = new Last_Batch_Count( 0 );
		$batch_size = new Batch_Size( 10 );
		$this->instance->re_build_indexables( $last_batch, $batch_size );

		$this->assertInstanceOf( Indexable::class, $repo->find_for_system_page( '404', false ) );
		$this->assertInstanceOf( Indexable::class, $repo->find_for_system_page( 'search-result', false ) );
		$this->assertInstanceOf( Indexable::class, $repo->find_for_date_archive( false ) );
		$this->assertInstanceOf( Indexable::class, $repo->find_for_home_page( false ) );
	}
}
