<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

use Mockery;
use WP_Screen;
use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for the Posts_Overview_Bulk_Actions_Integration tests.
 *
 * @group bulk-editor
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- The name mirrors the class under test.
 */
abstract class Abstract_Posts_Overview_Bulk_Actions_Integration_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Posts_Overview_Bulk_Actions_Integration
	 */
	protected $instance;

	/**
	 * Holds the Content_Types_Repository mock.
	 *
	 * @var Mockery\MockInterface|Content_Types_Repository
	 */
	protected $content_types_repository;

	/**
	 * Holds the Current_Page_Helper mock.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->content_types_repository = Mockery::mock( Content_Types_Repository::class );
		$this->current_page_helper      = Mockery::mock( Current_Page_Helper::class );

		$this->instance = new Posts_Overview_Bulk_Actions_Integration(
			$this->content_types_repository,
			$this->current_page_helper,
		);
	}

	/**
	 * Creates a WP_Screen mock for a post overview screen.
	 *
	 * @param string $post_type The screen post type.
	 *
	 * @return Mockery\MockInterface|WP_Screen The screen mock.
	 */
	protected function mock_screen( $post_type = 'post' ) {
		$screen            = Mockery::mock( 'WP_Screen' );
		$screen->post_type = $post_type;

		return $screen;
	}

	/**
	 * Creates the content types repository representation of the given post types.
	 *
	 * @param array<string> $post_types The post type names.
	 *
	 * @return array<array<string, string>> The content types.
	 */
	protected function content_types_for( array $post_types ) {
		$content_types = [];
		foreach ( $post_types as $post_type ) {
			$content_types[] = [
				'name'          => $post_type,
				'label'         => \ucfirst( $post_type ) . 's',
				'singularLabel' => \ucfirst( $post_type ),
			];
		}

		return $content_types;
	}
}
