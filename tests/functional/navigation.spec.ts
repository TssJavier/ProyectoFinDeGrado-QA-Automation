import { test, expect } from "@playwright/test"
import { waitForPageLoad } from "../utils/helpers"

test.describe("Pruebas de navegación", () => {
  test("Los enlaces del menú principal deben funcionar correctamente", async ({ page }) => {
    await page.goto("/")
    await waitForPageLoad(page)

    // Obtener todos los enlaces del menú principal
    const menuLinks = page.locator('nav.navbar a[href]:not([href="#"]):not([href=""])')
    const count = await menuLinks.count()

    // Verificar que hay enlaces en el menú
    expect(count).toBeGreaterThan(0)

    // Probar los primeros 3 enlaces (para no hacer la prueba muy larga)
    for (let i = 0; i < Math.min(3, count); i++) {
      const link = menuLinks.nth(i)
      const href = await link.getAttribute("href")
      const linkText = await link.textContent()

      console.log(`Probando enlace: ${linkText} (${href})`)

      // Clic en el enlace
      await link.click()
      await waitForPageLoad(page)

      // Verificar que la navegación funcionó
      if (href?.startsWith("/")) {
        // Enlaces internos
        expect(page.url()).toContain(href)
      } else if (href?.startsWith("http")) {
        // Enlaces externos
        expect(page.url()).toContain(new URL(href).hostname)
      }

      // Volver a la página principal para el siguiente enlace
      await page.goto("/")
      await waitForPageLoad(page)
    }
  })

  test("El buscador debe mostrar resultados relevantes", async ({ page }) => {
    await page.goto("/")
    await waitForPageLoad(page)

    // Buscar el campo de búsqueda (ajustar selector según la estructura real)
    const searchInput = page.locator('input[type="search"], .search-input')

    // Si no hay buscador visible, puede estar en un menú desplegable
    if ((await searchInput.count()) === 0) {
      // Intentar abrir el buscador (ajustar según la web real)
      const searchIcon = page.locator(".search-icon, button:has(.fa-search)")
      if ((await searchIcon.count()) > 0) {
        await searchIcon.click()
        await page.waitForTimeout(500) // Esperar animación
      }
    }

    // Si encontramos el buscador, probarlo
    if ((await page.locator('input[type="search"], .search-input').count()) > 0) {
      const searchInput = page.locator('input[type="search"], .search-input')
      await searchInput.fill("memoria")
      await searchInput.press("Enter")
      await waitForPageLoad(page)

      // Verificar que hay resultados
      const results = page.locator(".search-results, .results-container, article, .card")
      await expect(results.first()).toBeVisible()
    } else {
      console.log("No se encontró un buscador para probar")
      test.skip()
    }
  })
})
