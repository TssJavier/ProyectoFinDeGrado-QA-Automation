import { test, expect } from "@playwright/test"
import { waitForPageLoad, acceptCookies } from "../utils/helpers"

test.describe("Pruebas de Layout - Responsive", () => {
  test("Layout en Desktop", async ({ page }) => {
    console.log("Probando como se ve en ordenador...")

    await page.setViewportSize({ width: 1280, height: 720 }) // tamaño de ordenador
    await page.goto("https://www.cognifit.com/")
    await acceptCookies(page)
    await waitForPageLoad(page)

    // Ver si están los elementos principales
    const logo = page.locator('img[alt*="CogniFit"], .logo')
    await expect(logo.first()).toBeVisible()

    const mainTitle = page.locator('h1, *:has-text("perdiendo facultades")')
    await expect(mainTitle.first()).toBeVisible()

    const startButton = page.locator('button:has-text("Comenzar")')
    await expect(startButton).toBeVisible()

    console.log("En desktop se ve bien")
  })

  test("Layout en Tablet", async ({ page }) => {
    console.log("Probando como se ve en tablet...")

    await page.setViewportSize({ width: 768, height: 1024 }) // tamaño tablet
    await page.goto("https://www.cognifit.com/")
    await acceptCookies(page)
    await waitForPageLoad(page)

    // Ver que no se sale por los lados
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(768)

    // Ver que el título sigue ahí
    const mainTitle = page.locator('h1, *:has-text("perdiendo facultades")')
    await expect(mainTitle.first()).toBeVisible()

    console.log("En tablet también se ve bien")
  })

  test("Layout en Móvil", async ({ page }) => {
    console.log("Probando como se ve en móvil...")

    await page.setViewportSize({ width: 375, height: 667 }) // tamaño móvil
    await page.goto("https://www.cognifit.com/")
    await acceptCookies(page)
    await waitForPageLoad(page)

    // Ver que no hay scroll horizontal (que no se salga)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(400) // doy un poco de margen

    // Ver que el botón sigue visible
    const startButton = page.locator('button:has-text("Comenzar")')
    await expect(startButton).toBeVisible()

    // Ver que hay menú (aunque sea diferente)
    const menuItems = page.locator("nav, .navbar, .menu")
    await expect(menuItems.first()).toBeVisible()

    console.log("En móvil se adapta correctamente")
  })
})
