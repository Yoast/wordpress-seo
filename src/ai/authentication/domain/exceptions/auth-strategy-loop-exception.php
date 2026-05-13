<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\Authentication\Domain\Exceptions;

use LogicException;

/**
 * Thrown by AI_Request_Sender when a strategy's on_failure() returns true past the hard retry cap.
 *
 * This is a programmer-error sentinel, not a runtime failure — hitting it means a strategy
 * implementation is buggy (it keeps signalling "retry" without making progress). LogicException is the
 * right SPL base for that. The sender deliberately does NOT fall back when this trips: a runaway
 * strategy should fail loudly so the bug is visible, not be silently masked by the legacy path.
 */
final class Auth_Strategy_Loop_Exception extends LogicException {

}
