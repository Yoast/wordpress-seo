import { useMemo } from "@wordpress/element";
import PropTypes from "prop-types";
import { Code } from "@yoast/ui-library";

/**
 * @param {string} fieldId The item field ID.
 * @param {string} fieldLabel The item label.
 * @param {RegExp} keyFilterPattern The regexp pattern to match fieldId against.
 * @returns {JSX.Element} The SearchResultLabel element.
 */
export const SearchResultLabel = ( { fieldId, fieldLabel, keyFilterPattern } ) => {
	const { isMatch, matchedGroupName } = useMemo( () => {
		const matches = keyFilterPattern.exec( fieldId );
		return {
			isMatch: Boolean( matches ),
			matchedGroupName: matches?.groups?.name,
		};
	}, [ fieldId, keyFilterPattern ] );

	if ( isMatch ) {
		return (
			<>
				{ fieldLabel }
				{ matchedGroupName && (
					<Code className="yst-ml-2 rtl:yst-mr-2 group-hover:yst-bg-primary-200 group-hover:yst-text-primary-800">{ matchedGroupName }</Code>
				) }
			</>
		);
	}

	return fieldLabel;
};

SearchResultLabel.propTypes = {
	fieldId: PropTypes.string.isRequired,
	fieldLabel: PropTypes.string.isRequired,
	keyFilterPattern: PropTypes.instanceOf( RegExp ).isRequired,
};
