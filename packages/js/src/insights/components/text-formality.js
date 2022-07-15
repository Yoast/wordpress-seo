import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { InsightsCard } from "@yoast/components";

const getDescription = ( formalityLevel ) => {
	return sprintf(
		/* Translators: %1$s expands to the formality level of the text */
		__(
			"The content sounds %1$s.",
			"wordpress-seo"
		),
		formalityLevel
	);
};

const TextFormality = () => {
	const formalityLevel = useSelect( select => select( "yoast-seo/editor" ).getTextFormalityLevel() );
	const link = "";
	const description = getDescription( formalityLevel );
	return <InsightsCard
		id={ "yoastseo-text-formality-insights" }
		amount={ 0 }
		unit={ "" }
		title={ __( "Text formality", "wordpress-seo" ) }
		linkTo={ link }
		linkText={ __( "Learn more about text formality", "wordpress-seo" ) }
		description={ description }
	/>;
};

