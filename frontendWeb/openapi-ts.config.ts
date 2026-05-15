import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./public/docs-json.json", // sign up at app.heyapi.dev
  output: "./src/client",
});
