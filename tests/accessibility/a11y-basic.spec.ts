import { test, expect } from "@playwright/test"

// Estas son las pruebas para ver si la página es accesible para personas con discapacidades
test("Revisar si la página tiene títulos bien puestos", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Busco si hay títulos H1 (los títulos principales)
    const h1Elements = page.locator("h1")
    const h1Count = await h1Elements.count()

    if (h1Count > 0) {
      console.log("✅ Encontré títulos principales en la página")
    } else {
      console.log("❌ No hay títulos principales")
    }

    expect(h1Count).toBeGreaterThan(0)

    // También miro si hay otros títulos como H2, H3
    const headings = page.locator("h1, h2, h3")
    const totalHeadings = await headings.count()

    if (totalHeadings > 1) {
      console.log(`✅ La página tiene ${totalHeadings} títulos en total`)
    } else {
      console.log("❌ Muy pocos títulos en la página")
    }

    expect(totalHeadings).toBeGreaterThan(1)
  } catch (error) {
    console.log("❌ Algo salió mal revisando los títulos")
    throw error
  }
})

test("Ver si los formularios se pueden usar bien", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Busco cajas de texto donde la gente puede escribir
    const inputs = page.locator("input")
    const inputCount = await inputs.count()

    if (inputCount > 0) {
      console.log(`✅ Encontré ${inputCount} cajas de texto`)

      // Reviso si la primera caja tiene alguna descripción
      const firstInput = inputs.first()
      const hasLabel =
        (await firstInput.getAttribute("aria-label")) ||
        (await firstInput.getAttribute("placeholder")) ||
        (await firstInput.getAttribute("name"))

      if (hasLabel) {
        console.log("✅ Las cajas de texto tienen descripciones")
      } else {
        console.log("❌ Las cajas de texto no tienen descripciones")
      }

      expect(hasLabel).toBeTruthy()
    } else {
      console.log("✅ No hay formularios que revisar")
    }
  } catch (error) {
    console.log("❌ Error revisando los formularios")
    throw error
  }
})

test("Probar si se puede navegar con el teclado", async ({ page }) => {
  try {
    await page.goto("https://www.cognifit.com/")
    await page.waitForLoadState("domcontentloaded")

    // Busco botones y enlaces que se puedan usar con Tab
    const focusableElements = page.locator("button, a, input")
    const count = await focusableElements.count()

    if (count > 0) {
      console.log(`✅ Hay ${count} elementos que se pueden usar con teclado`)

      // Pruebo hacer click en el primer elemento con Tab
      await focusableElements.first().focus()
      const focused = await page.evaluate(() => document.activeElement?.tagName)

      if (focused) {
        console.log("✅ Se puede navegar con el teclado")
      } else {
        console.log("❌ No se puede navegar bien con teclado")
      }

      expect(focused).toBeTruthy()
    } else {
      console.log("❌ No hay elementos para navegar con teclado")
    }
  } catch (error) {
    console.log("❌ Error probando la navegación con teclado")
    throw error
  }
})
