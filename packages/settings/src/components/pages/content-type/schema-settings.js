import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, AutomaticSchemaAlert, Section } from "@yoast/admin-ui-toolkit/components";
import { getSchemaArticleTypes, getSchemaPageTypes } from "@yoast/admin-ui-toolkit/helpers";
import { get } from "lodash";
import PropTypes from "prop-types";
import { REDUX_STORE_KEY } from "../../../constants";
import Select from "../../select";

const SCHEMA = {
	PAGE: "page",
	ARTICLE: "article",
};

export const PAGE = {
	SINGLE: "single",
	ARCHIVE: "archive",
};

/**
 * @param {Object} contentType The content type.
 * @param {string} [singleOrArchive] Single or archive.
 * @returns {Object} The default type values.
 */
const getDefaultTypeValues = ( contentType, singleOrArchive = PAGE.SINGLE ) => {
	switch ( singleOrArchive ) {
		case PAGE.ARCHIVE:
			return {
				pageType: "CollectionPage",
				articleType: "",
			};
		default:
			return get( contentType, "defaults.schema", {
				pageType: "",
				articleType: "",
			} );
	}
};

/**
 * @param {Object} schemaTypes The schema types.
 * @param {string} defaultTypeValue The default schema type value to adjust the label for.
 * @returns {Object[]} The schema type choices.
 */
const getChoicesWithDefaultAnnotation = ( schemaTypes, defaultTypeValue ) => {
	/* translators: %s is replaced by the plural content type label. */
	const typeWithDefaultAnnotation = __( "%s (default)", "admin-ui" );

	return Object.entries( schemaTypes ).map( ( [ typeValue, typeLabel ] ) => ( {
		id: typeValue,
		value: typeValue,
		label: defaultTypeValue === typeValue ? sprintf( typeWithDefaultAnnotation, typeLabel ) : typeLabel,
	} ) );
};

/**
 * @param {Object} props The props.
 * @param {Object} props.contentType The content type.
 * @param {string} props.pageOrArticle Whether it represents page or article schema.
 * @param {string} props.singleOrArchive Whether it should read from the single or the archive schema.
 * @returns {?JSX.Element} The schema type settings or null.
 */
const SchemaTypeSettings = ( { contentType, pageOrArticle = SCHEMA.PAGE, singleOrArchive = PAGE.SINGLE } ) => {
	if ( ! ( pageOrArticle === SCHEMA.PAGE ? contentType.hasSchemaPageTypes : contentType.hasSchemaArticleTypes ) ) {
		return null;
	}

	const schemaTypes = useMemo( () => pageOrArticle === SCHEMA.PAGE ? getSchemaPageTypes() : getSchemaArticleTypes(), [ pageOrArticle ] );
	const defaultTypeValue = useMemo(
		() => getDefaultTypeValues( contentType, singleOrArchive )[ `${ pageOrArticle }Type` ],
		[ contentType, pageOrArticle, singleOrArchive ],
	);
	const choices = useMemo( () => getChoicesWithDefaultAnnotation( schemaTypes, defaultTypeValue ), [ schemaTypes, defaultTypeValue ] );
	const label = useMemo(
		() => pageOrArticle === SCHEMA.PAGE ? __( "Page type", "admin-ui" ) : __( "Article type", "admin-ui" ),
		[ pageOrArticle ],
	);

	return <Select
		dataPath={ `contentTypes.${ contentType.slug }.schema.${ pageOrArticle }Type` }
		optionPathForFallbackValue={ `contentTypes.${ contentType.slug }.defaults.schema.${ pageOrArticle }Type` }
		choices={ choices }
		label={ label }
	/>;
};

SchemaTypeSettings.propTypes = {
	contentType: PropTypes.object.isRequired,
	pageOrArticle: PropTypes.oneOf( [ SCHEMA.PAGE, SCHEMA.ARTICLE ] ).isRequired,
	singleOrArchive: PropTypes.oneOf( [ PAGE.SINGLE, PAGE.ARCHIVE ] ).isRequired,
};

/**
 * @param {Object} props The props.
 * @param {string} props.contentTypeKey The content type key.
 * @param {string} props.singleOrArchive Whether it should read from the single or the archive schema.
 * @returns {?JSX.Element} The schema settings or null.
 */
const SchemaSettings = ( { contentTypeKey, singleOrArchive = PAGE.SINGLE } ) => {
	const contentType = useSelect( select => select( REDUX_STORE_KEY ).getOption( `contentTypes.${ contentTypeKey }` ), [] );

	// Return nothing if there is no schema to set.
	if ( ! ( contentType.hasSchemaPageTypes || contentType.hasSchemaArticleTypes || contentType.hasAutomaticSchemaTypes ) ) {
		return null;
	}

	const contentTypeLabel = useMemo( () => {
		return singleOrArchive === PAGE.SINGLE
			? contentType.label
			: sprintf(
				// translators: %s is replaced by the plural content type label.
				__( "%s archive", "admin-ui" ),
				contentType.label,
			);
	}, [ singleOrArchive, contentType.label ] );

	const defaultTypeValues = useMemo( () => getDefaultTypeValues( contentType, singleOrArchive ), [ contentType, singleOrArchive ] );

	return (
		<Section
			title={ __( "Schema", "admin-ui" ) }
			// translators: %s is replaced by the plural content type label.
			description={ sprintf( __( "Choose how your %s should be described by default in your site's Schema.org markup.", "admin-ui" ), contentTypeLabel ) }
		>
			{ contentType.hasAutomaticSchemaTypes && <AutomaticSchemaAlert
				contentTypeLabel={ contentTypeLabel }
				defaultSettings={ defaultTypeValues }
				contentTypeSchemaInfoLink={ contentType.contentTypeSchemaInfoLink }
			/> }
			{ ! contentType.hasAutomaticSchemaTypes && <>
				<Alert type="info" className="yst-mb-8">
					{ sprintf(
						// translators: %1$s is replaced by the plural content type label.
						__( "Upon saving, these settings will apply to all of your %1$s. %1$s that are manually configured will be left untouched.", "admin-ui" ),
						contentType.label,
					) }
				</Alert>
				<SchemaTypeSettings contentType={ contentType } pageOrArticle={ SCHEMA.PAGE } singleOrArchive={ singleOrArchive } />
				<SchemaTypeSettings contentType={ contentType } pageOrArticle={ SCHEMA.ARTICLE } singleOrArchive={ singleOrArchive } />
			</> }
		</Section>
	);
};

SchemaSettings.propTypes = {
	contentTypeKey: PropTypes.string.isRequired,
	singleOrArchive: PropTypes.oneOf( [ PAGE.SINGLE, PAGE.ARCHIVE ] ).isRequired,
};

export default SchemaSettings;
