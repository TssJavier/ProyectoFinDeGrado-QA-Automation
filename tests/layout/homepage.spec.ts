import { test, expect } from "@playwright/test"

// Estas pruebas ven si la página se ve bien en diferentes tamaños de pantalla
test("Ver cómo se ve en una pantalla grande de ordenador", async ({ page }) => {
  try {
    // Pongo la pantalla como si fuera un monitor grande
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Busco el logo de CogniFit
    const logo = page.locator('img[alt*="CogniFit"], .logo')
    const logoExists = (await logo.count()) > 0

    if (logoExists) {
      await expect(logo.first()).toBeVisible({ timeout: 10000 })
      console.log("✅ El logo se ve bien en pantalla grande")
    } else {
      console.log("❌ No encontré el logo")
    }

    // Busco el menú de navegación
    const navigation = page.locator("nav, header")
    const navExists = (await navigation.count()) > 0

    if (navExists) {
      await expect(navigation.first()).toBeVisible()
      console.log("✅ El menú se ve bien en pantalla grande")
    } else {
      console.log("❌ No encontré el menú")
    }
  } catch (error) {
    console.log("❌ Error revisando la pantalla grande")
    throw error
  }
})

test("Ver cómo se ve en un móvil", async ({ page }) => {
  try {
    // Cambio el tamaño como si fuera un iPhone
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Reviso que no se salga por los lados
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)

    if (bodyWidth <= 400) {
      console.log("✅ La página cabe bien en el móvil")
    } else {
      console.log("❌ La página se sale por los lados en móvil")
    }

    expect(bodyWidth).toBeLessThanOrEqual(400)

    // Reviso que el título principal se siga viendo
    const mainTitle = page.locator("h1, h2")
    const titleExists = (await mainTitle.count()) > 0

    if (titleExists) {
      await expect(mainTitle.first()).toBeVisible()
      console.log("✅ El título se ve bien en móvil")
    } else {
      console.log("❌ No se ve el título en móvil")
    }
  } catch (error) {
    console.log("❌ Error revisando el móvil")
    throw error
  }
})

test("Revisar que estén las partes principales de la página", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Busco la parte de arriba (header)
    const header = page.locator("header, nav")
    if ((await header.count()) > 0) {
      await expect(header.first()).toBeVisible()
      console.log("✅ La parte de arriba está ahí")
    } else {
      console.log("❌ No encontré la parte de arriba")
    }

    // Busco el contenido principal
    const mainContent = page.locator("main, h1")
    const contentExists = (await mainContent.count()) > 0

    if (contentExists) {
      await expect(mainContent.first()).toBeVisible()
      console.log("✅ El contenido principal está ahí")
    } else {
      console.log("❌ No encontré el contenido principal")
    }
  } catch (error) {
    console.log("❌ Error revisando las partes de la página")
    throw error
  }
})
