import { test, expect } from "@playwright/test"
import { waitForPageLoad, acceptCookies } from "../utils/helpers"

test.describe("Pruebas Funcionales - Navegación", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.cognifit.com/")
    await acceptCookies(page) // acepto cookies antes de hacer nada
    await waitForPageLoad(page)
  })

  test("Navegación por menú principal", async ({ page }) => {
    console.log("Probando si funcionan los enlaces del menú...")

    // Probar el botón de Test Cognitivos
    const testButton = page.locator('a:has-text("Test Cognitivos")')
    await testButton.click()
    await waitForPageLoad(page)
    expect(page.url()).toContain("test") // debería ir a una página con "test" en la URL
    console.log("Test Cognitivos funciona")

    // Volver atrás y probar Juegos
    await page.goBack()
    await waitForPageLoad(page)

    const gamesButton = page.locator('a:has-text("Juegos Mentales")')
    await gamesButton.click()
    await waitForPageLoad(page)
    expect(page.url()).toContain("juegos") // debería ir a juegos
    console.log("Juegos Mentales también funciona")
  })

  test("Botón principal Comenzar", async ({ page }) => {
    console.log("Probando el botón azul grande...")

    const startButton = page.locator('button:has-text("Comenzar"), a:has-text("Comenzar")')
    await expect(startButton).toBeVisible()
    await startButton.click()
    await waitForPageLoad(page)

    // Verificar que me llevó a otro sitio
    expect(page.url()).not.toBe("https://www.cognifit.com/")
    console.log("El botón Comenzar me llevó a otra página")
  })

  test("Botón Iniciar Sesión", async ({ page }) => {
    console.log("Probando el login...")

    const loginButton = page.locator('button:has-text("INICIAR SESIÓN"), a:has-text("INICIAR SESIÓN")')
    await expect(loginButton).toBeVisible()
    await loginButton.click()
    await waitForPageLoad(page)

    // Debería ir al login
    expect(page.url()).toContain("login")
    console.log("Me llevó al login correctamente")
  })
})
