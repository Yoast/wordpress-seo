import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import { useDispatch, useSelect } from "@wordpress/data";
import { Fragment, useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ContentAnalysis } from "@yoast/analysis-report";
import { TextInput } from "@yoast/admin-ui-toolkit/components";
import classNames from "classnames";
import PropTypes from "prop-types";
import { OPTIMIZE_STORE_KEY } from "../constants";
import { useMarker } from "../hooks";
import { Placeholder } from "./placeholders";
import ScoreIcon from "./score-icon";
import { InfoLink } from "./info-link";

/**
 * Add or edit a related keyphrase.
 *
 * @param {Object} props The props.
 * @param {string} props.keyphraseKey The key of the keyphrase.
 * @param {string} [props.keyphrase] The keyphrase.
 * @param {string} [props.synonyms] The synonyms for the keyphrase.
 * @param {Object} [props.results] The analysis results.
 * @param {number} [props.score] The analysis score.
 * @param {boolean} [props.isAddKeyphrase] Whether this is the UI for adding a related keyphrase or not.
 * @param {boolean} props.isLoading Wether or not the editor should be in a loading state.
 *
 * @returns {JSX.Element} The related keyphrase.
 */
function RelatedKeyphrase( { keyphraseKey, keyphrase, synonyms, results, score, isAddKeyphrase, isLoading } ) {
	const { markerId, handleMarkClick } = useMarker();
	const { setData, addRelatedKeyphrase, removeRelatedKeyphrase } = useDispatch( OPTIMIZE_STORE_KEY );

	const handleKeyphraseChange = useCallback( event => {
		const newKeyphrase = event.target.value;

		if ( newKeyphrase === "" ) {
			removeRelatedKeyphrase( keyphraseKey );
			return;
		}
		if ( isAddKeyphrase ) {
			addRelatedKeyphrase( keyphraseKey, newKeyphrase );
			return;
		}
		// Change the keyphrase.
		setData( `keyphrases.related.${ keyphraseKey }`, newKeyphrase );
	}, [ keyphraseKey, isAddKeyphrase ] );
	const handleSynonymsChange = useCallback( event => setData( `keyphrases.synonyms.${ keyphraseKey }`, event.target.value ), [] );

	return (
		<Disclosure as="section">
			{ ( { open } ) => (
				<>
					<Disclosure.Button
						className="yst-flex yst-w-full yst-items-center yst-justify-between yst-text-tiny yst-font-medium yst-text-gray-700 yst-rounded-md yst-px-8 yst-py-4 hover:yst-text-gray-800 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-inset focus:yst-ring-2 focus:yst-ring-indigo-500"
					>
						{ isLoading
							? <Placeholder />
							: <>
								{ isAddKeyphrase && <Fragment>
									<PlusIcon className="yst-text-gray-400 yst-w-5 yst-h-5 yst-mr-0.5" />
									{ __( "Add related keyphrase", "admin-ui" ) }
								</Fragment> }
								{ ! isAddKeyphrase && <Fragment>
									<ScoreIcon score={ score } />
									<div className="yst-text-left">
										<p>{ __( "Related keyphrase", "admin-ui" ) }</p>
										<p className="yst-font-normal">{ keyphrase }</p>
									</div>
								</Fragment> }
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
						<div>
							<TextInput
								id={ isAddKeyphrase ? "yoast-keyphrase-input-add" : `yoast-keyphrase-input-${ keyphraseKey }` }
								label={ __( "Keyphrase", "admin-ui" ) }
								value={ keyphrase }
								onChange={ handleKeyphraseChange }
							/>
							{ isAddKeyphrase && <InfoLink linkText={ __( "Read more about choosing the right focus keyphrase", "admin-ui" ) } optionPath="focusKeyphraseInfoLink" /> }
						</div>
						{ ! isAddKeyphrase && <Fragment>
							<TextInput
								id={ `yoast-synonyms-input-${ keyphraseKey }` }
								label={ __( "Synonyms", "admin-ui" ) }
								value={ synonyms }
								onChange={ handleSynonymsChange }
							/>
							<ContentAnalysis
								{ ...results }
								headingLevel={ 2 }
								keywordKey={ keyphraseKey }
								marksButtonClassName="yoast-mark-button"
								activeMarker={ markerId }
								onMarkButtonClick={ handleMarkClick }
							/>
						</Fragment> }
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
}

RelatedKeyphrase.propTypes = {
	keyphraseKey: PropTypes.string.isRequired,
	keyphrase: PropTypes.string,
	synonyms: PropTypes.string,
	results: PropTypes.object,
	score: PropTypes.number,
	isAddKeyphrase: PropTypes.bool,
	isLoading: PropTypes.bool,
};

RelatedKeyphrase.defaultProps = {
	keyphrase: "",
	synonyms: "",
	results: {},
	score: 0,
	isAddKeyphrase: false,
	isLoading: false,
};

/**
 * The related keyphrases, ending with a field to add more if the total number is less than 4.
 *
 * @param {Object} props The props.
 * @param {string} props.contentType The content type.
 * @param {boolean} props.isLoading Whether or not the editor should be in a loading state.
 *
 * @returns {?JSX.Element} The related keyphrases or null.
 */
export default function RelatedKeyphrases( { contentType, isLoading } ) {
	const hasRelatedKeyphrases = useSelect( select => select( OPTIMIZE_STORE_KEY )
		.getOption( `contentTypes.${ contentType }.hasRelatedKeyphrases` ), [] );
	if ( ! hasRelatedKeyphrases ) {
		return null;
	}

	const relatedKeyphrases = useSelect( select => select( OPTIMIZE_STORE_KEY ).getAllRelatedKeyphrasesData(), [] );
	const firstAvailableKey = useSelect( select => select( OPTIMIZE_STORE_KEY ).getFirstAvailableRelatedKeyphraseKey(), [ relatedKeyphrases ] );

	const canAddKeyphrase = useMemo( () => firstAvailableKey !== "", [ firstAvailableKey ] );
	const renderKeyphrases = useMemo( () => {
		const keyphrases = [ ...relatedKeyphrases ];

		/*
		 We add the add keyphrase UI to the same iteration so the input field can be re-used.
		 This means that the focus will never jump and the user stays in the same input field they started typing in.
		 */
		if ( canAddKeyphrase ) {
			keyphrases.push( {
				key: firstAvailableKey,
				isAddKeyphrase: true,
			} );
		}

		return keyphrases;
	}, [ relatedKeyphrases, firstAvailableKey ] );

	return (
		<Fragment>
			{ renderKeyphrases.map( keyphrase => (
				<RelatedKeyphrase
					isLoading={ isLoading }
					key={ keyphrase.key }
					keyphraseKey={ keyphrase.key }
					{ ...keyphrase }
				/>
			) ) }
		</Fragment>
	);
}

RelatedKeyphrases.propTypes = {
	contentType: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
};

RelatedKeyphrases.defaultProps = {
	isLoading: false,
};
