<?php

namespace Yoast\WP\SEO\Tests\Unit\Promotions\Application;

use Yoast\WP\SEO\Promotions\Domain\Abstract_Promotion;
use Yoast\WP\SEO\Promotions\Domain\Promotion_Interface;
use Yoast\WP\SEO\Promotions\Domain\Time_Interval;

/**
 * Class representing a fake promotion which has been expired.
 */
final class Fake_Expired_Promotion extends Abstract_Promotion implements Promotion_Interface {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		parent::__construct(
			'fake_expired_promotion',
			new Time_Interval( \gmmktime( 00, 00, 00, 01, 01, 1980 ), \gmmktime( 00, 00, 00, 12, 31, 1980 ) )
		);
	}
}
