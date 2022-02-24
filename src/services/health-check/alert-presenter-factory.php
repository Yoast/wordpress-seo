<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

/**
 * Factory for Alert_Presenter.
 */
class Alert_Presenter_Factory {

	/**
	 * Returns a new Alert_Presenter instance.
	 *
	 * @param string $content Content of the Alert.
	 * @param string $type    Type of the Alert (error/info/success/warning), default is warning.
	 * @return Alert_Presenter The new Alert_Presenter instance.
	 */
	public function create( $content, $type = 'warning' ) {
		return new Alert_Presenter( $content, $type );
	}
}
