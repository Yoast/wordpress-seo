import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";
import { useCallback } from "@wordpress/element";

/**
 * The FieldArray component.
 *
 * @param {array} data The array data.
 * @param {Node} addButtonChildren Children for the add item button.
 *
 * @returns {Component} The FieldArray component.
 */
const SocialFieldArray = ( { items, onAddProfile, onRemoveProfile, onChangeProfile, errorFields, addButtonChildren, fieldType: Component } ) => {
	const handleRemove = useCallback( ( event ) => {
		onRemoveProfile( parseInt( event.currentTarget.dataset.index, 10 ) );
	}, [ onRemoveProfile ] );

	return (
		<div>
			{ items.map( ( item, index ) => (
				<div key={ `url-${ index }` }>
					<div className="yst-flex yst-flex-row yst-items-end yst-mt-4">
						<Component
							className="yst-w-full"
							label={ __( "Other social profile", "wordpress-seo" ) }
							id={ `social-input-other-url-${index}` }
							value={ item }
							socialMedium="other"
							index={ index }
							onChange={ onChangeProfile }
							error={ {
								isVisible: errorFields.includes( index ),
								message: [ __( "Could not save this value. Please check the URL.", "wordpress-seo" ) ],
							} }
						/>
						<button
							className="yst-ml-2 yst-p-3 yst-text-gray-500 yst-rounded-md hover:yst-text-primary-500 focus:yst-text-primary-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500 yst-no-underline;"
							id={ `remove-profile-${ index }` }
							data-index={ index }
							onClick={ handleRemove }
						>
							<span className="yst-sr-only">{ __( "Delete item", "admin-ui" ) }</span>
							<TrashIcon className="yst-relative yst--top-0.5 yst-w-5 yst-h-5" />
						</button>
					</div>
				</div>
			) ) }
			<button
				type="button"
				id="add-profile"
				className="yst-button yst-button--secondary yst-items-center yst-mt-8"
				onClick={ onAddProfile }
			>
				<PlusIcon className="yst-w-5 yst-h-5 yst-mr-1 yst-text-gray-400" />
				{ addButtonChildren }
			</button>
		</div>
	);
};

SocialFieldArray.propTypes = {
	fieldType: PropTypes.elementType.isRequired,
	items: PropTypes.array.isRequired,
	onAddProfile: PropTypes.func.isRequired,
	onRemoveProfile: PropTypes.func.isRequired,
	onChangeProfile: PropTypes.func.isRequired,
	errorFields: PropTypes.array,
	addButtonChildren: PropTypes.node,
};

SocialFieldArray.defaultProps = {
	errorFields: [],
	addButtonChildren: __( "Add another URL", "wordpress-seo" ),
};

export default SocialFieldArray;

