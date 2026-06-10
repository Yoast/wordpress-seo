<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Updates;

use Exception;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;

/**
 * Test class for the logging behaviour of the bulk updater.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Application\Updates\Bulk_Updater
 */
final class Bulk_Updater_Logging_Test extends Abstract_Bulk_Updater_Test {

	/**
	 * Tests a save failure is logged with the post id and the underlying error.
	 *
	 * @return void
	 */
	public function test_logs_warning_on_save_failed() {
		$type = Update_Type::search();
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_title' )->with( $type, 123, 'The title' )->andThrow( new Exception( 'Database error.' ) );

		$this->logger->expects( 'warning' )->once()->with(
			'Bulk update failed to save post {post_id}: {error}',
			[
				'post_id' => 123,
				'error'   => 'Database error.',
			],
		);

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$this->instance->update( $type, $updates );
	}

	/**
	 * Tests a successful update does not log a warning.
	 *
	 * @return void
	 */
	public function test_does_not_log_warning_on_success() {
		$type = Update_Type::search();
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_title' )->with( $type, 123, 'The title' );

		$this->logger->expects( 'warning' )->never();

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$this->instance->update( $type, $updates );
	}
}
