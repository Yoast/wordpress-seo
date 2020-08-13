<?php
namespace Yoast\WP\SEO\Tests\Unit\Doubles;

use Yoast\WP\SEO\Builders\Indexable_Social_Image_Trait;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Social_Image_Trait_Double
 */
class Indexable_Social_Image_Trait_Double {
	use Indexable_Social_Image_Trait;

	/**
	 * Test method double, to be able to test the reset_social_images`
	 * @param Indexable $indexable The indexable
	 */
	public function reset_social_images_double( Indexable $indexable ) {
		$this->reset_social_images( $indexable );
	}
}
