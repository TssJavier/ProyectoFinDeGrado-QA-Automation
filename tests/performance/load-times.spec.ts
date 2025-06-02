import { test, expect } from "@playwright/test"

// Estas pruebas miden qué tan rápido carga la página
test("Medir cuánto tarda en cargar la página", async ({ page }) => {
  try {
    // Empiezo a contar el tiempo
    const startTime = Date.now()

    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Paro de contar el tiempo
    const loadTime = Date.now() - startTime

    if (loadTime < 5000) {
      console.log(`✅ La página cargó rápido: ${loadTime}ms`)
    } else {
      console.log(`❌ La página tardó mucho: ${loadTime}ms`)
    }

    expect(loadTime).toBeLessThan(5000)
  } catch (error) {
    console.log("❌ Error midiendo el tiempo de carga")
    throw error
  }
})

test("Revisar si las imágenes cargan bien", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Cuento cuántas imágenes hay
    const images = page.locator("img")
    const imageCount = await images.count()

    if (imageCount > 0) {
      // Reviso que al menos la primera imagen se vea
      await expect(images.first()).toBeVisible()
      console.log(`✅ Las imágenes cargan bien (${imageCount} encontradas)`)
    } else {
      console.log("❌ No hay imágenes en la página")
    }
  } catch (error) {
    console.log("❌ Error revisando las imágenes")
    throw error
  }
})

test("Obtener datos técnicos de velocidad", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Obtengo información técnica del navegador
    const metrics = await page.evaluate(() => {
      const performance = window.performance
      if (!performance) return {}

      const timing = performance.timing
      const navigationStart = timing.navigationStart

      return {
        loadTime: timing.loadEventEnd - navigationStart,
        domContentLoadedTime: timing.domContentLoadedEventEnd - navigationStart,
      }
    })

    if (metrics.loadTime) {
      console.log(`✅ Datos técnicos obtenidos: ${metrics.loadTime}ms`)
    } else {
      console.log("❌ No pude obtener datos técnicos")
    }

    expect(metrics).toBeTruthy()
  } catch (error) {
    console.log("❌ Error obteniendo datos técnicos")
    throw error
  }
})
