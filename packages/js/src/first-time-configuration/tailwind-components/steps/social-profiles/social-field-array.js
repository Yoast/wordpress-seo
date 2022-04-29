import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

/**
 * The FieldArray component.
 *
 * @param {Object}     props                 The props object
 * @param {array}      props.items           The array containing the organization's social profiles.
 * @param {function}   props.onAddProfile    Function to call when a new field is added to the field array.
 * @param {function}   props.onRemoveProfile Function to call when a field is removed from the field array.
 * @param {function}   props.onChangeProfile Function to call when a the content of a field is edited.
 * @param {array}      props.errorFields     The array containing the names of the fields with an invalid value.
 * @param {WPElement}  fieldType             The component to render each item with.
 * @param {Node}       addButtonChildren     Children for the add item button.
 *
 * @returns {WPElement} The FieldArray component.
 */
const SocialFieldArray = ( { items, onAddProfile, onRemoveProfile, onChangeProfile, errorFields, fieldType: Component, addButtonChildren } ) => {
	const handleRemove = useCallback( ( event ) => {
		onRemoveProfile( parseInt( event.currentTarget.dataset.index, 10 ) );
	}, [ onRemoveProfile ] );

	return (
		<div>
			{ items.map( ( item, index ) => (
				<div key={ `url-${ index }` }>
					<div className="yst-flex yst-flex-row yst-items-start yst-mt-4">
						<Component
							className="yst-w-full"
							label={ __( "Other social profile", "wordpress-seo" ) }
							id={ `social-input-other-url-${index}` }
							value={ item }
							socialMedium="other"
							index={ index }
							onChange={ onChangeProfile }
							placeholder={ __( "E.g. https://social-platform.com/yoast", "wordpress-seo" ) }
							feedback={ {
								type: "error",
								isVisible: errorFields.includes( "other_social_urls-" + index ),
								message: [ __( "Could not save this value. Please check the URL.", "wordpress-seo" ) ],
							} }
						/>
						<button
							type="button"
							className="yst-mt-[27.5px] yst-ml-2 yst-p-3 yst-text-gray-500 yst-rounded-md hover:yst-text-primary-500 focus:yst-text-primary-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500 yst-no-underline;"
							id={ `remove-profile-${ index }` }
							data-index={ index }
							onClick={ handleRemove }
						>
							<span className="yst-sr-only">{ __( "Delete item", "wordpress-seo" ) }</span>
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

