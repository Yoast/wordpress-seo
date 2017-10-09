/**
 * Trigger a DOM event.
 *
 * @param {Element} target DOM element to dispatch the event on.
 * @param {string} name Event name.
 */
export default function triggerDOMEvent( target, name ) {
	var event;

	if ( 'function' === typeof window.Event ) {
		event = new Event( name );
	} else {
		event = document.createEvent( 'Event' );
		event.initEvent( name, true, true );
	}

	target.dispatchEvent( event );
}
