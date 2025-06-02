import { test, expect } from "@playwright/test"
import { measureLoadTime, waitForPageLoad } from "../utils/helpers"

test.describe("Pruebas de Performance", () => {
  test("Tiempo de carga página principal", async ({ page }) => {
    console.log("Viendo cuanto tarda en cargar...")

    const loadTime = await measureLoadTime(page, "https://www.cognifit.com/")
    console.log(`Tardó: ${loadTime}ms`)

    // No debería tardar más de 8 segundos
    expect(loadTime).toBeLessThan(8000)
    console.log("Carga en tiempo aceptable")
  })

  test("Carga de recursos principales", async ({ page }) => {
    console.log("Viendo si cargan las imágenes y eso...")

    await page.goto("https://www.cognifit.com/")
    await waitForPageLoad(page)

    // Ver si hay imágenes cargadas
    const images = page.locator("img:visible")
    const imageCount = await images.count()
    expect(imageCount).toBeGreaterThan(0)

    // Ver si se aplicaron los estilos
    const bodyColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color
    })
    expect(bodyColor).toBeTruthy()

    console.log(`Se cargaron ${imageCount} imágenes`)
  })

  test("Performance en diferentes páginas", async ({ page }) => {
    console.log("Probando velocidad en varias páginas...")

    const pages = [
      { name: "Principal", url: "https://www.cognifit.com/" },
      { name: "Test Cognitivos", url: "https://www.cognifit.com/test-cognitivos" },
    ]

    for (const pageInfo of pages) {
      const loadTime = await measureLoadTime(page, pageInfo.url)
      console.log(`${pageInfo.name}: ${loadTime}ms`)
      expect(loadTime).toBeLessThan(10000) // máximo 10 segundos
    }

    console.log("Todas las páginas cargan bien")
  })
})
