<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Presenter class for the indexation warning.
 *
 * @deprecated 15.1
 * @codeCoverageIgnore
 */
class Indexation_Warning_Presenter extends Abstract_Presenter {

	/**
	 * Represents the link to action type.
	 */
	const ACTION_TYPE_LINK_TO = 'link_to';

	/**
	 * Represents the run here action type.
	 */
	const ACTION_TYPE_RUN_HERE = 'run_here';

	/**
	 * The number of objects that needs to be indexed.
	 *
	 * @var int
	 */
	protected $total_unindexed;

	/**
	 * Determines if the action is a link or a button.
	 *
	 * The link links to the Yoast Tools page.
	 * The button will run the action on the current page.
	 *
	 * @var string
	 */
	protected $action_type;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Indexation_Warning_Presenter constructor.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param int            $total_unindexed The number of objects that needs to be indexed.
	 * @param Options_Helper $options_helper  The options helper.
	 * @param string         $action_type     The action type.
	 */
	public function __construct( $total_unindexed, Options_Helper $options_helper, $action_type ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );
	}

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return '';
	}
}
