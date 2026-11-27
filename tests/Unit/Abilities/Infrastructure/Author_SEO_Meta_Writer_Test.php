<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Meta_Writer;
use Yoast\WP\SEO\Helpers\Sanitization_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Author_SEO_Meta_Writer class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Author_SEO_Meta_Writer
 */
final class Author_SEO_Meta_Writer_Test extends TestCase {

	/**
	 * The user helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	private $user_helper;

	/**
	 * The sanitization helper mock.
	 *
	 * @var Mockery\MockInterface|Sanitization_Helper
	 */
	private $sanitization_helper;

	/**
	 * The instance under test.
	 *
	 * @var Author_SEO_Meta_Writer
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->user_helper         = Mockery::mock( User_Helper::class );
		$this->sanitization_helper = Mockery::mock( Sanitization_Helper::class );
		$this->sanitization_helper->shouldReceive( 'sanitize_text_field' )->andReturnArg( 0 )->byDefault();

		$this->instance = new Author_SEO_Meta_Writer( $this->user_helper, $this->sanitization_helper );
	}

	/**
	 * Tests that the touched columns are written to their user meta, and the profile is marked as updated.
	 *
	 * @covers ::__construct
	 * @covers ::write_columns
	 * @covers ::write_column
	 *
	 * @return void
	 */
	public function test_write_columns() {
		$indexable              = $this->make_indexable();
		$indexable->title       = 'New title';
		$indexable->description = null;

		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturn( Mockery::mock( 'WP_User' ) );
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, 'wpseo_title', 'New title' );
		// A cleared field is stored as an empty string, like the user profile does.
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, 'wpseo_metadesc', '' );
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, '_yoast_wpseo_profile_updated', Mockery::type( 'int' ) );

		$this->assertTrue( $this->instance->write_columns( $indexable, [ 'title', 'description' ] ) );
	}

	/**
	 * Tests that the string values are sanitized like the user profile does.
	 *
	 * @covers ::write_columns
	 * @covers ::write_column
	 *
	 * @return void
	 */
	public function test_write_columns_sanitizes_strings() {
		$indexable        = $this->make_indexable();
		$indexable->title = '<b>New title</b>';

		Monkey\Functions\expect( 'get_userdata' )->once()->andReturn( Mockery::mock( 'WP_User' ) );
		$this->sanitization_helper->expects( 'sanitize_text_field' )->once()->with( '<b>New title</b>' )->andReturn( 'New title' );
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, 'wpseo_title', 'New title' );
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, '_yoast_wpseo_profile_updated', Mockery::type( 'int' ) );

		$this->assertTrue( $this->instance->write_columns( $indexable, [ 'title' ] ) );
	}

	/**
	 * Tests that noindex is stored as 'on' when set, like the profile checkbox does.
	 *
	 * @covers ::write_columns
	 * @covers ::write_column
	 *
	 * @return void
	 */
	public function test_write_columns_noindex_set() {
		$indexable                    = $this->make_indexable();
		$indexable->is_robots_noindex = true;

		Monkey\Functions\expect( 'get_userdata' )->once()->andReturn( Mockery::mock( 'WP_User' ) );
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, 'wpseo_noindex_author', 'on' );
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, '_yoast_wpseo_profile_updated', Mockery::type( 'int' ) );
		$this->user_helper->expects( 'delete_meta' )->never();

		$this->assertTrue( $this->instance->write_columns( $indexable, [ 'is_robots_noindex' ] ) );
	}

	/**
	 * Tests that noindex is deleted when unset, like unticking the profile checkbox does.
	 *
	 * @covers ::write_columns
	 * @covers ::write_column
	 *
	 * @dataProvider provide_unset_noindex
	 *
	 * @param bool|null $value The column value.
	 *
	 * @return void
	 */
	public function test_write_columns_noindex_unset( $value ) {
		$indexable                    = $this->make_indexable();
		$indexable->is_robots_noindex = $value;

		Monkey\Functions\expect( 'get_userdata' )->once()->andReturn( Mockery::mock( 'WP_User' ) );
		$this->user_helper->expects( 'delete_meta' )->once()->with( 7, 'wpseo_noindex_author' );
		$this->user_helper->expects( 'update_meta' )->once()->with( 7, '_yoast_wpseo_profile_updated', Mockery::type( 'int' ) );

		$this->assertTrue( $this->instance->write_columns( $indexable, [ 'is_robots_noindex' ] ) );
	}

	/**
	 * Data provider for test_write_columns_noindex_unset.
	 *
	 * @return array<string, array<bool|null>> The cases.
	 */
	public static function provide_unset_noindex(): array {
		return [
			'false' => [ false ],
			'null'  => [ null ],
		];
	}

	/**
	 * Tests that a column without a user meta key is not written, and the profile is not marked as updated
	 * when nothing is written.
	 *
	 * @covers ::write_columns
	 *
	 * @return void
	 */
	public function test_write_columns_skips_unmapped_columns() {
		$indexable                 = $this->make_indexable();
		$indexable->is_cornerstone = true;

		Monkey\Functions\expect( 'get_userdata' )->once()->andReturn( Mockery::mock( 'WP_User' ) );
		$this->user_helper->expects( 'update_meta' )->never();
		$this->user_helper->expects( 'delete_meta' )->never();

		$this->assertTrue( $this->instance->write_columns( $indexable, [ 'is_cornerstone' ] ) );
	}

	/**
	 * Tests that nothing is written when the user does not exist.
	 *
	 * @covers ::write_columns
	 *
	 * @return void
	 */
	public function test_write_columns_unknown_user() {
		Monkey\Functions\expect( 'get_userdata' )->once()->with( 7 )->andReturnFalse();
		$this->user_helper->expects( 'update_meta' )->never();

		$this->assertFalse( $this->instance->write_columns( $this->make_indexable(), [ 'title' ] ) );
	}

	/**
	 * Builds a user indexable mock.
	 *
	 * @return Mockery\MockInterface|Indexable_Mock The indexable mock.
	 */
	private function make_indexable() {
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id   = 7;
		$indexable->object_type = 'user';

		return $indexable;
	}
}
