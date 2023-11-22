import { AUTO_DRAFT_NAME } from "@woocommerce/product-editor";
import { resolveSelect, useDispatch } from "@wordpress/data";
import { useEffect, useState } from "@wordpress/element";

export const useProductEntityRecord = ( productId ) => {
	const { saveEntityRecord } = useDispatch( "core" );
	const [ product, setProduct ] = useState( undefined );

	useEffect( () => {
		const getRecordPromise = productId
			? resolveSelect( "core" ).getEntityRecord( "postType", "product", Number.parseInt( productId, 10 ) )
			: saveEntityRecord( "postType", "product", { title: AUTO_DRAFT_NAME, status: "auto-draft" } );
		getRecordPromise
			.then( ( autoDraftProduct ) => {
				setProduct( autoDraftProduct );
			} )
			.catch( ( e ) => {
				setProduct( undefined );
				throw e;
			} );
	}, [ productId ] );

	return product;
};
