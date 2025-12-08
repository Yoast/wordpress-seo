<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Abstract_Schema_Enhancer;

use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Abstract_Schema_Enhancer;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Abstract_Schema_Enhancer tests.
 */
abstract class Abstract_Abstract_Schema_Enhancer_Test extends TestCase {

	/**
	 * The instance under test (concrete implementation for testing).
	 *
	 * @var Concrete_Schema_Enhancer_For_Testing
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Concrete_Schema_Enhancer_For_Testing();
	}
}

/**
 * Concrete implementation of Abstract_Schema_Enhancer for testing protected methods.
 */
class Concrete_Schema_Enhancer_For_Testing extends Abstract_Schema_Enhancer {

	/**
	 * Exposes the protected trim_content_to_max_length method for testing.
	 *
	 * @param int    $max_length Maximum length of content.
	 * @param string $content    The content to trim.
	 *
	 * @return string The trimmed content.
	 */
	public function public_trim_content_to_max_length( int $max_length, string $content ): string {
		return $this->trim_content_to_max_length( $max_length, $content );
	}
}
