<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Updates;

use Brain\Monkey;
use Mockery;
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
	}

	/**
	 * Tests the title is sanitized and written to the title meta key.
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
}
