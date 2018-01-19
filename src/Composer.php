<?php

namespace Yoast\YoastSEO;

use Composer\Script\Event;
use Composer\Installer\PackageEvent;

class Composer {
	/**
	 * Prefixes dependencies if composer install is ran with dev mode.
	 *
	 * @param Event $event Composer event that triggered this script.
	 *
	 * @return void
	 */
	public static function prefixDependencies( Event $event ) {
		$io = $event->getIO();

		if ( ! $event->isDevMode() ) {
			$io->write( 'Not prefixing dependencies.' );
			return;
		}

		$io->write( 'Prefixing dependencies...' );

		$event_dispatcher = $event->getComposer()->getEventDispatcher();
		$event_dispatcher->dispatchScript( 'prefix-dependencies', $event->isDevMode() );
	}
}
