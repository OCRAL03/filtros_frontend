'use client'
import { productsDummyData, userDummyData, navCategories } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { getArticulos } from "@/context/articulo-api";
import { getCategorias } from "@/context/categoria-api";
import { classifyHierarchy } from "@/context/filters";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [categoriesMenu, setCategoriesMenu] = useState([])

    // Utilidades de normalización (ignorar mayúsculas y acentos)
    const normalize = (s) => (s || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    // Taxonomía definitiva: grupos principales y sinónimos para derivación
    const RAW_GROUPS = {
      "Electrónica y Tecnología": [
        // Celulares y accesorios
        "CELULARES","SMARTPHONES","FUNDAS","CARGADORES","POWER BANKS",
        // Computación
        "LAPTOPS","LAPTOP","COMPUTADORAS","PC","MONITORES","TECLADOS","IMPRESORAS","PRINTER","IMPRESORA",
        // Audio
        "AUDIFONOS","AURICULARES","HEADPHONE","EARPHONE","PARLANTES","SPEAKERS","BARRAS DE SONIDO",
        // Video y TV
        "TELEVISORES","TV","PROYECTORES","DECODIFICADORES",
        // Cámaras
        "CAMARAS","CAMARAS DIGITALES","CAMARAS DEPORTIVAS","CAMARAS DE SEGURIDAD","CAMERA",
        // Consolas y videojuegos
        "PLAYSTATION","XBOX","NINTENDO","VIDEOJUEGOS","ACCESORIOS",
        // Smart Home
        "ASISTENTES INTELIGENTES","ENCHUFES INTELIGENTES"
      ],
      "Línea Blanca y Electrodomésticos": [
        // Cocina
        "COCINAS","HORNOS","MICROONDAS",
        // Refrigeración
        "REFRIGERADORAS","CONGELADORAS",
        // Lavado
        "LAVADORAS","SECADORAS",
        // Climatización
        "AIRES ACONDICIONADOS","CALEFACTORES","VENTILADORES",
        // Pequeños electrodomésticos
        "LICUADORAS","BATIDORAS","PLANCHAS","ASPIRADORAS"
      ],
      "Muebles y Decoración": [
        "SOFAS","SECCIONALES","MESAS DE CENTRO","MUEBLES DE TV",
        "MESAS","SILLAS","VITRINAS","JUEGOS DE COMEDOR",
        "CAMAS","COLCHONES","TARIMAS","CABECERAS","VELADORES","ROPERO","COMODA",
        "ESCRITORIOS","SILLAS ERGONOMICAS","ESTANTERIAS",
        "CUADROS","RELOJES","ALFOMBRAS",
        "LAMPARAS DE MESA","LAMPARAS DE PIE","FOCOS","LUCES LED","APLIQUES"
      ],
      "Hogar y Organización": [
        "ASPIRADORAS","UTENSILIOS","OLLAS","SARTENES","ORGANIZADORES","PLANCHAS","CAMARAS","ALARMAS","GRAMA SINTETICO","HERRAMIENTAS"
      ],
      "Belleza y Cuidado Personal": [
        "AFEITADORAS","PRODUCTOS PARA BARBERIA","PLANCHAS DE CABELLO"
      ],
      "Juguetes y Entretenimiento": [
        "JUGUETES","JUGUETES EDUCATIVOS","JUEGOS DE MESA","CARTAS","TABLEROS","DRONES","ARTE Y MANUALIDADES"
      ],
      "Motos y Movilidad Eléctrica": [
        "MOTOCICLETAS","MOTOS","125CC","150CC","250CC","DEPORTIVAS","AUTOMATICAS",
        "TRIMOVILES","CARGUEROS","DE CARGA","DE PASAJEROS","ELECTRICOS",
        "MOTOS ELECTRICAS","SCOOTERS URBANOS","ELECTRICAS DE REPARTO","BICIMOTOS",
        "ACCESORIOS PARA MOTOCICLETAS","CASCOS","GUANTES","BAULES","LUCES LED",
        "EQUIPAMIENTO DEL CONDUCTOR","RODILLERAS","IMPERMEABLES",
        "HERRAMIENTAS Y TALLER","CARGADORES DE BATERIA"
      ],
    };

    const GROUPS_NORMALIZED = Object.fromEntries(
      Object.entries(RAW_GROUPS).map(([group, items]) => [
        group,
        new Set(items.map((i) => normalize(i)))
      ])
    );

    const deriveGroupFromCategoryName = (name) => {
      const n = normalize(name);
      for (const [group, itemsSet] of Object.entries(GROUPS_NORMALIZED)) {
        if (itemsSet.has(n)) return group;
      }
      for (const group of Object.keys(RAW_GROUPS)) {
        if (normalize(group) === n) return group;
      }
      // Mapeos adicionales para términos frecuentes
      if (n === normalize('ACCSESORIOS') || n === normalize('ACCESSORIES')) return 'Electrónica y Tecnología';
      if (n === normalize('ELECTROHOGAR')) return 'Línea Blanca y Electrodomésticos';
      return undefined;
    };

    const fetchProductData = async () => {
        try {
            const articulos = await getArticulos();
            const mapped = (articulos || []).map((a) => {
                const precioVenta = Number(a?.precioVenta ?? 0);
                const descuento = Number(a?.descuento ?? 0);
                const offerPrice = precioVenta > 0
                    ? Math.round(precioVenta * (1 - descuento / 100) * 100) / 100
                    : 0;
                const brandName = a?.idMarca2?.nombre ?? undefined;
                const categoryName = a?.idCategoria2?.nombre ?? undefined;
                const rawImagen = a?.imagen;
                // Utilidad: ¿parece nombre de archivo de imagen?
                // Token permisivo para nombres de imagen (con o sin extensión) y URLs
                const isLikelyToken = (value) => {
                  const s = String(value || '').trim();
                  if (!s) return false;
                  if (/^https?:\/\//i.test(s)) return true; // permitir URLs externas
                  let t = s.replace(/^([A-Za-z]):[\\\/]/, '').replace(/\\/g, '/').split('/')
                    .filter(Boolean).pop() || s;
                  t = t.replace(/["']/g, '');
                  if (!t) return false;
                  if (/^no\s*tiene$/i.test(t) || /^sin\s*imagen$/i.test(t)) return false;
                  return /^[\w\-. ]+(\.[a-z0-9]+)?$/i.test(t);
                };

                // Expande un token sin extensión a múltiples candidatos con extensiones comunes
                const expandCandidates = (token) => {
                  const s = String(token || '').trim();
                  if (!s) return [];
                  if (/^https?:\/\//i.test(s)) return [s];
                  const base = s.replace(/^([A-Za-z]):[\\\/]/, '').replace(/\\/g, '/').split('/')
                    .filter(Boolean).pop() || s;
                  const basename = base.replace(/["']/g, '');
                  if (/\.[a-z0-9]+$/i.test(basename)) return [basename];
                  const exts = ['png','jpg','jpeg','jfif','webp'];
                  return exts.map((ext) => `${basename}.${ext}`);
                };

                // Convierte la cadena/paths a tokens de imagen (soporta JSON arrays y separadores comunes)
                const toBasenameList = (value) => {
                  if (Array.isArray(value)) return value.map(String).filter(isLikelyToken);
                  const v = String(value ?? '').trim();
                  // Intentar parsear como JSON array
                  try {
                    if (/^\s*\[/.test(v)) {
                      const arr = JSON.parse(v);
                      if (Array.isArray(arr)) return arr.map(String).filter(isLikelyToken);
                    }
                  } catch (_) {}
                  if (!v) return [];
                  // Si luce como un solo token (sin separadores), devolver tal cual
                  if (!/[|;,\n]/.test(v)) {
                    return [v];
                  }
                  // Dividir por | , ; , saltos de línea
                  return v
                    .split(/[|;]\s*|\r?\n|,\s*(?![^\[]*\])/)
                    .filter(Boolean)
                    .map((p) => String(p).trim())
                    .filter(isLikelyToken);
                };

                const normalizeSrc = (src) => {
                  if (!src || typeof src !== 'string') return src;
                  if (/^https?:\/\//i.test(src)) return encodeURI(src);
                  let s = src.trim().replace(/^\/+/, '').replace(/\\/g, '/');
                  s = s.replace(/^([A-Za-z]):\//, '');
                  // Siempre servimos desde Next public: /assets/articulos
                  const basename = s.split('/').filter(Boolean).pop() || s;
                  const url = `/assets/articulos/${basename}`;
                  return encodeURI(url);
                };

                // Construir arreglo de imágenes con candidatos y deduplicación
                const names = Array.isArray(rawImagen)
                  ? rawImagen
                  : (typeof rawImagen === 'string' ? toBasenameList(rawImagen) : []);
                let images = names
                  .flatMap(expandCandidates)
                  .map(normalizeSrc)
                  .filter(Boolean);
                // Deduplicar preservando orden
                images = Array.from(new Set(images));
                // Log de diagnóstico en desarrollo: candidatos y resolución
                try {
                  if (typeof window !== 'undefined') {
                    const dbg = {
                      id: a?.idArticulo ?? a?._id,
                      name: a?.nombre,
                      rawImagen,
                      tokens: names,
                      candidates: names.flatMap(expandCandidates),
                      resolved: images
                    };
                    console.debug('[QuickCart][ImageResolver]', dbg);
                  }
                } catch {}
                if (!images || images.length === 0) {
                  images = [assets.upload_area || "/assets/logo-sarcos.png"];
                }

                // Clasificación jerárquica según organizacion.md
                const classInfo = classifyHierarchy({
                  name: a?.nombre,
                  description: a?.descripcion,
                  category: categoryName,
                });
                const OFFICIAL_GROUPS = {
                  'Electronica y Tecnologia': 'Electrónica y Tecnología',
                  'Linea Blanca y Electrodomesticos': 'Línea Blanca y Electrodomésticos',
                  'Muebles y Decoracion': 'Muebles y Decoración',
                  'Hogar y Organizacion': 'Hogar y Organización',
                  'Belleza y Cuidado Personal': 'Belleza y Cuidado Personal',
                  'Juguetes y Entretenimiento': 'Juguetes y Entretenimiento',
                  'Motos y Movilidad Electrica': 'Motos y Movilidad Eléctrica',
                };
                const classifiedGroup = OFFICIAL_GROUPS[classInfo?.category] || undefined;
                const resolvedGroup = (categoryName ? deriveGroupFromCategoryName(categoryName) : undefined) || classifiedGroup;

                return {
                    _id: String(a?.idArticulo ?? a?._id ?? Math.random().toString(36).slice(2)),
                    name: a?.nombre ?? "",
                    description: a?.descripcion ?? "",
                    price: precioVenta,
                    offerPrice,
                    image: images,
                    category: categoryName || "Sin categoría",
                    categoryGroup: resolvedGroup,
                    subcategory: classInfo?.subcategory || undefined,
                    types: classInfo?.types || [],
                    brand: brandName || "Genérico",
                    date: a?.fechaIngreso ? new Date(a.fechaIngreso).getTime() : Date.now(),
                    __v: 0,
                };
            });
            setProducts(mapped);
        } catch (err) {
            console.error("Fallo al cargar artículos del backend, usando dummy:", err);
            setProducts(productsDummyData);
        }
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    // Columnas definitivas y orden del menú
    const GROUP_TITLES = [
      "Electrónica y Tecnología",
      "Línea Blanca y Electrodomésticos",
      "Muebles y Decoración",
      "Hogar y Organización",
      "Belleza y Cuidado Personal",
      "Juguetes y Entretenimiento",
      "Motos y Movilidad Eléctrica",
    ];

    const FINAL_MENU_COLUMNS = {
      "Electrónica y Tecnología": [
        { title: "Celulares y accesorios", items: ["Smartphones", "Fundas", "Cargadores", "Power banks"] },
        { title: "Computación", items: ["Laptops", "PC", "Monitores", "Teclados", "Impresoras"] },
        { title: "Audio", items: ["Audífonos", "Parlantes", "Barras de sonido"] },
        { title: "Video y TV", items: ["Televisores", "Proyectores", "Decodificadores"] },
        { title: "Cámaras", items: ["Cámaras digitales", "Cámaras deportivas", "Cámaras de seguridad"] },
        { title: "Consolas y videojuegos", items: ["PlayStation", "Xbox", "Nintendo", "Accesorios"] },
        { title: "Smart Home", items: ["Asistentes inteligentes", "Enchufes inteligentes"] },
      ],
      "Línea Blanca y Electrodomésticos": [
        { title: "Cocina", items: ["Cocinas", "Hornos", "Microondas"] },
        { title: "Refrigeración", items: ["Refrigeradoras", "Congeladoras"] },
        { title: "Lavado", items: ["Lavadoras", "Secadoras"] },
        { title: "Climatización", items: ["Aires acondicionados", "Calefactores", "Ventiladores"] },
        { title: "Pequeños electrodomésticos", items: ["Licuadoras", "Batidoras", "Planchas", "Aspiradoras"] },
      ],
      "Muebles y Decoración": [
        { title: "Sala", items: ["Sofás", "Seccionales", "Mesas de centro", "Muebles de TV"] },
        { title: "Comedor", items: ["Mesas", "Sillas", "Vitrinas", "Juegos de comedor"] },
        { title: "Dormitorio", items: ["Camas", "Colchones", "Tarimas", "Cabeceras", "Veladores", "Roperos", "Cómodas"] },
        { title: "Oficina", items: ["Escritorios", "Sillas ergonómicas", "Estanterías"] },
        { title: "Decoración", items: ["Cuadros", "Relojes", "Alfombras"] },
        { title: "Iluminación", items: ["Lámparas de mesa", "Lámparas de pie", "Focos", "Luces LED", "Apliques"] },
      ],
      "Hogar y Organización": [
        { title: "Limpieza", items: ["Aspiradoras"] },
        { title: "Cocina", items: ["Utensilios", "Ollas", "Sartenes"] },
        { title: "Baño", items: ["Organizadores"] },
        { title: "Lavandería", items: ["Planchas"] },
        { title: "Seguridad", items: ["Cámaras", "Alarmas"] },
        { title: "Jardín", items: ["Grama sintético", "Herramientas"] },
      ],
      "Belleza y Cuidado Personal": [
        { title: "Cuidado personal", items: ["Afeitadoras", "Productos para barbería", "Planchas de cabello"] },
      ],
      "Juguetes y Entretenimiento": [
        { title: "Juguetes educativos", items: ["Juguetes en general"] },
        { title: "Juegos de mesa", items: ["Cartas", "Tableros"] },
        { title: "Control remoto y robótica", items: ["Drones"] },
        { title: "Arte y manualidades", items: [] },
      ],
      "Motos y Movilidad Eléctrica": [
        { title: "Motocicletas lineales", items: ["125cc", "150cc", "250cc", "Deportivas", "Automáticas"] },
        { title: "Trimóviles y cargueros", items: ["De carga", "De pasajeros", "Eléctricos"] },
        { title: "Motos eléctricas y scooters", items: ["Scooters urbanos", "Eléctricas de reparto", "Bicimotos"] },
        { title: "Accesorios para motocicletas", items: ["Cascos", "Guantes", "Baúles", "Luces LED"] },
        { title: "Equipamiento del conductor", items: ["Rodilleras", "Impermeables"] },
        { title: "Herramientas y taller", items: ["Cargadores de batería"] },
      ],
    };

    // Construye el menú de categorías desde la BD y las reglas de grupos
    const fetchCategoriesMenu = async () => {
      try {
        const categorias = await getCategorias();
        const names = (categorias || []).map((c) => c?.nombre).filter(Boolean);
        const byGroup = Object.fromEntries(Object.keys(RAW_GROUPS).map((g) => [g, new Map()]));
        for (const name of names) {
          const group = deriveGroupFromCategoryName(name);
          if (!group) continue;
          const key = normalize(name);
          if (key === normalize(group)) continue;
          if (!byGroup[group].has(key)) {
            byGroup[group].set(key, name);
          }
        }
        const fallbackBrands = new Map();
        for (const cat of navCategories || []) {
          const titleNorm = normalize(cat.title);
          let resolvedGroup;
          if (titleNorm === normalize('Tecnología')) resolvedGroup = 'Electrónica y Tecnología';
          else if (titleNorm === normalize('Hogar y electrohogar')) resolvedGroup = 'Línea Blanca y Electrodomésticos';
          else if (titleNorm === normalize('Vehículos')) resolvedGroup = 'Motos y Movilidad Eléctrica';
          else if (titleNorm === normalize('Instrumentos musicales')) resolvedGroup = undefined;
          else resolvedGroup = cat.title;
          if (resolvedGroup) fallbackBrands.set(resolvedGroup, cat.brands || []);
        }
        const menu = GROUP_TITLES.map((group) => {
          const derivedItems = Array.from(byGroup[group]?.values() || []);
          const sourceItems = derivedItems.length ? derivedItems : (RAW_GROUPS[group] || []);
          return {
            title: group,
            brands: fallbackBrands.get(group) || [],
            items: (sourceItems || []).slice().sort().map((n) => ({ name: n, value: n })),
            columns: FINAL_MENU_COLUMNS[group] || [],
          };
        });
        setCategoriesMenu(menu);
      } catch (error) {
        console.error('Fallo al cargar categorías, usando fallback estático:', error);
        const fallbackBrands = new Map();
        for (const cat of navCategories || []) {
          const titleNorm = normalize(cat.title);
          let resolvedGroup;
          if (titleNorm === normalize('Tecnología')) resolvedGroup = 'Electrónica y Tecnología';
          else if (titleNorm === normalize('Hogar y electrohogar')) resolvedGroup = 'Línea Blanca y Electrodomésticos';
          else if (titleNorm === normalize('Vehículos')) resolvedGroup = 'Motos y Movilidad Eléctrica';
          else if (titleNorm === normalize('Instrumentos musicales')) resolvedGroup = undefined;
          else resolvedGroup = cat.title;
          if (resolvedGroup) fallbackBrands.set(resolvedGroup, cat.brands || []);
        }
        setCategoriesMenu(
          GROUP_TITLES.map((g) => ({
            title: g,
            brands: fallbackBrands.get(g) || [],
            items: (RAW_GROUPS[g] || []).slice().sort().map((n) => ({ name: n, value: n })),
            columns: FINAL_MENU_COLUMNS[g] || [],
          }))
        );
      }
    };

    const addToCart = async (itemId) => {

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

    }

    const updateCartQuantity = async (itemId, quantity) => {

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                totalAmount += (itemInfo.offerPrice ?? itemInfo.price ?? 0) * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    useEffect(() => {
        fetchProductData()
        fetchCategoriesMenu()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    const value = {
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        categoriesMenu,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}