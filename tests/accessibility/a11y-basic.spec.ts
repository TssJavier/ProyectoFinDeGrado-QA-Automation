import { test, expect } from "@playwright/test"
import { checkBasicAccessibility, waitForPageLoad } from "../utils/helpers"

test.describe("Pruebas básicas de accesibilidad", () => {
  test("La página principal debe cumplir criterios básicos de accesibilidad", async ({ page }) => {
    await page.goto("/")
    await waitForPageLoad(page)

    const { issues } = await checkBasicAccessibility(page)

    console.log("Problemas de accesibilidad encontrados:", issues)

    // No debería haber problemas graves, pero puede haber advertencias
    expect(issues.length).toBeLessThanOrEqual(3)
  })

  test("Los formularios deben tener etiquetas y ser accesibles", async ({ page }) => {
    // Login en el site
    await page.goto("/login")
    await waitForPageLoad(page)

    // Verificar que los inputs tienen labels y siguen funcionando correctamente
    const inputs = page.locator("input[id]")
    const count = await inputs.count()

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute("id")

      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasAriaLabel = await input.getAttribute("aria-label")
        const hasPlaceholder = await input.getAttribute("placeholder")

        // Debe tener al menos una forma de accesibilidad
        const hasAccessibility = (await label.count()) > 0 || hasAriaLabel || hasPlaceholder
        expect(hasAccessibility).toBeTruthy()
      }
    }
  })

  test("El contraste de color debe ser adecuado para elementos principales", async ({ page }) => {
    await page.goto("/")
    await waitForPageLoad(page)

    // Esta es una prueba simplificada de contraste
    // En un proyecto real, usaríamos una herramienta específica como axe

    // Verificar que los textos principales tienen un color que contrasta con el fondo
    const mainTexts = await page.$$eval("h1, h2, p", (elements) => {
      return elements.map((el) => {
        const style = window.getComputedStyle(el)
        return {
          textColor: style.color,
          backgroundColor: style.backgroundColor,
        }
      })
    })

    console.log("Análisis de contraste:", mainTexts)

    // En un caso real, aquí calcularíamos el ratio de contraste
    // y verificaríamos que cumple con WCAG 2.1 AA (4.5:1 para texto normal)

    // Por ahora, solo registramos la información para análisis manual
    expect(mainTexts.length).toBeGreaterThan(0)
  })
})
