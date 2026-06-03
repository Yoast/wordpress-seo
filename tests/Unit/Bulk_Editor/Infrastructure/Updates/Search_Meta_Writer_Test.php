<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Infrastructure\Updates;

use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Abstract_Post_Meta_Writer;
use Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Search_Meta_Writer;

/**
 * Test class for the Search_Meta_Writer.
 *
 * @group Bulk_Editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Abstract_Post_Meta_Writer
 * @covers Yoast\WP\SEO\Bulk_Editor\Infrastructure\Updates\Search_Meta_Writer
 */
final class Search_Meta_Writer_Test extends Abstract_Post_Meta_Writer_Test {

	/**
	 * Creates the writer under test.
	 *
	 * @return Abstract_Post_Meta_Writer The writer under test.
	 */
	protected function create_instance(): Abstract_Post_Meta_Writer {
		return new Search_Meta_Writer( $this->meta_helper );
	}

	/**
	 * Gets the meta key the SEO title should be stored under.
	 *
	 * @return string The expected title meta key.
	 */
	protected function get_expected_title_meta_key(): string {
		return 'title';
	}

	/**
	 * Gets the meta key the meta description should be stored under.
	 *
	 * @return string The expected description meta key.
	 */
	protected function get_expected_description_meta_key(): string {
		return 'metadesc';
	}
}
