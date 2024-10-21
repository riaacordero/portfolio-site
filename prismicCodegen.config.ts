import type { Config } from "prismic-ts-codegen";
import "dotenv/config";

const repositoryName = process.env.PRISMIC_REPO_NAME;
const customTypesApiKey = process.env.PRISMIC_CUSTOM_TYPES_API_KEY;

const config: Config = {
  output: "./src/prismic.d.ts",
  repositoryName,
  customTypesAPIToken: customTypesApiKey,
  clientIntegration: {
    includeContentNamespace: true,
    includeCreateClientInterface: true,
  },
  models: {
    fetchFromRepository: true,
  },
};

export default config;
