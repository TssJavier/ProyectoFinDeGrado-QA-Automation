import { test, expect } from "@playwright/test"
import { capturePerformanceMetrics, waitForPageLoad } from "../utils/helpers"

test.describe("Pruebas de rendimiento", () => {
  test("La página principal debe cargarse en menos de 5 segundos", async ({ page }) => {
    const startTime = Date.now()

    await page.goto("/")
    await waitForPageLoad(page)

    const loadTime = Date.now() - startTime
    console.log(`Tiempo de carga: ${loadTime}ms`)

    // El tiempo debe ser menor a 5000ms (ajustar según necesidades)
    expect(loadTime).toBeLessThan(5000)
  })

  test("Capturar métricas de rendimiento de páginas principales", async ({ page }) => {
    // Lista de páginas importantes para probar
    const pagesToTest = ["/", "/login", "/about", "/brain-games"]

    for (const path of pagesToTest) {
      // Navegar a la página
      await page.goto(path)
      await waitForPageLoad(page)

      // Capturar métricas
      const metrics = await capturePerformanceMetrics(page)

      console.log(`Métricas para ${path}:`, metrics)

      // Verificar métricas clave
      expect(metrics.totalPageLoad).toBeLessThan(8000) // 8 segundos máximo
      expect(metrics.domComplete).toBeLessThan(5000) // 5 segundos máximo
    }
  })

  test("Los recursos estáticos deben estar optimizados", async ({ page }) => {
    await page.goto("/")

    // Evaluar tamaño de imágenes
    const imagesSizes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img")).map((img) => {
        return {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.width,
          displayHeight: img.height,
          sizeInKB: 0, // Lo calcularemos después si es posible
        }
      })
    })

    console.log("Análisis de imágenes:", imagesSizes)

    // Verificar que no hay imágenes excesivamente grandes mostradas en tamaños pequeños
    for (const img of imagesSizes) {
      if (img.displayWidth > 0 && img.naturalWidth > 0) {
        // Solo imágenes cargadas
        const ratio = img.naturalWidth / img.displayWidth
        // Si la imagen original es más de 3 veces más grande que como se muestra
        expect(ratio).toBeLessThan(3)
      }
    }
  })
})
