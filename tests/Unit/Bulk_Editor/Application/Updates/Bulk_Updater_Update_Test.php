<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Application\Updates;

use Exception;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Post_Update_Collection;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Error;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;

/**
 * Test class for the update method of the bulk updater.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Application\Updates\Bulk_Updater
 */
final class Bulk_Updater_Update_Test extends Abstract_Bulk_Updater_Test {

	/**
	 * Tests a post that does not exist fails with not_found.
	 *
	 * @return void
	 */
	public function test_update_not_found() {
		$this->post_access_checker->expects( 'exists' )->with( 123 )->andReturnFalse();

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$this->assertSame(
			[
				'results' => [
					[
						'id'      => 123,
						'success' => false,
						'error'   => Update_Error::NOT_FOUND,
					],
				],
			],
			$this->instance->update( Update_Type::search(), $updates )->to_array(),
		);
	}

	/**
	 * Tests a post of an unsupported type fails with invalid_post_type.
	 *
	 * @return void
	 */
	public function test_update_invalid_post_type() {
		$this->post_access_checker->expects( 'exists' )->with( 123 )->andReturnTrue();
		$this->post_access_checker->expects( 'is_supported_type' )->with( 123 )->andReturnFalse();

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$results = $this->instance->update( Update_Type::search(), $updates )->to_array();

		$this->assertSame( Update_Error::INVALID_POST_TYPE, $results['results'][0]['error'] );
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

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$results = $this->instance->update( Update_Type::search(), $updates )->to_array();

		$this->assertSame( Update_Error::FORBIDDEN, $results['results'][0]['error'] );
	}

	/**
	 * Tests an update carrying only a title writes only the title.
	 *
	 * @return void
	 */
	public function test_update_title_only() {
		$type = Update_Type::search();
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_title' )->with( $type, 123, 'The title' );
		$this->meta_writer->expects( 'write_description' )->never();

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$results = $this->instance->update( $type, $updates )->to_array();

		$this->assertTrue( $results['results'][0]['success'] );
	}

	/**
	 * Tests an update carrying only a description writes only the description.
	 *
	 * @return void
	 */
	public function test_update_description_only() {
		$type = Update_Type::search();
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_title' )->never();
		$this->meta_writer->expects( 'write_description' )->with( $type, 123, 'The description' );

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, null, 'The description' ) );

		$results = $this->instance->update( $type, $updates )->to_array();

		$this->assertTrue( $results['results'][0]['success'] );
	}

	/**
	 * Tests an update carrying both fields writes both, including empty strings.
	 *
	 * @return void
	 */
	public function test_update_both_fields() {
		$type = Update_Type::search();
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_title' )->with( $type, 123, 'The title' );
		$this->meta_writer->expects( 'write_description' )->with( $type, 123, '' );

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', '' ) );

		$results = $this->instance->update( $type, $updates )->to_array();

		$this->assertTrue( $results['results'][0]['success'] );
	}

	/**
	 * Tests the update type is forwarded to the meta writer.
	 *
	 * @return void
	 */
	public function test_update_forwards_type_to_writer() {
		$type = Update_Type::social();
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_title' )->with( $type, 123, 'The title' );

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$results = $this->instance->update( $type, $updates )->to_array();

		$this->assertTrue( $results['results'][0]['success'] );
	}

	/**
	 * Tests a throwing writer fails the update with save_failed.
	 *
	 * @return void
	 */
	public function test_update_save_failed() {
		$type = Update_Type::search();
		$this->expect_editable_post( 123 );
		$this->meta_writer->expects( 'write_title' )->with( $type, 123, 'The title' )->andThrow( new Exception( 'Database error.' ) );

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 123, 'The title', null ) );

		$results = $this->instance->update( $type, $updates )->to_array();

		$this->assertSame( Update_Error::SAVE_FAILED, $results['results'][0]['error'] );
	}

	/**
	 * Tests updates are applied independently: one failing update does not block the others.
	 *
	 * @return void
	 */
	public function test_update_failures_do_not_block_other_updates() {
		$type = Update_Type::search();
		$this->post_access_checker->expects( 'exists' )->with( 1 )->andReturnFalse();
		$this->expect_editable_post( 2 );
		$this->meta_writer->expects( 'write_title' )->with( $type, 2, 'Second title' );

		$updates = new Post_Update_Collection();
		$updates->add( new Post_Update( 1, 'First title', null ) );
		$updates->add( new Post_Update( 2, 'Second title', null ) );

		$this->assertSame(
			[
				'results' => [
					[
						'id'      => 1,
						'success' => false,
						'error'   => Update_Error::NOT_FOUND,
					],
					[
						'id'      => 2,
						'success' => true,
					],
				],
			],
			$this->instance->update( $type, $updates )->to_array(),
		);
	}

	/**
	 * Tests an empty collection yields an empty result collection.
	 *
	 * @return void
	 */
	public function test_update_empty_collection() {
		$this->assertSame(
			[ 'results' => [] ],
			$this->instance->update( Update_Type::search(), new Post_Update_Collection() )->to_array(),
		);
	}
}
