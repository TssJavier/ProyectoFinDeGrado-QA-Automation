import type { Page } from "@playwright/test"

// Función para esperar a que cargue todo
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded")
  await page.waitForTimeout(1000) // espero un poco más por si acaso
}

// Para aceptar las cookies que salen siempre
export async function acceptCookies(page: Page): Promise<void> {
  const cookieButton = page.locator('button:has-text("Permitir todas")')
  if ((await cookieButton.count()) > 0) {
    await cookieButton.click()
    await page.waitForTimeout(1000)
  }
}

// Medir cuanto tarda en cargar
export async function measureLoadTime(page: Page, url: string): Promise<number> {
  const startTime = Date.now()
  await page.goto(url)
  await waitForPageLoad(page)
  return Date.now() - startTime
}

// Revisar cosas básicas de accesibilidad
export async function checkBasicAccessibility(page: Page): Promise<{ issues: string[] }> {
  const issues: string[] = []

  // Ver si hay títulos
  const headings = await page.locator("h1, h2, h3").count()
  if (headings === 0) {
    issues.push("No hay títulos")
  }

  // Ver imágenes sin texto alternativo
  const imagesWithoutAlt = await page.locator("img:not([alt])").count()
  if (imagesWithoutAlt > 5) {
    issues.push(`Hay ${imagesWithoutAlt} imágenes sin alt`)
  }

  return { issues }
}

// No estoy seguro si esto funciona bien pero lo intento
export async function capturePerformanceMetrics(page: Page): Promise<any> {
  const metrics = await page.evaluate(() => {
    // @ts-ignore
    const performance = window.performance || window.msPerformance || window.webkitPerformance
    if (!performance) {
      return {}
    }

    const timing = performance.timing
    const navigationStart = timing.navigationStart

    return {
      loadTime: timing.loadEventEnd - navigationStart,
      ttfb: timing.responseStart - navigationStart,
      domContentLoadedTime: timing.domContentLoadedEventEnd - navigationStart,
      transferSize: (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.transferSize,
    }
  })

  return metrics
}
