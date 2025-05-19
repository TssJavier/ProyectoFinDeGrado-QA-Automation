import { test, expect } from "@playwright/test"
import { waitForPageLoad } from "../utils/helpers"

test.describe("Pruebas de layout de la página principal", () => {
  test("El header debe mantener su estructura en desktop", async ({ page }) => {
    await page.goto("/")
    await waitForPageLoad(page)

    // Verificar logo
    const logo = page.locator(".navbar-brand img")
    await expect(logo).toBeVisible()

    // Verificar menú de navegación
    const navMenu = page.locator("nav.navbar")
    await expect(navMenu).toBeVisible()

    // Verificar botones de acción principales
    const ctaButtons = page.locator("a.btn-primary, button.btn-primary")
    expect(await ctaButtons.count()).toBeGreaterThan(0)
  })

  test("El footer debe contener enlaces importantes y copyright", async ({ page }) => {
    await page.goto("/")
    await waitForPageLoad(page)

    // Verificar que el footer existe
    const footer = page.locator("footer")
    await expect(footer).toBeVisible()

    // Verificar enlaces de redes sociales
    const socialLinks = footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]')
    expect(await socialLinks.count()).toBeGreaterThan(0)

    // Verificar texto de copyright
    const copyright = footer.locator('*:has-text("Copyright")')
    await expect(copyright).toBeVisible()
  })

  test("La página debe ser responsive en dispositivos móviles", async ({ page }) => {
    // Configurar viewport para móvil
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    await waitForPageLoad(page)

    // Verificar que el menú hamburguesa está visible en móvil
    const mobileMenu = page.locator(".navbar-toggler, button.hamburger")
    await expect(mobileMenu).toBeVisible()

    // Verificar que el contenido principal se ajusta al ancho de la pantalla
    const mainContent = page.locator("main, .main-content")
    const boundingBox = await mainContent.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(375)
  })
})
