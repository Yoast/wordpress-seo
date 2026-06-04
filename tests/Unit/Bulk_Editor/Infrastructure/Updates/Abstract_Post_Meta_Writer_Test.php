<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Updates;

use Brain\Monkey;
use Mockery;
use WPSEO_Meta;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Abstract_Post_Meta_Writer;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the post meta writer tests.
 */
abstract class Abstract_Post_Meta_Writer_Test extends TestCase {

	/**
	 * The meta helper.
	 *
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	protected $meta_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Abstract_Post_Meta_Writer
	 */
	protected $instance;

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
	 * Creates the writer under test.
	 *
	 * @return Abstract_Post_Meta_Writer The writer under test.
	 */
	abstract protected function create_instance(): Abstract_Post_Meta_Writer;

	/**
	 * Gets the meta key (without prefix) the writer should store the title under.
	 *
	 * @return string The expected title meta key.
	 */
	abstract protected function get_expected_title_meta_key(): string;

	/**
	 * Gets the meta key (without prefix) the writer should store the description under.
	 *
	 * @return string The expected description meta key.
	 */
	abstract protected function get_expected_description_meta_key(): string;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->meta_helper = Mockery::mock( Meta_Helper::class );
		$this->instance    = $this->create_instance();

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
	 * Tests an unregistered field is sanitized with plain text sanitization and written to the title meta key.
	 *
	 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Abstract_Post_Meta_Writer::write_title
	 *
	 * @return void
	 */
	public function test_write_title() {
		$this->meta_helper->expects( 'set_value' )
			->with( $this->get_expected_title_meta_key(), 'The title', 123 );

		$this->instance->write_title( 123, "  The \t title  " );
	}

	/**
	 * Tests the description is sanitized and written to the description meta key.
	 *
	 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Abstract_Post_Meta_Writer::write_description
	 *
	 * @return void
	 */
	public function test_write_description() {
		$this->meta_helper->expects( 'set_value' )
			->with( $this->get_expected_description_meta_key(), 'The description', 123 );

		$this->instance->write_description( 123, "  The \t description  " );
	}

	/**
	 * Tests an empty string is written as-is, clearing the meta value.
	 *
	 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Abstract_Post_Meta_Writer::write_title
	 *
	 * @return void
	 */
	public function test_write_empty_title() {
		$this->meta_helper->expects( 'set_value' )
			->with( $this->get_expected_title_meta_key(), '', 123 );

		$this->instance->write_title( 123, '' );
	}

	/**
	 * Tests a registered field is routed through the canonical meta sanitizer, so the
	 * field-specific handling and the `wpseo_sanitize_post_meta_*` filter run.
	 *
	 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Abstract_Post_Meta_Writer::write_title
	 *
	 * @return void
	 */
	public function test_write_title_routes_registered_field_through_canonical_sanitizer() {
		$meta_key = WPSEO_Meta::$meta_prefix . $this->get_expected_title_meta_key();

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
			->with( $this->get_expected_title_meta_key(), 'The title', 123 );

		$this->instance->write_title( 123, '  The title  ' );
	}
}
