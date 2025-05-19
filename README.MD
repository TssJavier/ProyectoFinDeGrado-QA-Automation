# Proyecto de Automatización de Pruebas para CogniFit

Este proyecto contiene pruebas automatizadas para la web de CogniFit (www.cognifit.com) utilizando Playwright con TypeScript.

## Estructura del Proyecto

- `tests/layout/`: Pruebas de diseño y estructura visual
- `tests/functional/`: Pruebas de funcionalidad y navegación
- `tests/performance/`: Pruebas de rendimiento y tiempos de carga
- `tests/accessibility/`: Pruebas de accesibilidad web
- `tests/utils/`: Utilidades y funciones auxiliares

## Requisitos

- Node.js 14 o superior
- npm o yarn

## Instalación

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cognifit-qa-automation.git
cd cognifit-qa-automation

# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install
\`\`\`

## Ejecución de Pruebas

\`\`\`bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas por categoría
npm run test:layout
npm run test:functional
npm run test:performance
npm run test:accessibility

# Ejecutar pruebas en navegadores específicos
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:mobile

# Ver reporte de pruebas
npm run report

# Ejecutar en modo debug
npm run debug
\`\`\`

## Integración Continua

Este proyecto está configurado para ejecutarse en GitHub Actions. Cada push o pull request a las ramas principales activará la ejecución automática de las pruebas.

## Licencia

Este proyecto es parte de un Trabajo de Fin de Grado y está destinado únicamente para fines educativos.
