<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Updates;

use Exception;
use Mockery;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Meta_Writer_Interface;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Post_Access_Checker_Interface;
use Yoast\WP\SEO\Bulk_Editor\Application\Updates\Score_Updater;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Score_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Error;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use YoastSEO_Vendor\Psr\Log\LoggerInterface;

/**
 * Test class for the update method of the score updater.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Application\Updates\Score_Updater
 */
final class Score_Updater_Update_Test extends TestCase {

	/**
	 * The post access checker.
	 *
	 * @var Mockery\MockInterface|Post_Access_Checker_Interface
	 */
	private $post_access_checker;

	/**
	 * The meta writer.
	 *
	 * @var Mockery\MockInterface|Meta_Writer_Interface
	 */
	private $meta_writer;

	/**
	 * Holds the instance.
	 *
	 * @var Score_Updater
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->post_access_checker = Mockery::mock( Post_Access_Checker_Interface::class );
		$this->meta_writer         = Mockery::mock( Meta_Writer_Interface::class );

		$this->instance = new Score_Updater( $this->post_access_checker, $this->meta_writer );
		$this->instance->setLogger( Mockery::mock( LoggerInterface::class )->shouldIgnoreMissing() );
	}

	/**
	 * Lets the access checker report the given post as fully editable.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return void
	 */
	private function expect_editable_post( int $post_id ): void {
		$this->post_access_checker->expects( 'exists' )->with( $post_id )->andReturnTrue();
		$this->post_access_checker->expects( 'is_supported_type' )->with( $post_id )->andReturnTrue();
		$this->post_access_checker->expects( 'can_edit' )->with( $post_id )->andReturnTrue();
	}

	/**
	 * Tests both scores are written to their meta keys.
	 *
	 * @return void
	 */
	public function test_update_writes_both_scores() {
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_score' )->with( 123, 'seo_title_score', 63 );
		$this->meta_writer->expects( 'write_score' )->with( 123, 'meta_description_score', 85 );

		$results = $this->instance->update( [ new Post_Score_Update( 123, 63, 85 ) ] )->to_array();

		$this->assertTrue( $results['results'][0]['success'] );
	}

	/**
	 * Tests only the SEO title score is written when it is the only score in the update.
	 *
	 * @return void
	 */
	public function test_update_writes_only_the_provided_score() {
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_score' )->with( 123, 'seo_title_score', 63 );
		$this->meta_writer->expects( 'write_score' )->with( 123, 'meta_description_score', Mockery::any() )->never();

		$results = $this->instance->update( [ new Post_Score_Update( 123, 63, null ) ] )->to_array();

		$this->assertTrue( $results['results'][0]['success'] );
	}

	/**
	 * Tests a post that does not exist fails with not_found.
	 *
	 * @return void
	 */
	public function test_update_not_found() {
		$this->post_access_checker->expects( 'exists' )->with( 123 )->andReturnFalse();
		$this->meta_writer->expects( 'write_score' )->never();

		$results = $this->instance->update( [ new Post_Score_Update( 123, 63, null ) ] )->to_array();

		$this->assertSame( Update_Error::NOT_FOUND, $results['results'][0]['error'] );
	}

	/**
	 * Tests a post the user may not edit fails with forbidden.
	 *
	 * @return void
	 */
	public function test_update_forbidden() {
		$this->post_access_checker->expects( 'exists' )->with( 123 )->andReturnTrue();
		$this->post_access_checker->expects( 'is_supported_type' )->with( 123 )->andReturnTrue();
		$this->post_access_checker->expects( 'can_edit' )->with( 123 )->andReturnFalse();
		$this->meta_writer->expects( 'write_score' )->never();

		$results = $this->instance->update( [ new Post_Score_Update( 123, 63, null ) ] )->to_array();

		$this->assertSame( Update_Error::FORBIDDEN, $results['results'][0]['error'] );
	}

	/**
	 * Tests a throwing writer fails the update with save_failed.
	 *
	 * @return void
	 */
	public function test_update_save_failed() {
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_score' )
			->with( 123, 'seo_title_score', 63 )
			->andThrow( new Exception( 'Database error.' ) );

		$results = $this->instance->update( [ new Post_Score_Update( 123, 63, null ) ] )->to_array();

		$this->assertSame( Update_Error::SAVE_FAILED, $results['results'][0]['error'] );
	}

	/**
	 * Tests updates are applied independently: one failing update does not block the others.
	 *
	 * @return void
	 */
	public function test_update_failures_do_not_block_other_updates() {
		$this->post_access_checker->expects( 'exists' )->with( 1 )->andReturnFalse();
		$this->expect_editable_post( 2 );
		$this->meta_writer->expects( 'write_score' )->with( 2, 'seo_title_score', 40 );

		$results = $this->instance->update(
			[
				new Post_Score_Update( 1, 30, null ),
				new Post_Score_Update( 2, 40, null ),
			],
		)->to_array();

		$this->assertFalse( $results['results'][0]['success'] );
		$this->assertTrue( $results['results'][1]['success'] );
	}

	/**
	 * Tests an empty batch yields an empty result collection.
	 *
	 * @return void
	 */
	public function test_update_empty_batch() {
		$this->assertSame( [ 'results' => [] ], $this->instance->update( [] )->to_array() );
	}
}
