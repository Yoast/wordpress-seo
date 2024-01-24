<?php

namespace Yoast\WP\SEO\Tests\Unit\Promotions\Application;

use Yoast\WP\SEO\Promotions\Domain\Abstract_Promotion;
use Yoast\WP\SEO\Promotions\Domain\Promotion_Interface;
use Yoast\WP\SEO\Promotions\Domain\Time_Interval;

/**
 * Class representing a fake promotion.
 */
final class Fake_Promotion extends Abstract_Promotion implements Promotion_Interface {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		parent::__construct(
			'fake_promotion',
			new Time_Interval( ( \time() - 10000 ), ( \time() + 10000 ) )
		);
	}
}
