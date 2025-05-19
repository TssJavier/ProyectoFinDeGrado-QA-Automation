import type { Page } from "@playwright/test"

/**
 * Espera a que se cargue completamente la página
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle")
}

/**
 * Realiza login en la plataforma CogniFit
 * Nota: Usar credenciales de prueba o variables de entorno en un caso real
 */
export async function login(page: Page, username: string, password: string): Promise<void> {
  await page.goto("/login")
  await page.fill('input[name="email"]', username)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await waitForPageLoad(page)
}

/**
 * Captura métricas de rendimiento básicas
 */
export async function capturePerformanceMetrics(page: Page): Promise<Record<string, number>> {
  const performanceTimingJson = await page.evaluate(() => {
    const timing = performance.timing
    const navigationStart = timing.navigationStart

    return {
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnection: timing.connectEnd - timing.connectStart,
      serverResponse: timing.responseStart - timing.requestStart,
      domComplete: timing.domComplete - navigationStart,
      loadEvent: timing.loadEventEnd - timing.loadEventStart,
      totalPageLoad: timing.loadEventEnd - navigationStart,
    }
  })

  return performanceTimingJson
}

/**
 * Verifica elementos de accesibilidad básicos
 */
export async function checkBasicAccessibility(page: Page): Promise<{ issues: string[] }> {
  const issues: string[] = []

  // Verificar imágenes sin alt
  const imagesWithoutAlt = await page.$$eval("img:not([alt])", (imgs) => imgs.length)
  if (imagesWithoutAlt > 0) {
    issues.push(`Hay ${imagesWithoutAlt} imágenes sin atributo alt`)
  }

  // Verificar que hay un solo h1
  const h1Count = await page.$$eval("h1", (h1s) => h1s.length)
  if (h1Count !== 1) {
    issues.push(`La página tiene ${h1Count} elementos h1, debería tener exactamente 1`)
  }

  // Verificar que los inputs tienen label asociado
  const inputsWithoutLabels = await page.$$eval("input[id]", (inputs) => {
    return inputs.filter((input) => {
      const id = input.getAttribute("id")
      return !document.querySelector(`label[for="${id}"]`)
    }).length
  })

  if (inputsWithoutLabels > 0) {
    issues.push(`Hay ${inputsWithoutLabels} inputs sin label asociado`)
  }

  return { issues }
}
