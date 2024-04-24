<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Seo\Posts;

use Mockery;
use Yoast\WP\SEO\Editors\Framework\Seo\Posts\Keywords_Data_Provider;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Keywords_Data_Provider_Test
 *
 * @group editors
 *
 * @covers \Yoast\WP\SEO\Editors\Framework\Seo\Posts\Keywords_Data_Provider
 */
final class Keywords_Data_Provider_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Meta_Helper
	 */
	protected $meta_helper;

	/**
	 * The Keywords_Data_Provider feature.
	 *
	 * @var Keywords_Data_Provider
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->meta_helper = Mockery::mock( Meta_Helper::class );

		$this->instance = new Keywords_Data_Provider( $this->meta_helper );
	}
}
