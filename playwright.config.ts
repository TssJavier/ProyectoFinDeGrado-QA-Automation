import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  retries: 1,
  workers: 1,
  reporter: [
    [
      "html",
      {
        outputFolder: "test-results/reporte-final",
        open: "never",
        host: "localhost",
        port: 9323,
      },
    ],
    [
      "json",
      {
        outputFile: "test-results/resultados-detallados.json",
      },
    ],
    [
      "junit",
      {
        outputFile: "test-results/resultados-junit.xml",
      },
    ],
    ["list"],
  ],
  use: {
    baseURL: "https://www.cognifit.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  projects: [
    {
      name: "Pruebas en Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
})
