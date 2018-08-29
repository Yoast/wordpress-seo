import "raf/polyfill";
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import { setLocaleData } from "@wordpress/i18n";

Enzyme.configure( { adapter: new EnzymeAdapter() } );

/* eslint-disable */
setLocaleData( {
	"": {
		domain: "wordpress-seo",
		lang: "en",
		plural_forms: "nplurals=2; plural=(n != 1);",
	},
}, "wordpress-seo" );
