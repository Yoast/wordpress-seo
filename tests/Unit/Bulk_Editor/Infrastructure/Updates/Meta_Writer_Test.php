<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Updates;

use Brain\Monkey;
use Mockery;
use WPSEO_Meta;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Meta_Writer;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Meta_Writer.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Meta_Writer
 */
final class Meta_Writer_Test extends TestCase {

	/**
	 * The meta helper.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	private $meta_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Meta_Writer
	 */
	private $instance;

	/**
	 * Snapshot of WPSEO_Meta::$fields_index to restore after each test.
	 *
	 * @var array<string, array<string, string>>
	 */
	private $fields_index_snapshot;

	/**
	 * Snapshot of WPSEO_Meta::$defaults to restore after each test.
	 *
	 * @var array<string, string>
	 */
	private $defaults_snapshot;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->meta_helper = Mockery::mock( Meta_Helper::class );
		$this->instance    = new Meta_Writer( $this->meta_helper );

		// WPSEO_Utils::sanitize_text_field() delegates to this WordPress function.
		Monkey\Functions\when( 'wp_check_invalid_utf8' )->returnArg();

		// The registration state is a global static; snapshot it and start from a clean
		// slate so each test controls whether the field under test is registered.
		$this->fields_index_snapshot = WPSEO_Meta::$fields_index;
		$this->defaults_snapshot     = WPSEO_Meta::$defaults;
		WPSEO_Meta::$fields_index    = [];
	}

	/**
	 * Restores the global registration state.
	 *
	 * @return void
	 */
	protected function tear_down() {
		WPSEO_Meta::$fields_index = $this->fields_index_snapshot;
		WPSEO_Meta::$defaults     = $this->defaults_snapshot;

		parent::tear_down();
	}

	/**
	 * Provides each update type with the meta key its title is stored under.
	 *
	 * @return array<string, array{0: Update_Type, 1: string}> The update type and expected title meta key.
	 */
	public static function provide_title_cases(): array {
		return [
			'search appearance' => [ Update_Type::search(), 'title' ],
			'social appearance' => [ Update_Type::social(), 'opengraph-title' ],
		];
	}

	/**
	 * Provides each update type with the meta key its description is stored under.
	 *
	 * @return array<string, array{0: Update_Type, 1: string}> The update type and expected description meta key.
	 */
	public static function provide_description_cases(): array {
		return [
			'search appearance' => [ Update_Type::search(), 'metadesc' ],
			'social appearance' => [ Update_Type::social(), 'opengraph-description' ],
		];
	}

	/**
	 * Tests an unregistered field is sanitized with plain text sanitization and written to the title meta key.
	 *
	 * @dataProvider provide_title_cases
	 *
	 * @param Update_Type $type      The appearance the title belongs to.
	 * @param string      $title_key The meta key the title should be stored under.
	 *
	 * @return void
	 */
	public function test_write_title( Update_Type $type, string $title_key ) {
		$this->meta_helper->expects( 'set_value' )
			->with( $title_key, 'The title', 123 );

		$this->instance->write_title( $type, 123, "  The \t title  " );
	}

	/**
	 * Tests the description is sanitized and written to the description meta key.
	 *
	 * @dataProvider provide_description_cases
	 *
	 * @param Update_Type $type            The appearance the description belongs to.
	 * @param string      $description_key The meta key the description should be stored under.
	 *
	 * @return void
	 */
	public function test_write_description( Update_Type $type, string $description_key ) {
		$this->meta_helper->expects( 'set_value' )
			->with( $description_key, 'The description', 123 );

		$this->instance->write_description( $type, 123, "  The \t description  " );
	}

	/**
	 * Tests the focus keyphrase is sanitized and written to the focuskw meta key.
	 *
	 * @return void
	 */
	public function test_write_focus_keyphrase() {
		$this->meta_helper->expects( 'set_value' )
			->with( 'focuskw', 'The keyphrase', 123 );

		$this->instance->write_focus_keyphrase( 123, "  The \t keyphrase  " );
	}

	/**
	 * Tests an empty string is written as-is, clearing the meta value.
	 *
	 * @dataProvider provide_title_cases
	 *
	 * @param Update_Type $type      The appearance the title belongs to.
	 * @param string      $title_key The meta key the title should be stored under.
	 *
	 * @return void
	 */
	public function test_write_empty_title( Update_Type $type, string $title_key ) {
		$this->meta_helper->expects( 'set_value' )
			->with( $title_key, '', 123 );

		$this->instance->write_title( $type, 123, '' );
	}

	/**
	 * Tests an empty focus keyphrase is written as-is, clearing the meta value.
	 *
	 * @return void
	 */
	public function test_write_empty_focus_keyphrase() {
		$this->meta_helper->expects( 'set_value' )
			->with( 'focuskw', '', 123 );

		$this->instance->write_focus_keyphrase( 123, '' );
	}

	/**
	 * Tests a score is cast to a string and written to its meta key.
	 *
	 * @return void
	 */
	public function test_write_score() {
		$this->meta_helper->expects( 'set_value' )
			->with( 'seo_title_score', '63', 123 );

		$this->instance->write_score( 123, 'seo_title_score', 63 );
	}

	/**
	 * Tests a registered field is routed through the canonical meta sanitizer, so the
	 * field-specific handling and the `wpseo_sanitize_post_meta_*` filter run.
	 *
	 * @dataProvider provide_title_cases
	 *
	 * @param Update_Type $type      The appearance the title belongs to.
	 * @param string      $title_key The meta key the title should be stored under.
	 *
	 * @return void
	 */
	public function test_write_title_routes_registered_field_through_canonical_sanitizer( Update_Type $type, string $title_key ) {
		$meta_key = WPSEO_Meta::$meta_prefix . $title_key;

		// Register the field, pointing at the always-present general/title hidden field definition.
		WPSEO_Meta::$fields_index[ $meta_key ] = [
			'subset' => 'general',
			'key'    => 'title',
		];
		WPSEO_Meta::$defaults[ $meta_key ]     = '';

		Monkey\Filters\expectApplied( 'wpseo_sanitize_post_meta_' . $meta_key )
			->once()
			->andReturnUsing(
				static function ( $clean ) {
					return $clean;
				},
			);

		$this->meta_helper->expects( 'set_value' )
			->with( $title_key, 'The title', 123 );

		$this->instance->write_title( $type, 123, '  The title  ' );
	}

	/**
	 * Tests the registered focus keyphrase field is routed through the canonical meta
	 * sanitizer, so the field-specific handling and the `wpseo_sanitize_post_meta_*` filter run.
	 *
	 * @return void
	 */
	public function test_write_focus_keyphrase_routes_registered_field_through_canonical_sanitizer() {
		$meta_key = WPSEO_Meta::$meta_prefix . 'focuskw';

		WPSEO_Meta::$fields_index[ $meta_key ] = [
			'subset' => 'general',
			'key'    => 'focuskw',
		];
		WPSEO_Meta::$defaults[ $meta_key ]     = '';

		Monkey\Filters\expectApplied( 'wpseo_sanitize_post_meta_' . $meta_key )
			->once()
			->andReturnUsing(
				static function ( $clean ) {
					return $clean;
				},
			);

		$this->meta_helper->expects( 'set_value' )
			->with( 'focuskw', 'The keyphrase', 123 );

		$this->instance->write_focus_keyphrase( 123, '  The keyphrase  ' );
	}
}
