import { debounce, forEach, uniqueId } from "lodash";

/**
 * Initializes the Yoast form watcher.
 *
 * This does not auto-start, because we need to control it when opening/closing a document.
 *
 * @param {HTMLElement} form The Yoast form to watch for changes.
 * @param {number} [debounceDelay=500] The delay in milliseconds to debounce checking for potential changes.
 *
 * @returns {Object} The functions to interact with the form watcher or fields.
 */
export const initializeFormWatcher = ( form, debounceDelay = 500 ) => {
	const callbacks = {};
	const yoastInputs = Array.from( form.querySelectorAll( "input[name^='yoast']" ) );

	const previousValues = yoastInputs.reduce( ( result, { name, value } ) => {
		result[ name ] = value;
		return result;
	}, {} );
	const snapshotValues = { ...previousValues };

	/**
	 * Handles the changes detected by the MutationObserver.
	 *
	 * @param {MutationRecord[]} mutations The mutations detected by the MutationObserver.
	 *
	 * @returns {void}
	 */
	const handleChanges = ( mutations ) => {
		const changes = [];

		mutations.forEach( ( mutation ) => {
			// Skip changes that are not relevant to Yoast field values.
			if ( ! ( mutation.attributeName === "value" && mutation.target.name.startsWith( "yoast" ) ) ) {
				return;
			}

			// Ignore changes that have the same value as the previous. The MutationObserver will trigger on any `.value =` assignment.
			if ( mutation.target.value === previousValues[ mutation.target.name ] ) {
				return;
			}

			changes.push( {
				input: mutation.target,
				name: mutation.target.name,
				value: mutation.target.value,
				previousValue: previousValues[ mutation.target.name ],
				snapshotValue: snapshotValues[ mutation.target.name ],
			} );
			previousValues[ mutation.target.name ] = mutation.target.value;
		} );

		if ( changes.length > 0 ) {
			// Notify all subscribers.
			forEach( callbacks, ( onChange ) => onChange( changes ) );
		}
	};

	const observer = new MutationObserver( debounce( handleChanges, debounceDelay ) );

	/**
	 * Adds a callback.
	 *
	 * @param {function} onChange The callback to call when a change is detected.
	 *
	 * @returns {function} The unsubscribe function.
	 */
	const subscribe = ( onChange ) => {
		const id = uniqueId( "yoast-form-listener" );
		callbacks[ id ] = onChange;

		return () => delete callbacks[ id ];
	};

	/**
	 * Takes a snapshot of the current values.
	 * @returns {void}
	 */
	const takeSnapshot = () => {
		yoastInputs.forEach( ( { name, value } ) => {
			snapshotValues[ name ] = value;
		} );
	};

	/**
	 * Restores the snapshot values.
	 * @returns {void}
	 */
	const restoreSnapshot = () => {
		yoastInputs.forEach( input => {
			input.value = snapshotValues[ input.name ];
			// Prevent triggering the listeners for the restored value.
			previousValues[ input.name ] = snapshotValues[ input.name ];
		} );
	};

	return {
		start: () => observer.observe( form, { attributes: true, subtree: true } ),
		stop: () => observer.disconnect(),
		subscribe,
		takeSnapshot,
		restoreSnapshot,
	};
};
