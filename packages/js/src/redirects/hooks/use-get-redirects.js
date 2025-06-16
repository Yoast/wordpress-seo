import { useEffect } from "@wordpress/element";
import useDispatchRedirects from "./use-dispatch-redirects";
import useSelectRedirects from "./use-select-redirects";


const useGetRedirects = () => {
	const { fetchRedirects  } = useDispatchRedirects();
	const redirects = useSelectRedirects( "selectAllRedirects" );

	useEffect( () => {
		fetchRedirects();
	}, [] );

	return redirects;
};

export default useGetRedirects;
