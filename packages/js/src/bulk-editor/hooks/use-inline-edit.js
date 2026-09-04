import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { BULK_UPDATE_BATCH_SIZE, FIELD_SET_SEARCH, FOCUS_KEYPHRASE_KEY, STORE_NAME } from "../constants";
import { createFieldScorer, createSingleFieldScorer } from "../services/field-scores";

/**
 * The endpoint key a field saves through: a field-level override when set, otherwise the field set's default.
 *
 * @param {import("../field-sets").FieldSetField} field    The field being saved.
 * @param {import("../field-sets").FieldSet}      fieldSet The active field set.
 *
 * @returns {string} The data-provider endpoint key.
 */
const fieldEndpointKey = ( field, fieldSet ) => field.endpoint ?? fieldSet.endpoint;

/**
 * Resolves the value to persist locally for a field after a save.
 *
 * For the focus keyphrase, prefers the sanitized literal the server echoed back, so a keyphrase
 * that was silently altered by sanitization (e.g. HTML stripped) is reflected correctly rather
 * than showing the unsanitized draft. Other fields fall back to the submitted draft value.
 *
 * @param {string}           key        The field key (JS camelCase).
 * @param {string}           draftValue The draft value that was submitted.
 * @param {Object|undefined} sanitized  The sanitized literals from the update result, or undefined.
 *
 * @returns {string} The value to reflect locally.
 */
const resolveItemValue = ( key, draftValue, sanitized ) => {
	if ( key === FOCUS_KEYPHRASE_KEY && sanitized && "focus_keyphrase" in sanitized ) {
		return sanitized.focus_keyphrase;
	}
	return draftValue;
};

/**
 * Extracts the sanitized literals from the first result of an update response.
 *
 * @param {Object} response The update response.
 * @returns {Object|undefined} The sanitized fields, or undefined when not present.
 */
const getFirstSanitized = ( response ) => response?.results?.[ 0 ]?.sanitized;

/**
 * Returns the draft value to persist, stripping it back to empty when it still equals the item's
 * fallback template. This prevents clicking Save on an unedited row from baking the fallback template
 * in as an explicit stored value, which would disconnect the post from Search Appearance.
 *
 * @param {string}           value    The current draft value.
 * @param {Object|undefined} item     The source item (may be undefined if the row was not found).
 * @param {string}           fieldKey The JS camelCase field key (e.g. "seoTitle").
 *
 * @returns {string} The value to send to the server.
 */
const normalizeDraftValue = ( value, item, fieldKey ) =>
	value === ( item?.[ `${ fieldKey }Fallback` ] ?? "" ) ? "" : value;

/**
 * Re-scores a saved row from an update result, when it carries rendered search fields.
 *
 * A rendered payload is only present for search-appearance updates, so this is a no-op for the social tab.
 *
 * @param {Function} scoreFields The re-scorer.
 * @param {Object}   result      A single per-post update result.
 * @param {string}   keyphrase   The focus keyphrase to score against.
 *
 * @returns {void}
 */
const rescoreFromResult = ( scoreFields, result, keyphrase ) => {
	const rendered = result?.rendered;
	if ( ! result?.success || ! rendered ) {
		return;
	}
	scoreFields( { id: result.id, title: rendered.seo_title, description: rendered.meta_description, keyphrase } );
};

/**
 * Re-scores a single saved row after a search-appearance save.
 *
 * @param {Function} scoreFields    The re-scorer.
 * @param {string}   activeFieldSet The active field set's id.
 * @param {Object}   response       The update response.
 * @param {Object}   rowEdit        The row's edit state, holding its draft field values.
 *
 * @returns {void}
 */
const rescoreAfterSave = ( scoreFields, activeFieldSet, response, rowEdit ) => {
	if ( activeFieldSet !== FIELD_SET_SEARCH ) {
		return;
	}
	const results = response?.results ?? [];
	const keyphrase = resolveItemValue( FOCUS_KEYPHRASE_KEY, rowEdit.draft[ FOCUS_KEYPHRASE_KEY ] ?? "", getFirstSanitized( response ) );
	rescoreFromResult( scoreFields, results[ 0 ], keyphrase );
};

/**
 * Re-scores a row after a per-field apply — only when the applied field was the row's sole open edit,
 * so the score update is deferred until the full row is saved rather than firing after every field.
 *
 * @param {Function} scoreFields    The re-scorer.
 * @param {string}   activeFieldSet The active field set's id.
 * @param {Object}   response       The update response.
 * @param {Object}   rowEdit        The row's edit state (snapshot at save time).
 *
 * @returns {void}
 */
const rescoreIfLastField = ( scoreFields, activeFieldSet, response, rowEdit ) => {
	if ( rowEdit.openFields.length !== 1 ) {
		return;
	}
	rescoreAfterSave( scoreFields, activeFieldSet, response, rowEdit );
};

