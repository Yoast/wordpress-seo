import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

import { REDUX_STORE_KEY } from "../constants";
import { useFieldArray } from "../hooks";
import TextInput from "./text-input";

/**
 * The Field component.
 *
 * @param {String} parentPath The path in Redux store for the array.
 * @param {number} index The index of array item that this Field will be rendered for.
 * @param {String} component The component to render.
 *
 * @returns {Component} The Field component.
 */
const Field = ( { parentPath, index, as: Component } ) => {
	const dataPath = `${ parentPath }.${ index }`;
	// Use select here to force re-render on change
	const item = useSelect( ( select ) => select( REDUX_STORE_KEY ).getData( dataPath ) );
	return <Component item={ item } index={ index } dataPath={ dataPath } />;
};

Field.propTypes = {
	parentPath: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	as: PropTypes.elementType.isRequired,
};

/**
 * The FieldArray component.
 *
 * @param {String} className The classname for the wrapper div.
 * @param {String} dataPath The path in Redux store for the array.
 * @param {Component} fieldAs The component to render each item with.
 * @param {Node} addButtonChildren Children for the add item button.
 *
 * @returns {Component} The FieldArray component.
 */
const FieldArray = ( { className, dataPath, fieldAs: FieldComponent, addButtonChildren } ) => {
	const { items, ...helpers } = useFieldArray( dataPath );

	/**
	 * @returns {void}
	 */
	const handleAddClick = useCallback( () => helpers.add( "" ), [ items ] );

	/**
	 * @param {Number} index Index to remove profile at
	 * @returns {Function} Remove profile click handler
	 */
	const createHandleRemoveClick = useCallback( ( index ) => () => helpers.remove( index ), [ items ] );

	return (
		<div className={ className }>
			{ items.map( ( item, index ) => (
				<div key={ `profile-${ index }` } className="yst-flex yst-items-end yst-mb-8">
					<div className="yst-flex-grow">
						<Field parentPath={ dataPath } index={ index } as={ FieldComponent } />
					</div>
					<button
						onClick={ createHandleRemoveClick( index ) }
						className="yst-ml-2 yst-p-3 yst-text-gray-500 yst-rounded-md hover:yst-text-gray-600 focus:yst-text-gray-600 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-indigo-500"
					>
						<span className="yst-sr-only">{ __( "Delete item", "admin-ui" ) }</span>
						<TrashIcon className="yst-relative yst--top-0.5 yst-w-5 yst-h-5" />
					</button>
				</div>
			) ) }
			<button
				type="button"
				className="yst-button yst-button--secondary yst-items-center yst-mt-2"
				onClick={ handleAddClick }
			>
				<PlusIcon className="yst-w-5 yst-h-5 yst-mr-1 yst-text-gray-400" />
				{ addButtonChildren }
			</button>
		</div>
	);
};

FieldArray.propTypes = {
	className: PropTypes.string,
	dataPath: PropTypes.string.isRequired,
	fieldAs: PropTypes.elementType,
	addButtonChildren: PropTypes.node,
};

FieldArray.defaultProps = {
	className: "",
	fieldAs: TextInput,
	addButtonChildren: __( "Add another profile", "admin-ui" ),
};

export default FieldArray;
