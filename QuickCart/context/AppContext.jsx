'use client'
import { assets } from "@/assets/assets";
import { getBrandsForCategory } from "@/assets/brandLogos";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { getProductos, getProductosFiltered } from "@/context/producto-api";
import { getCategorias } from "@/context/categoria-api";
import { getSubCategoriasByCategoria } from "@/context/subcategoria-api";
import { getTiposProductoBySubCategoria } from "@/context/tipo-producto-api";
import { getMarcas } from "@/context/marca-api";
import { getTiendas } from "@/context/tienda-api";
import { getApiBaseUrl } from "@/context/api";
import { classifyHierarchy } from "@/components/filters/filters.utils";
import { FILTERS_MAP } from "@/components/filters/filters.constants";
import { normalizeSrcWithFallback } from "@/utils/imageResolver";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 })
    const [filterMeta, setFilterMeta] = useState({ precio_rango: undefined, atributos_disponibles: undefined })
    const [brands, setBrands] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [categoriesMenu, setCategoriesMenu] = useState([])
    const [stores, setStores] = useState([])

    const normalize = (s) => (s || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();


    const mapProductoToProduct = (a) => {
        const precioVenta = Number(a?.precioVenta ?? 0);
        const descuento = Number(a?.descuento ?? 0);
        const offerPrice = precioVenta > 0
            ? Math.round(precioVenta * (1 - descuento / 100) * 100) / 100
            : 0;

        const brandName = a?.idMarca2?.nombre ?? undefined;
        const categoryName = a?.idCategoria2?.nombre ?? undefined;

        const rawImagen = a?.imagen;

        const deriveTokensFromName = (name, brand) => {
          const tokens = new Set();
          const s = String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          const b = String(brand || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
          if (!s) return [];
          // Modelos alfanuméricos típicos (ej: RR121H, UN55DU8000G, BLSTKAG-VPB, LT-75KB538)
          const reModel = /[A-Z]{2,}[A-Z0-9-]*\d+[A-Z0-9-]*/g;
          const upper = s.toUpperCase();
          (upper.match(reModel) || []).forEach((m) => tokens.add(m));
          // Palabras con dígitos o guiones que parecen códigos
          s.split(/\s+/).forEach((w) => {
            const uw = w.toUpperCase();
            if ((/[0-9]/.test(uw) || /-/.test(uw)) && /[A-Z]/.test(uw)) {
              tokens.add(uw);
            }
          });
          // Variante sin espacios ni guiones del nombre completo
          const compact = s.replace(/[-\s]+/g, '');
          if (compact.length >= 6) tokens.add(compact.toUpperCase());
          // Marca + modelo
          if (b) {
            (Array.from(tokens)).forEach((t) => tokens.add(`${b} ${t}`.toUpperCase()));
          }
          return Array.from(tokens);
        };
        
        const isLikelyToken = (value) => {
          const s = String(value || '').trim();
          if (!s) return false;
          if (/^https?:\/\//i.test(s)) return true;
          let t = s.replace(/^([A-Za-z]):[\\\/]/, '').replace(/\\/g, '/').split('/')
            .filter(Boolean).pop() || s;
          t = t.replace(/["']/g, '');
          if (!t) return false;
          if (/^no\s*tiene$/i.test(t) || /^sin\s*imagen$/i.test(t)) return false;
          return /^[\w\-. ]+(\.[a-z0-9]+)?$/i.test(t);
        };

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

        const toBasenameList = (value) => {
          if (Array.isArray(value)) return value.map(String).filter(isLikelyToken);
          const v = String(value ?? '').trim();
          try {
            if (/^\s*\[/.test(v)) {
              const arr = JSON.parse(v);
              if (Array.isArray(arr)) return arr.map(String).filter(isLikelyToken);
            }
          } catch (_) {}
          if (!v) return [];
          if (!/[|;,\n]/.test(v)) {
            return [v];
          }
          return v
            .split(/[|;]\s*|\r?\n|,\s*(?![^\[]*\])/)
            .filter(Boolean)
            .map((p) => String(p).trim())
            .filter(isLikelyToken);
        };

        const normalizeSrc = (src) => normalizeSrcWithFallback(src);

        // Tokens provenientes del backend (imagen)
        const backendTokens = Array.isArray(rawImagen)
          ? rawImagen
          : (typeof rawImagen === 'string' ? toBasenameList(rawImagen) : []);

        // Tokens derivados del nombre del producto/marca
        const derivedTokens = deriveTokensFromName(a?.nombre, brandName);

        const names = [...backendTokens, ...derivedTokens];

        let images = names
          .flatMap(expandCandidates)
          .map(normalizeSrc)
          .filter(Boolean);
        images = Array.from(new Set(images));

        if (process.env.NODE_ENV === 'development') {
          try {
            if (typeof window !== 'undefined') {
              const dbg = {
                id: a?.idProducto ?? a?.idArticulo ?? a?._id,
                name: a?.nombre,
                rawImagen,
                tokens: names,
                candidates: names.flatMap(expandCandidates),
                resolved: images
              };
              console.debug('[QuickCart][ImageResolver]', dbg);
            }
          } catch {}
        }

        if (!images || images.length === 0) {
          images = [assets.upload_area || "/assets/logo-sarcos.png"];
        }

        const classInfo = classifyHierarchy({
          name: a?.nombre,
          description: a?.descripcion,
          category: categoryName,
        });

        const OFFICIAL_GROUPS = {
          'tecnologia': 'Tecnologí­a',
          'lineaBlanca': 'Línea Blanca',
          'hogar': 'Hogar',
          'dormitorio': 'Dormitorio',
          'muebles': 'Muebles',
          'oficina': 'Oficina',
          'cuidadoPersonal': 'Cuidado Personal',
          'entretenimiento': 'Entretenimiento',
          'motos': 'Motos'
        };

        const classifiedGroup = classInfo?.category 
          ? OFFICIAL_GROUPS[classInfo.category] 
          : undefined;

        return {
          _id: a?.idProducto ?? a?._id,
          name: a?.nombre || 'Sin nombre',
          description: a?.descripcion || '',
          price: precioVenta,
          offerPrice: offerPrice,
          discount: descuento,
          image: images,
          category: categoryName,
          subCategory: a?.idSubCategoria2?.nombre ?? undefined,
          productType: a?.idTipoProducto2?.nombre ?? undefined,
          brand: brandName,
          brandId: a?.idMarca2?.idMarca ?? a?.idMarca2?.id ?? undefined,
          bestseller: a?.bestseller || false,
          stock: a?.stock ?? 0,
          stores: Array.isArray(a?.productoTiendas)
            ? (a.productoTiendas || []).map((pt) => ({
                id: pt?.idTienda2?.idTienda ?? pt?.idTienda,
                nombre: pt?.idTienda2?.nombre ?? undefined,
                direccion: pt?.idTienda2?.direccion ?? undefined,
              })).filter((s) => s?.id)
            : [],
          
          classifiedCategory: classInfo?.category,
          classifiedCategoryLabel: classInfo?.categoryLabel,
          classifiedSubcategory: classInfo?.subcategory,
          classifiedSubcategoryLabel: classInfo?.subcategoryLabel,
          classifiedTypes: classInfo?.types || [],
          classificationConfidence: classInfo?.confidence || 0,
          
          group: classifiedGroup,
          
          rawData: {
            idCategoria: a?.idCategoria ?? a?.idCategoria2?.idCategoria,
            idSubCategoria: a?.idSubCategoria ?? a?.idSubCategoria2?.idSubCategoria,
            idTipoProducto: a?.idTipoProducto ?? a?.idTipoProducto2?.idTipoProducto,
            idMarca: a?.idMarca ?? a?.idMarca2?.idMarca
          }
        };
    };

    const fetchProductData = async (options = {}) => {
        try {
            const data = await getProductosFiltered({}, { signal: options?.signal });
            const list = Array.isArray(data) ? data : (data?.productos || []);
            const mapped = (list || []).map(mapProductoToProduct);
            setProducts(mapped);
            
            if (!Array.isArray(data)) {
              setPagination(data?.paginacion || { total: mapped.length, page: 1, limit: 20 });
              setFilterMeta(data?.metadatos_filtros || { 
                precio_rango: undefined, 
                atributos_disponibles: undefined 
              });
            }
        } catch (err) {
            console.warn("Fallo al cargar productos del backend:", err?.message || err);
            setProducts([]);
            setPagination({ total: 0, page: 1, limit: 20 });
            setFilterMeta({ precio_rango: undefined, atributos_disponibles: undefined });
        }
    }

    /**
     * Carga productos con filtros aplicados
     * @param {Object} filters - Objeto con filtros: { page, limit, search, category, subcategory, type, minPrice, maxPrice, brand }
     */
    const fetchProductsByFilters = async (filters = {}, options = {}) => {
      try {
        const data = await getProductosFiltered(filters, { signal: options?.signal });
        const list = Array.isArray(data) ? data : (data?.productos || []);
        const mapped = (list || []).map(mapProductoToProduct);
        setProducts(mapped);
        try {
          if (process.env.NEXT_PUBLIC_DEBUG_FILTERS === '1') {
            console.log('[QuickCart][Filters] Results', { filters, count: mapped.length, pagination: data?.paginacion });
          }
        } catch {}

        // Fallback: si no hay resultados con filtros de categoría/subcategoría/tipo,
        // intenta una búsqueda textual (q) usando el nombre aportado o resuelto.
        if ((mapped.length === 0) && !filters?.q && !filters?.busqueda) {
          const toStr = (v) => (v || '').toString().trim();
          let fallbackText = toStr(filters?.tipo || filters?.subcategoria || filters?.categoria);

          // Si sólo tenemos IDs, intenta resolver el nombre desde categoriesMenu
          if (!fallbackText) {
            try {
              if (filters?.idTipoProducto) {
                const targetId = Number(filters.idTipoProducto);
                for (const cat of (categoriesMenu || [])) {
                  for (const col of (cat?.columns || [])) {
                    const found = (col?.types || []).find(tp => Number(tp?.id) === targetId);
                    if (found?.name) { fallbackText = found.name; break; }
                  }
                  if (fallbackText) break;
                }
              } else if (filters?.idSubCategoria) {
                const targetId = Number(filters.idSubCategoria);
                for (const cat of (categoriesMenu || [])) {
                  const foundCol = (cat?.columns || []).find(col => Number(col?.id) === targetId);
                  if (foundCol?.title) { fallbackText = foundCol.title; break; }
                }
              } else if (filters?.idCategoria) {
                const targetId = Number(filters.idCategoria);
                const foundCat = (categoriesMenu || []).find(cat => Number(cat?.id) === targetId);
                if (foundCat?.title) fallbackText = foundCat.title;
              }
            } catch {}
          }

          if (fallbackText) {
            const fallbackParams = {
              busqueda: fallbackText,
            };
            // Mantener filtros compatibles en el fallback
            if (typeof filters?.priceMin === 'number') fallbackParams['priceMin'] = filters.priceMin;
            if (typeof filters?.priceMax === 'number') fallbackParams['priceMax'] = filters.priceMax;
            // El backend espera 'marcas' (lista separada por comas); nuestro builder aceptará array
            if (filters?.idMarcaList) fallbackParams['marcas'] = filters.idMarcaList;
            if (filters?.limit) fallbackParams['limit'] = filters.limit;
            if (filters?.page) fallbackParams['page'] = filters.page;

            try {
              if (process.env.NEXT_PUBLIC_DEBUG_FILTERS === '1') {
                console.log('[QuickCart][Filters] Fallback q-search', fallbackParams);
              }
            } catch {}

            try {
              const data2 = await getProductosFiltered(fallbackParams, { signal: options?.signal });
              const list2 = Array.isArray(data2) ? data2 : (data2?.productos || []);
              const mapped2 = (list2 || []).map(mapProductoToProduct);
              setProducts(mapped2);

              if (Array.isArray(data2)) {
                setPagination({ total: mapped2.length, page: 1, limit: mapped2.length });
                setFilterMeta({ precio_rango: undefined, atributos_disponibles: undefined });
              } else {
                setPagination(data2?.paginacion || { total: mapped2.length, page: filters?.page || 1, limit: filters?.limit || 20 });
                setFilterMeta(data2?.metadatos_filtros || { precio_rango: undefined, atributos_disponibles: undefined });
              }
              // Termina aquí para no sobrescribir con el bloque posterior
              return;
            } catch (err2) {
              // Si el fallback falla, continúa con el manejo estándar más abajo
              try {
                console.warn('Fallback de búsqueda textual falló:', err2?.message || err2);
              } catch {}
            }
          }
        }
        
        if (Array.isArray(data)) {
          // Cuando el backend retorna sólo lista (sin metadatos), fijar paginación a una sola página
          setPagination({ total: mapped.length, page: 1, limit: mapped.length });
          setFilterMeta({ 
            precio_rango: undefined, 
            atributos_disponibles: undefined 
          });
        } else {
          setPagination(data?.paginacion || { 
            total: mapped.length, 
            page: filters?.page || 1, 
            limit: filters?.limit || 20 
          });
          setFilterMeta(data?.metadatos_filtros || { 
            precio_rango: undefined, 
            atributos_disponibles: undefined 
          });
        }
      } catch (err) {
        console.warn("Fallo al obtener productos filtrados:", err?.message || err);
        setProducts([]);
        setPagination({ total: 0, page: 1, limit: 20 });
        setFilterMeta({ precio_rango: undefined, atributos_disponibles: undefined });
      }
    }

    const fetchBrands = async (options = {}) => {
      try {
        const marcas = await getMarcas({ signal: options?.signal });
        setBrands(marcas || []);
      } catch (err) {
        console.warn("Fallo al cargar marcas:", err?.message || err);
        setBrands([]);
      }
    }

    const fetchStores = async (options = {}) => {
      try {
        const tiendas = await getTiendas({ signal: options?.signal });
        setStores(Array.isArray(tiendas) ? tiendas : []);
      } catch (err) {
        console.warn("Fallo al cargar tiendas:", err?.message || err);
        setStores([]);
      }
    }

    const fetchUserData = async () => {
        setUserData(null)
    }

    const fetchCategoriesMenu = async (options = {}) => {
      try {
        const categorias = await getCategorias({ signal: options?.signal });
        
        const menu = await Promise.all((categorias || []).map(async (cat) => {
          const catId = cat?.idCategoria ?? cat?.id ?? cat?._id;
          const catName = cat?.nombre || String(catId);
          
          const subcats = await getSubCategoriasByCategoria(catId, { signal: options?.signal });
          
          const columns = await Promise.all((subcats || []).map(async (sub) => {
            const subId = sub?.idSubCategoria ?? sub?.id ?? sub?._id;
            const subName = sub?.nombre || String(subId);
            
            // Obtiene tipos de productos de esta subcategorÃ­a
            const tipos = await getTiposProductoBySubCategoria(subId, { signal: options?.signal });
            
            return {
              title: subName,
              id: subId,
              slug: normalize(subName).replace(/\s+/g, '-'),
              items: (tipos || []).map((tp) => tp?.nombre || '').filter(Boolean),
              types: (tipos || [])
                .map((tp) => ({
                  id: tp?.idTipoProducto ?? tp?.id ?? tp?._id,
                  name: tp?.nombre,
                  slug: normalize(tp?.nombre || '').replace(/\s+/g, '-')
                }))
                .filter((o) => o?.id && o?.name),
            };
          }));
          
          return {
            title: catName,
            id: catId,
            slug: normalize(catName).replace(/\s+/g, '-'),
            brands: getBrandsForCategory(catName),
            items: [],
            columns,
          };
        }));
        
        setCategoriesMenu(menu);
      } catch (error) {
        console.warn('Fallo al cargar mapeo dinamico, usando fallback de FILTERS_MAP:', error?.message || error);

        const menuFromFilters = Object.entries(FILTERS_MAP.categories).map(([catKey, catData]) => {
          const columns = Object.entries(catData.subcategories).map(([subKey, subData]) => ({
            title: subData.label,
            id: subKey,
            slug: normalize(subData.label).replace(/\s+/g, '-'),
            items: subData.keywords,
            types: subData.keywords.map((keyword, index) => ({
              id: `${subKey}-${index}`,
              name: keyword,
              slug: normalize(keyword).replace(/\s+/g, '-')
            }))
          }));

          return {
            title: catData.label,
            id: catKey,
            slug: normalize(catData.label).replace(/\s+/g, '-'),
            brands: getBrandsForCategory(catData.label),
            items: [],
            columns,
          };
        });

        setCategoriesMenu(menuFromFilters);
      }
    };


    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
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
        const ac = new AbortController();
        fetchProductData({ signal: ac.signal })
        fetchCategoriesMenu({ signal: ac.signal })
        fetchBrands({ signal: ac.signal })
        fetchStores({ signal: ac.signal })
        return () => {
          ac.abort();
        }
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    const value = {
        currency, 
        router,
        isSeller, 
        setIsSeller,
        userData, 
        fetchUserData,
        products, 
        fetchProductData,
        fetchProductsByFilters,
        categoriesMenu,
        brands,
        stores,
        pagination,
        filterMeta,
        cartItems, 
        setCartItems,
        addToCart, 
        updateCartQuantity,
        getCartCount, 
        getCartAmount,
        normalize,
        mapProductoToProduct
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}