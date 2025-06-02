import { test, expect } from "@playwright/test"
import { waitForPageLoad, acceptCookies, checkBasicAccessibility } from "../utils/helpers"

test.describe("Pruebas de Accesibilidad", () => {
  test("Estructura semántica básica", async ({ page }) => {
    console.log("Viendo si la página está bien estructurada...")

    await page.goto("https://www.cognifit.com/")
    await acceptCookies(page)
    await waitForPageLoad(page)

    // Ver si hay un título principal
    const h1 = page.locator("h1")
    await expect(h1.first()).toBeVisible()

    // Ver si hay navegación
    const nav = page.locator("nav, [role='navigation']")
    await expect(nav.first()).toBeVisible()

    // Ver si hay contenido principal
    const main = page.locator("main, [role='main']")
    const hasMain = (await main.count()) > 0
    if (!hasMain) {
      // Si no hay main, al menos que haya títulos
      const content = page.locator("h1, h2, h3")
      expect(await content.count()).toBeGreaterThan(0)
    }

    console.log("La estructura parece correcta")
  })

  test("Accesibilidad de botones y enlaces", async ({ page }) => {
    console.log("Viendo si los botones tienen texto...")

    await page.goto("https://www.cognifit.com/")
    await acceptCookies(page)
    await waitForPageLoad(page)

    // Ver si el botón principal tiene texto
    const startButton = page.locator('button:has-text("Comenzar")')
    const buttonText = await startButton.textContent()
    expect(buttonText?.trim()).toBeTruthy()

    // Ver si los enlaces del menú tienen texto
    const menuLinks = page.locator('a:has-text("Test Cognitivos"), a:has-text("Juegos Mentales")')
    const linkCount = await menuLinks.count()
    expect(linkCount).toBeGreaterThan(0)

    console.log("Los botones y enlaces están bien")
  })

  test("Verificación general de accesibilidad", async ({ page }) => {
    console.log("Revisión general de accesibilidad...")

    await page.goto("https://www.cognifit.com/")
    await acceptCookies(page)
    await waitForPageLoad(page)

    const { issues } = await checkBasicAccessibility(page)

    console.log(`Problemas encontrados: ${issues.length}`)
    issues.forEach((issue) => console.log(`- ${issue}`))

    // Permito hasta 5 problemas pequeños
    expect(issues.length).toBeLessThanOrEqual(5)
    console.log("La accesibilidad está aceptable")
  })
})
