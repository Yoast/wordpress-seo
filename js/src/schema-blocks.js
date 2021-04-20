import initialize from "@yoast/schema-blocks";
import { LogLevel } from "@yoast/schema-blocks";
import { setTextdomainL10n } from "./helpers/i18n";

setTextdomainL10n( "yoast-schema-blocks" );

initialize( LogLevel.ERROR );