/**
 * Re-scores every saved row in a batch response that carries rendered search fields.
 *
 * A no-op for the social tab: the scorer needs seo_title and meta_description, which are
 * only present in rendered for search updates. Social updates have no rendered payload, so the
 * activeFieldSet guard is a belt-and-suspenders defence against undefined title/description.
 *
 * @param {Function} scoreFields    The re-scorer.
 * @param {string}   activeFieldSet The active field set's id.
 * @param {Object}   response       The update response for one batch.
 * @param {Object}   editingRows    The current edit state, keyed by row id, holding each row's draft values.
 *
 * @returns {void}
 */
const rescoreBatchResult = ( scoreFields, activeFieldSet, response, editingRows ) => {
	if ( activeFieldSet !== FIELD_SET_SEARCH ) {
		return;
	}
	( response?.results ?? [] ).forEach( ( result ) => {
		const keyphrase = resolveItemValue( FOCUS_KEYPHRASE_KEY, editingRows[ result.id ]?.draft?.[ FOCUS_KEYPHRASE_KEY ] ?? "", result?.sanitized );
		rescoreFromResult( scoreFields, result, keyphrase );
	} );
};

/**
 * The bulk editor's inline editing: per-row, per-field edit state and the save.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to save edits.
 * @param {Object<string, import("../field-sets").FieldSet>} props.fieldSets The field sets, keyed by id.
 * @param {string}                             props.activeFieldSet     The active field set's id.
 * @param {import("../field-sets").BulkEditorItem[]} props.items         The rows being edited (from the posts endpoint).
 * @param {Function}                           props.updateItem         Reflects a saved field on its row locally.
 *
 * @returns {{editing: Object, stopEditing: Function}} The editing props and the reset.
 */
