<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Content_Planner_Integration;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Planner_Endpoints_Repository;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Tests the Content_Planner_Integration constructor.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Content_Planner_Integration_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $this->instance, 'asset_manager' ),
		);
		$this->assertInstanceOf(
			Content_Planner_Endpoints_Repository::class,
			$this->getPropertyValue( $this->instance, 'endpoints_repository' ),
		);
		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' ),
		);
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' ),
		);
	}
}
