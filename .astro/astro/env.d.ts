declare module 'astro:env/client' {
	
}

declare module 'astro:env/server' {
	export const PRISMIC_REPO_NAME: string;	


	export const getSecret: (key: string) => string | undefined;
}