export const useInlineEdit = ( { dataProvider, remoteDataProvider, fieldSets, activeFieldSet, items, updateItem } ) => {
	const editingRows = useSelect( ( select ) => select( STORE_NAME ).selectEditingRows(), [] );
	const { startEdit, updateDraftField, setSavingField, closeField, discardEdit, stopEdit } = useDispatch( STORE_NAME );

	const [ isApplyingAll, setIsApplyingAll ] = useState( false );
	// Whether the last apply-all had one or more requests fail; drives the inline "couldn't save" notice.
	const [ hasSaveError, setHasSaveError ] = useState( false );
	// Guards onApplyAll against re-entry, so a batch in flight can't fire a second,
	// overlapping set of requests. A ref, so the check is synchronous within a tick.
	const isApplyingAllRef = useRef( false );

	// Recomputes and persists the per-field scores after a search-appearance save, so the needs-improvement
	// filter reflects the edit. Fire-and-forget: it never blocks or fails the save.
	const scoreFields = useMemo(
		() => createFieldScorer( { dataProvider, remoteDataProvider } ),
		[ dataProvider, remoteDataProvider ]
	);

	// Re-scores a single field after a fill (Premium AI) saves it onto a row, so the needs-improvement filter
	// reflects an AI-generated value as well as a manual edit.
	const scoreField = useMemo(
		() => createSingleFieldScorer( { dataProvider, remoteDataProvider } ),
		[ dataProvider, remoteDataProvider ]
	);

	// Reflects a value a fill saved itself onto its row, then re-scores just that field. The applied value is
	// literal, so it is scored as-is; the row's current keyphrase drives the keyphrase-dependent assessments.
	const onFieldApplied = useCallback( ( id, key, value ) => {
		updateItem( id, key, value );
		const item = items.find( ( candidate ) => candidate.id === id );
		scoreField( { id, fieldKey: key, value, keyphrase: item?.[ FOCUS_KEYPHRASE_KEY ] ?? "" } );
	}, [ updateItem, items, scoreField ] );

	const dismissSaveError = useCallback( () => setHasSaveError( false ), [] );

	// Clear the save error whenever edit mode is fully exited. Failed rows stay open, so the error persists exactly
	// while there is still something to retry, and can't resurface stale on the next edit session.
	useEffect( () => {
		if ( Object.keys( editingRows ).length === 0 ) {
			setHasSaveError( false );
		}
	}, [ editingRows ] );

	const onDiscardAll = useCallback( () => stopEdit(), [ stopEdit ] );

	const onDiscardField = useCallback( ( { id, key } ) => closeField( { id, key } ), [ closeField ] );

	const onStartEdit = useCallback( ( id ) => {
		const item = items.find( ( candidate ) => candidate.id === id );
		if ( ! item ) {
			return;
		}
		const draftValues = Object.fromEntries(
			fieldSets[ activeFieldSet ].fields
				// A read-only field never enters the draft, so it never becomes an open field: it stays plain text and,
				// because the save paths iterate the open fields, it can never be shipped in an update payload and blanked.
				.filter( ( field ) => ! field.readOnly )
				.map( ( field ) => [ field.key, item[ field.key ] || item[ `${ field.key }Fallback` ] || "" ] )
		);
		// Guards against an all-read-only field set opening a row that holds no open field, which nothing could then close.
		if ( Object.keys( draftValues ).length === 0 ) {
			return;
		}
		startEdit( { id, draft: draftValues } );
	}, [ items, fieldSets, activeFieldSet, startEdit ] );

	const onCancelEdit = useCallback( ( id ) => discardEdit( { id } ), [ discardEdit ] );

	const onApplyField = useCallback( async( { id, key } ) => {
		const fieldSet = fieldSets[ activeFieldSet ];
		const field = fieldSet.fields.find( ( candidate ) => candidate.key === key );
		const rowEdit = editingRows[ id ];
		// A read-only field must never reach a request body, even if something else put it in the open fields.
		if ( ! field || field.readOnly || ! rowEdit ) {
			return;
		}
		const endpoint = dataProvider.getEndpoint( fieldEndpointKey( field, fieldSet ) );
		if ( ! endpoint ) {
			return;
		}

		const rowItem = items.find( ( candidate ) => candidate.id === id );
		const value = normalizeDraftValue( rowEdit.draft[ key ], rowItem, key );
		setSavingField( { id, key, isSaving: true } );
		try {
			const response = await remoteDataProvider.fetchJson( endpoint, {}, {
				method: "POST",
				body: JSON.stringify( { items: [ { id, [ field.param ]: value } ] } ),
			} );
			updateItem( id, key, resolveItemValue( key, value, getFirstSanitized( response ) ) );
			closeField( { id, key } );
			rescoreIfLastField( scoreFields, activeFieldSet, response, rowEdit );
		} catch ( error ) {
			setSavingField( { id, key, isSaving: false } );
			setHasSaveError( true );
		}
	}, [ fieldSets, activeFieldSet, dataProvider, remoteDataProvider, editingRows, items, setSavingField, closeField, updateItem, scoreFields ] );

	// Saves all open fields of a single row in as few requests as possible — one POST per endpoint, all fields
	// merged into one item. Called by the per-row Save button; re-scores once all succeed.
	const onApplyRow = useCallback( async( id ) => {
		const fieldSet = fieldSets[ activeFieldSet ];
		const rowEdit = editingRows[ id ];
		if ( ! rowEdit || ! remoteDataProvider ) {
			return;
		}

		// Group the row's open fields by endpoint — one item per endpoint, all fields merged in.
		const rowItem = items.find( ( candidate ) => candidate.id === id );
		const batches = {};
		rowEdit.openFields.forEach( ( key ) => {
			const field = fieldSet.fields.find( ( candidate ) => candidate.key === key );
			if ( ! field || field.readOnly ) {
				return;
			}
			const endpointKey = fieldEndpointKey( field, fieldSet );
			const endpoint = dataProvider.getEndpoint( endpointKey );
			if ( ! endpoint ) {
				return;
			}
			if ( ! batches[ endpointKey ] ) {
				batches[ endpointKey ] = { endpoint, item: { id }, applied: [] };
			}
			const value = normalizeDraftValue( rowEdit.draft[ key ], rowItem, key );
			batches[ endpointKey ].item[ field.param ] = value;
			batches[ endpointKey ].applied.push( { key, value } );
		} );

		const groups = Object.values( batches );
		if ( groups.length === 0 ) {
			return;
		}

		rowEdit.openFields.forEach( ( key ) => setSavingField( { id, key, isSaving: true } ) );

		const requests = groups.map( ( group ) => ( {
			applied: group.applied,
			promise: remoteDataProvider.fetchJson( group.endpoint, {}, {
				method: "POST",
				body: JSON.stringify( { items: [ group.item ] } ),
			} ),
		} ) );

		const results = await Promise.allSettled( requests.map( ( request ) => request.promise ) );
		let hasFailure = false;
		results.forEach( ( result, index ) => {
			if ( result.status !== "fulfilled" ) {
				requests[ index ].applied.forEach( ( { key } ) => setSavingField( { id, key, isSaving: false } ) );
				hasFailure = true;
				return;
			}
			const sanitized = getFirstSanitized( result.value );
			requests[ index ].applied.forEach( ( { key, value } ) => {
				updateItem( id, key, resolveItemValue( key, value, sanitized ) );
				closeField( { id, key } );
			} );
			rescoreAfterSave( scoreFields, activeFieldSet, result.value, rowEdit );
		} );
		if ( hasFailure ) {
			setHasSaveError( true );
		}
	}, [ fieldSets, activeFieldSet, dataProvider, remoteDataProvider, editingRows, items, setSavingField, updateItem, closeField, scoreFields ] );

	// Saves every open edit as one batch. Returns true (clean), false (a request failed), or null (a save was
	// already in flight), so the tab-switch modal only closes on a real failure and not on a re-entrant call.
	const onApplyAll = useCallback( async() => {
		const fieldSet = fieldSets[ activeFieldSet ];
		if ( isApplyingAllRef.current ) {
			return null;
		}
		if ( ! remoteDataProvider || Object.keys( editingRows ).length === 0 ) {
			return true;
		}

		// Group every row's open drafts by endpoint: each row carries both its request payload (`item`) and the
		// `applied` entries to reflect locally once it saves.
		const batches = {};
		Object.entries( editingRows ).forEach( ( [ rowId, row ] ) => {
			const id = Number( rowId );
			row.openFields.forEach( ( key ) => {
				const field = fieldSet.fields.find( ( candidate ) => candidate.key === key );
				if ( ! field || field.readOnly ) {
					return;
				}
				const endpointKey = fieldEndpointKey( field, fieldSet );
				const endpoint = dataProvider.getEndpoint( endpointKey );
				if ( ! endpoint ) {
					return;
				}
				if ( ! batches[ endpointKey ] ) {
					batches[ endpointKey ] = { endpoint, rows: {} };
				}
				if ( ! batches[ endpointKey ].rows[ id ] ) {
					batches[ endpointKey ].rows[ id ] = { item: { id }, applied: [] };
				}
				const rowItem = items.find( ( candidate ) => candidate.id === id );
				const value = normalizeDraftValue( row.draft[ key ], rowItem, key );
				batches[ endpointKey ].rows[ id ].item[ field.param ] = value;
				batches[ endpointKey ].rows[ id ].applied.push( { id, key, value } );
			} );
		} );

		const groups = Object.values( batches );
		if ( groups.length === 0 ) {
			return true;
		}

		// One POST per endpoint, chunked to the server's batch limit. Each request keeps the `applied` entries for its own rows,
		// so a failed chunk only holds back its own rows.
		const requests = groups.flatMap( ( group ) => {
			const rows = Object.values( group.rows );
			const chunks = [];
			for ( let start = 0; start < rows.length; start += BULK_UPDATE_BATCH_SIZE ) {
				chunks.push( rows.slice( start, start + BULK_UPDATE_BATCH_SIZE ) );
			}
			return chunks.map( ( chunkRows ) => ( {
				applied: chunkRows.flatMap( ( row ) => row.applied ),
				promise: remoteDataProvider.fetchJson( group.endpoint, {}, {
					method: "POST",
					body: JSON.stringify( { items: chunkRows.map( ( row ) => row.item ) } ),
				} ),
			} ) );
		} );

		isApplyingAllRef.current = true;
		setIsApplyingAll( true );
		setHasSaveError( false );
		try {
			// A partial failure reflects the rows that did save, while the
			// failed rows stay open for a retry. On full success every field closes, so all rows leave edit mode.
			const results = await Promise.allSettled( requests.map( ( request ) => request.promise ) );
			results.forEach( ( result, index ) => {
				if ( result.status !== "fulfilled" ) {
					return;
				}
				const sanitizedByPostId = Object.fromEntries(
					( result.value?.results ?? [] ).map( ( r ) => [ r.id, r.sanitized ] )
				);
				requests[ index ].applied.forEach( ( { id, key, value } ) => {
					updateItem( id, key, resolveItemValue( key, value, sanitizedByPostId[ id ] ) );
					closeField( { id, key } );
				} );
				// Re-score the search rows in this batch; the social guard is inside rescoreBatchResult.
				rescoreBatchResult( scoreFields, activeFieldSet, result.value, editingRows );
			} );
			const hasFailure = results.some( ( result ) => result.status === "rejected" );
			if ( hasFailure ) {
				setHasSaveError( true );
			}
			return ! hasFailure;
		} finally {
			isApplyingAllRef.current = false;
			setIsApplyingAll( false );
		}
	}, [ fieldSets, activeFieldSet, dataProvider, remoteDataProvider, editingRows, items, updateItem, closeField, scoreFields ] );

	const editing = useMemo( () => ( {
		editingRows,
		isApplyingAll,
		hasSaveError,
		dismissSaveError,
		onStartEdit,
		onChangeField: updateDraftField,
		onApplyField,
		onApplyRow,
		onApplyAll,
		onDiscardAll,
		onCancelEdit,
		onDiscardField,
		onFieldApplied,
	} ), [
		editingRows, isApplyingAll, hasSaveError, dismissSaveError, onStartEdit, updateDraftField,
		onApplyField, onApplyRow, onApplyAll, onDiscardAll, onCancelEdit, onDiscardField, onFieldApplied,
	] );

	return { editing, stopEditing: stopEdit };
};
