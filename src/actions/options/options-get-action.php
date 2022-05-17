<?php

namespace Yoast\WP\SEO\Actions\Options;

use Yoast\WP\SEO\Helpers\Options_Helper;

class Options_Get_Action {

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Options_Get_Action constructor.
	 *
	 * @param Options_Helper $options_helper The options' helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	public function get( array $options ) {
		$data = $this->options_helper->get_options( $options );

		if ( $data ) {
			return (object) [
				'success' => true,
				'status'  => 200,
				'data'    => $data,
			];
		}

		return (object) [
			'success' => false,
			'status'  => 400,
			'error'   => 'Could not retrieve options',
		];
	}

}
