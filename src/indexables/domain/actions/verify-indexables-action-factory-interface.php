<?php

namespace Yoast\WP\SEO\Indexables\Domain\Actions;

use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;

interface Verify_Indexable_Action_Factory_Interface {

	public function get( Current_Verification_Action $verification_action ):Verify_Indexables_Action_Interface;

	public function determine_next_verify_action( Current_Verification_Action $current_verification_action ):Current_Verification_Action;
}
