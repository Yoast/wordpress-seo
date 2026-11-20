<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Admin\Author_Personal_Data_Export_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Author_Personal_Data_Export_Integration_Test.
 *
 * @group integrations
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Author_Personal_Data_Export_Integration
 */
final class Author_Personal_Data_Export_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Author_Personal_Data_Export_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
		$this->instance = new Author_Personal_Data_Export_Integration();
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[
				Admin_Conditional::class,
			],
			Author_Personal_Data_Export_Integration::get_conditionals(),
		);
	}

	/**
	 * Tests that the exporter filter is registered.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_filter( 'wp_privacy_personal_data_exporters', [ $this->instance, 'register_exporter' ] ) );
	}

	/**
	 * Tests that the Yoast SEO exporter is added.
	 *
	 * @covers ::register_exporter
	 *
	 * @return void
	 */
	public function test_register_exporter() {
		$exporters = [
			'wordpress-core' => [
				'exporter_friendly_name' => 'WordPress',
				'callback'               => 'wp_user_personal_data_exporter',
			],
		];

		$result = $this->instance->register_exporter( $exporters );

		$this->assertSame( 'wp_user_personal_data_exporter', $result['wordpress-core']['callback'] );
		$this->assertSame( 'Yoast SEO', $result['wordpress-seo']['exporter_friendly_name'] );
		$this->assertSame( [ $this->instance, 'export_author_data' ], $result['wordpress-seo']['callback'] );
	}

	/**
	 * Tests that a non-array exporter list is left unchanged.
	 *
	 * @covers ::register_exporter
	 *
	 * @return void
	 */
	public function test_register_exporter_ignores_non_array() {
		$this->assertSame( 'not-an-array', $this->instance->register_exporter( 'not-an-array' ) );
	}

	/**
	 * Tests that both author fields are exported.
	 *
	 * @covers ::export_author_data
	 *
	 * @return void
	 */
	public function test_export_author_data() {
		$this->stub_user( 'author@example.com', 5 );
		$this->stub_meta( 5, 'Author title', 'Author description' );

		$this->assertSame(
			$this->expected_export(
				5,
				[
					[
						'name'  => 'Title to use for Author page',
						'value' => 'Author title',
					],
					[
						'name'  => 'Meta description to use for Author page',
						'value' => 'Author description',
					],
				],
			),
			$this->instance->export_author_data( 'author@example.com', 1 ),
		);
	}

	/**
	 * Tests that empty author fields are left out of the export.
	 *
	 * @covers ::export_author_data
	 *
	 * @return void
	 */
	public function test_export_author_data_skips_empty_fields() {
		$this->stub_user( 'author@example.com', 5 );
		$this->stub_meta( 5, '   ', 'Author description' );

		$this->assertSame(
			$this->expected_export(
				5,
				[
					[
						'name'  => 'Meta description to use for Author page',
						'value' => 'Author description',
					],
				],
			),
			$this->instance->export_author_data( 'author@example.com' ),
		);
	}

	/**
	 * Tests that a user with no author fields produces no export rows.
	 *
	 * @covers ::export_author_data
	 *
	 * @return void
	 */
	public function test_export_author_data_with_no_values() {
		$this->stub_user( 'author@example.com', 5 );
		$this->stub_meta( 5, '', '' );

		$this->assertSame(
			[
				'data' => [],
				'done' => true,
			],
			$this->instance->export_author_data( 'author@example.com', 1 ),
		);
	}

	/**
	 * Tests that an unknown email produces no export rows.
	 *
	 * @covers ::export_author_data
	 *
	 * @return void
	 */
	public function test_export_author_data_for_unknown_user() {
		Monkey\Functions\expect( 'sanitize_email' )
			->once()
			->with( 'missing@example.com' )
			->andReturn( 'missing@example.com' );

		Monkey\Functions\expect( 'get_user_by' )
			->once()
			->with( 'email', 'missing@example.com' )
			->andReturn( false );

		$this->assertSame(
			[
				'data' => [],
				'done' => true,
			],
			$this->instance->export_author_data( 'missing@example.com', 1 ),
		);
	}

	/**
	 * Tests that an invalid email produces no export rows.
	 *
	 * @covers ::export_author_data
	 *
	 * @return void
	 */
	public function test_export_author_data_for_invalid_email() {
		Monkey\Functions\expect( 'sanitize_email' )
			->once()
			->with( 'not-an-email' )
			->andReturn( '' );

		$this->assertSame(
			[
				'data' => [],
				'done' => true,
			],
			$this->instance->export_author_data( 'not-an-email', 1 ),
		);
	}

	/**
	 * Tests that pages after the first produce no export rows.
	 *
	 * @covers ::export_author_data
	 *
	 * @return void
	 */
	public function test_export_author_data_is_done_after_first_page() {
		$this->assertSame(
			[
				'data' => [],
				'done' => true,
			],
			$this->instance->export_author_data( 'author@example.com', 2 ),
		);
	}

	/**
	 * Stubs the user lookup for an email address.
	 *
	 * @param string $email   Email address.
	 * @param int    $user_id User ID.
	 *
	 * @return void
	 */
	private function stub_user( $email, $user_id ) {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = $user_id;

		Monkey\Functions\expect( 'sanitize_email' )
			->once()
			->with( $email )
			->andReturn( $email );

		Monkey\Functions\expect( 'get_user_by' )
			->once()
			->with( 'email', $email )
			->andReturn( $user );
	}

	/**
	 * Stubs the two author meta values.
	 *
	 * @param int    $user_id  User ID.
	 * @param string $title    SEO title.
	 * @param string $metadesc Meta description.
	 *
	 * @return void
	 */
	private function stub_meta( $user_id, $title, $metadesc ) {
		Monkey\Functions\expect( 'get_user_meta' )
			->once()
			->with( $user_id, 'wpseo_title', true )
			->andReturn( $title );

		Monkey\Functions\expect( 'get_user_meta' )
			->once()
			->with( $user_id, 'wpseo_metadesc', true )
			->andReturn( $metadesc );
	}

	/**
	 * Builds the expected export payload.
	 *
	 * @param int                               $user_id User ID.
	 * @param array<int, array<string, string>> $rows    Exported name and value pairs.
	 *
	 * @return array<string, array<int, array<string, string|array<int, array<string, string>>>>|bool> Expected export response.
	 */
	private function expected_export( $user_id, array $rows ) {
		return [
			'data' => [
				[
					'group_id'    => 'yoast-seo',
					'group_label' => 'Yoast SEO',
					'item_id'     => 'yoast-seo-user-' . $user_id,
					'data'        => $rows,
				],
			],
			'done' => true,
		];
	}
}
