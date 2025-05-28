// import useSelectRedirects from "./use-select-redirects";

const redirects = [
	{ id: 1, type: "301", oldUrl: "/modi-sint-labore-dolorum/", newUrl: "/facere-eos-rem-consequatur-molestiae/" },
	{ id: 2, type: "301", oldUrl: "/est-in-eius-magnam-eum-omnis/", newUrl: "/excepturi-et-voluptatem-fuga-qui-ut/" },
	{ id: 3, type: "410", oldUrl: "/et-magnam-et-molestiae-beatae-maiores/", newUrl: "" },
	{ id: 4, type: "410", oldUrl: "/et-possimus-illo-non-reprehenderit/", newUrl: "" },
];

const useGetRedirects = () => redirects;

export default useGetRedirects;
