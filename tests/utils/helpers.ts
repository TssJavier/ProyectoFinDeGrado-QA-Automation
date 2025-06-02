import type { Page } from "@playwright/test"

/**
 * Espera a que la página cargue completamente
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  try {
    await page.waitForLoadState("networkidle", { timeout: 15000 })
  } catch (e) {
    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(2000)
  }
}

/**
 * Acepta cookies si aparece el banner
 */
export async function acceptCookies(page: Page): Promise<void> {
  try {
    const cookieButton = page.locator('button:has-text("Permitir todas"), button:has-text("Aceptar")')
    if ((await cookieButton.count()) > 0) {
      await cookieButton.first().click()
      await page.waitForTimeout(1000)
    }
  } catch (e) {
    console.log("No se encontró banner de cookies")
  }
}

/**
 * Mide el tiempo de carga de una página
 */
export async function measureLoadTime(page: Page, url: string): Promise<number> {
  const startTime = Date.now()
  try {
    await page.goto(url, { timeout: 20000 })
    await waitForPageLoad(page)
  } catch (e) {
    console.log(`Error al cargar ${url}`)
  }
  return Date.now() - startTime
}

/**
 * Verifica aspectos básicos de accesibilidad
 */
export async function checkBasicAccessibility(page: Page): Promise<{ issues: string[] }> {
  const issues: string[] = []

  try {
    // Verificar títulos
    const headings = await page.locator("h1, h2, h3").count()
    if (headings === 0) {
      issues.push("No se encontraron títulos")
    }

    // Verificar imágenes sin alt
    const imagesWithoutAlt = await page.locator("img:not([alt])").count()
    if (imagesWithoutAlt > 5) {
      issues.push(`${imagesWithoutAlt} imágenes sin texto alternativo`)
    }

    // Verificar enlaces sin texto
    const emptyLinks = await page.locator("a:not(:has-text())").count()
    if (emptyLinks > 0) {
      issues.push(`${emptyLinks} enlaces sin texto`)
    }
  } catch (e) {
    issues.push("Error al verificar accesibilidad")
  }

  return { issues }
}

/**
 * Captura métricas de rendimiento
 */
export async function capturePerformanceMetrics(page: Page): Promise<any> {
  try {
    const metrics = await page.evaluate(() => {
      const performance = window.performance
      if (!performance) return {}

      const timing = performance.timing
      const navigationStart = timing.navigationStart

      return {
        loadTime: timing.loadEventEnd - navigationStart,
        domContentLoadedTime: timing.domContentLoadedEventEnd - navigationStart,
        ttfb: timing.responseStart - navigationStart,
        transferSize: (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.transferSize || 0,
      }
    })

    return metrics
  } catch (e) {
    console.log("Error capturando métricas de rendimiento")
    return {}
  }
}
