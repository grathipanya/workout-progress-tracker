import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { dirname } from "../vite.config.ts";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../../src/components/**/*.mdx",
    "../../src/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: ["../public"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-docs", "@storybook/addon-vitest"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@components": path.resolve(dirname, "../src/components"),
      };
    }
    return config;
  },
};
export default config;
