# El Apañador - Código Completo del Proyecto

## 📁 Estructura Completa del Proyecto

```
el_apanador/
├── index.html                    # Página principal
├── package.json                  # Dependencias Node.js
├── .env                  # Variables de entorno
├── .gitignore                    # Archivos a ignorar
│
├── frontend/
│   └── js/
│       ├── app.js               # Aplicación principal
│       ├── detalle-truco.js     # Detalle de solución con CTAs
│       ├── Scanner.js           # Escáner de herramientas con IA
│       ├── LegalDisclaimer.js   # Disclaimer legal obligatorio
│       ├── RiskPopup.js         # Popup de advertencias de riesgo
│       ├── legal_texts.js       # Textos legales centralizados
│       └── utils.js             # Utilidades generales
│
├── css/
│   ├── styles.css               # Estilos principales
│   ├── components.css           # Componentes reutilizables
│   ├── detalle-truco.css        # Estilos detalle + CTAs
│   ├── legal.css                # Estilos componentes legales
│   └── scanner.css              # Estilos del escáner
│
├── server/
│   ├── index.js                 # Servidor Express
│   ├── models/
│   │   ├── index.js             # Modelos Sequelize
│   │   ├── Problem.js           # Modelo Problema
│   │   ├── Solution.js          # Modelo Solución
│   │   ├── Tool.js              # Modelo Herramienta (con monetización)
│   │   ├── RiskLevel.js         # Modelo Nivel de Riesgo
│   │   ├── Service.js           # Modelo Servicio
│   │   ├── SolutionTool.js      # Relación N:M
│   │   ├── ProblemService.js    # Relación N:M
│   │   └── ServiceLead.js       # Leads de profesionales
│   ├── routes/
│   │   ├── problems.js          # API Problemas
│   │   ├── solutions.js         # API Soluciones
│   │   ├── tools.js             # API Herramientas
│   │   ├── busqueda.js          # API Búsqueda
│   │   ├── analytics.js         # API Analytics
│   │   └── scanner.js           # API Escáner IA
│   ├── utils/
│   │   └── scoring.js           # Algoritmo de scoring
│   └── middleware/
│       └── errorHandler.js       # Manejo de errores
│
├── database/
│   └── schema.sql               # Esquema PostgreSQL completo
│
├── data/
│   ├── seed/
│   │   └── solutions.json       # 20 soluciones de ejemplo
│   ├── trucos/
│   │   └── truco_001.json       # Ejemplo completo
│   └── ejemplos/
│       ├── problema_ejemplo.json
│       ├── solucion_ejemplo.json
│       └── herramienta_ejemplo.json
│
├── scripts/
│   ├── importar-seed-data.js    # Importar seed data
│   └── importar-datos-postgres.js
│
└── docs/
    ├── ARQUITECTURA.md
    ├── MIGRACION_POSTGRESQL.md
    ├── COMPONENTES_LEGALES.md
    ├── SEED_DATA.md
    └── CTAS.md
```

## 🎯 Características Implementadas

### ✅ Frontend
- Pantalla principal con búsqueda
- Búsqueda por texto, voz e imagen
- Accesos rápidos por categoría
- Detalle de solución con CTAs
- Escáner de herramientas con IA
- Disclaimer legal obligatorio
- Popups de riesgo para categorías peligrosas
- Favoritos y recientes

### ✅ Backend
- API REST completa con Express
- PostgreSQL con Sequelize
- Modelos normalizados
- Sistema de búsqueda avanzado
- Algoritmo de scoring
- Analytics y tracking
- Endpoint para escáner IA

### ✅ Base de Datos
- Esquema PostgreSQL optimizado
- Relaciones N:M
- Campos de monetización (afiliados)
- Índices para performance
- Vistas materializadas
- Triggers automáticos

### ✅ Monetización
- Enlaces de afiliados en herramientas
- CTAs para compra en Amazon
- Sistema de leads para profesionales
- Tracking de conversiones

### ✅ Seguridad Legal
- Disclaimer obligatorio al inicio
- Popups de riesgo por categoría
- Textos legales centralizados
- Registro de aceptaciones

## 📝 Archivos Clave a Revisar

Ver los siguientes archivos para el código completo:

1. **Frontend Principal**: `frontend/js/app.js`
2. **Detalle con CTAs**: `frontend/js/detalle-truco.js`
3. **Escáner IA**: `frontend/js/Scanner.js`
4. **Componentes Legales**: `frontend/js/LegalDisclaimer.js` y `RiskPopup.js`
5. **Backend**: `server/index.js` y rutas en `server/routes/`
6. **Modelos**: `server/models/`
7. **Base de Datos**: `database/schema.sql`

## 🚀 Para Ejecutar

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env
 .env
# Editar .env con tus credenciales

# 3. Crear base de datos
psql -U postgres -d el_apanador -f database/schema.sql

# 4. Importar seed data
npm run seed

# 5. Iniciar servidor
npm start
```

## 📊 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL
- **ORM**: Sequelize
- **IA**: Preparado para Claude API / Google Vision



