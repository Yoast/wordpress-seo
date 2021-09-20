import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Switch } from "@yoast/admin-ui-toolkit/components";
import classNames from "classnames";
import propTypes from "prop-types";
import { OPTIMIZE_STORE_KEY } from "../constants";
import { Placeholder } from "./placeholders";

/**
 * The cornerstone toggle within a collapsible.
 *
 * @param {string} contentType The content type.
 * @param {boolean} isLoading Whether the details are being loaded.
 *
 * @returns {?JSX.Element} The cornerstone element or null.
 */
const Cornerstone = ( { contentType, isLoading } ) => {
	const hasCornerstone = useSelect( select => select( OPTIMIZE_STORE_KEY )
		.getOption( `contentTypes.${ contentType }.hasCornerstone` ), [] );
	if ( ! hasCornerstone ) {
		return null;
	}

	const isCornerstone = useSelect( select => select( OPTIMIZE_STORE_KEY ).getData( "isCornerstone" ), [] );
	const cornerstoneContentInfoLink = useSelect( select => select( OPTIMIZE_STORE_KEY ).getOption( "cornerstoneContentInfoLink" ), [] );

	const { setData } = useDispatch( OPTIMIZE_STORE_KEY );

	const toggleCornerstone = useCallback( () => setData( "isCornerstone", ( ! isCornerstone ) ), [ isCornerstone, setData ] );

	return (
		<Disclosure as="section">
			{ ( { open } ) => (
				<>
					<Disclosure.Button
						className="yst-flex yst-w-full yst-items-center yst-justify-between yst-text-tiny yst-font-medium yst-text-gray-700 yst-rounded-md yst-px-8 yst-py-4 hover:yst-text-gray-800 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-inset focus:yst-ring-2 focus:yst-ring-indigo-500"
					>
						{
							isLoading
								? <Placeholder />
								: <>
									{ contentType === "products"
										? __( "Cornerstone product content", "admin-ui" )
										: __( "Cornerstone content", "admin-ui" )
									}
									<ChevronDownIcon
										className={ classNames(
											open ? "yst-text-gray-400 yst-transform yst-rotate-180" : "yst-text-gray-300",
											"yst-ml-auto yst-w-5 yst-h-5 yst-text-gray-400 group-hover:yst-text-gray-500",
										) }
										aria-hidden="true"
									/>
								</>
						}
					</Disclosure.Button>
					<Disclosure.Panel className="yst-px-8 yst-pt-6 yst-pb-10 yst-border-t yst-border-gray-200 yst-space-y-6">
						<p>
							{ __( "Cornerstone content should be the most important and extensive articles on your site.", "admin-ui" ) }
							&nbsp;
							<a
								href={ cornerstoneContentInfoLink }
								target="_blank"
								rel="noopener noreferrer"
							>
								{ __( "Learn more about Cornerstone content.", "admin-ui" ) }
							</a>
						</p>
						<Switch
							className=""
							label={ __( "Mark as cornerstone content", "admin-ui" ) }
							isChecked={ isCornerstone }
							onChange={ toggleCornerstone }
						/>
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

Cornerstone.propTypes = {
	contentType: propTypes.string.isRequired,
	isLoading: propTypes.bool,
};

Cornerstone.defaultProps = {
	isLoading: false,
};

export default Cornerstone;
