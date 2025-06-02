import { test, expect } from "@playwright/test"

// Estas pruebas revisan si los botones y enlaces funcionan como deben
test("Revisar si el menú principal funciona", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Primero acepto las cookies si salen
    const cookieButton = page.locator('button:has-text("Permitir todas")')
    if ((await cookieButton.count()) > 0) {
      await cookieButton.click()
      await page.waitForTimeout(1000)
      console.log("✅ Acepté las cookies")
    }

    // Busco los enlaces del menú
    const menuLinks = page.locator("nav a, header a")
    const linkCount = await menuLinks.count()

    if (linkCount > 0) {
      console.log(`✅ El menú tiene ${linkCount} enlaces`)
    } else {
      console.log("❌ No encontré enlaces en el menú")
    }

    expect(linkCount).toBeGreaterThan(0)
  } catch (error) {
    console.log("❌ Algo falló revisando el menú")
    throw error
  }
})

test("Probar si el botón principal hace algo", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Busco el botón grande que dice "Comenzar"
    const mainButton = page.locator('button:has-text("Comenzar"), a:has-text("Comenzar")')
    const buttonExists = (await mainButton.count()) > 0

    if (buttonExists) {
      console.log("✅ Encontré el botón principal")

      await expect(mainButton.first()).toBeVisible({ timeout: 10000 })

      // Hago click en el botón
      await mainButton.first().click()
      await page.waitForLoadState("domcontentloaded")

      // Reviso si me llevó a otra página
      const currentUrl = page.url()
      if (currentUrl !== "https://www.cognifit.com/") {
        console.log("✅ El botón me llevó a otra página")
      } else {
        console.log("❌ El botón no hizo nada")
      }

      expect(currentUrl).not.toBe("https://www.cognifit.com/")
    } else {
      console.log("❌ No encontré el botón principal")
    }
  } catch (error) {
    console.log("❌ Error probando el botón principal")
    throw error
  }
})

test("Contar cuántos enlaces hay en la página", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Cuento todos los enlaces
    const allLinks = page.locator("a[href]")
    const linkCount = await allLinks.count()

    if (linkCount > 0) {
      console.log(`✅ La página tiene ${linkCount} enlaces en total`)
    } else {
      console.log("❌ No hay enlaces en la página")
    }

    expect(linkCount).toBeGreaterThan(0)
  } catch (error) {
    console.log("❌ Error contando los enlaces")
    throw error
  }
})
