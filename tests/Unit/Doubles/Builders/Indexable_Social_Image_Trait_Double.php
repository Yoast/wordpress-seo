<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use Yoast\WP\SEO\Builders\Indexable_Social_Image_Trait;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Social_Image_Trait_Double.
 */
trait Indexable_Social_Image_Trait_Double {

	use Indexable_Social_Image_Trait;

	/**
	 * Tests method double, to be able to test the `reset_social_images` method.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return void
	 */
	public function reset_social_images_double( Indexable $indexable ) {
		$this->reset_social_images( $indexable );
	}

	/**
	 * Tests method double, to be able to test the `handle_social_images` method.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return void
	 */
	public function handle_social_images_double( Indexable $indexable ) {
		$this->handle_social_images( $indexable );
	}
}
