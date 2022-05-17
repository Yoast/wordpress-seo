<?php

namespace Yoast\WP\SEO\Actions\Options;

use Yoast\WP\SEO\Helpers\Options_Helper;

class Options_Save_Action {

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Options_Save_Action constructor.
	 *
	 * @param Options_Helper $options_helper The options' helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	public function save( $options ) {

		$failures = $this->options_helper->set_array( $options );

		if ( \count( $failures ) === 0 ) {
			return (object) [
				'success' => true,
				'status'  => 200,
			];
		}

		return (object) [
			'success'  => false,
			'status'   => 400,
			'error'    => 'Could not save some options in the database',
			'failures' => $failures,
		];

	}

}
