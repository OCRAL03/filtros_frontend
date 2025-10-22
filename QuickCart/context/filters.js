// Mapa de categorías, subcategorías y tipos basado en organizacion.md
export const FILTERS_MAP = {
  categories: {
    'Electronica y Tecnologia': {
      subcategories: {
        'Celulares y accesorios': ['smartphone','celular','fundas','cargador','power bank','batería','adaptador','audifono'],
        'Computacion': ['laptop','notebook','pc','computadora','monitor','teclado','impresora','multifuncional','all-in-one'],
        'Audio': ['audifono','auricular','parlante','buffer','barra de sonido','autoradio','radio','soundbar','woofer'],
        'Video y TV': ['televisor','tv','proyector','decodificador','señal de tv','amplificador de tv'],
        'Camaras': ['camara','cámara','seguridad','deportiva','vigilancia','fotografia'],
        'Consolas y videojuegos': ['playstation','xbox','nintendo','consola','joystick','control','videojuegos','gaming'],
        'Smart Home': ['asistente','enchufe inteligente','smart','wifi','wi-fi','hogar inteligente']
      }
    },
    'Linea Blanca y Electrodomesticos': {
      subcategories: {
        'Cocina': ['cocina','horno','microondas'],
        'Refrigeracion': ['refrigeradora','congeladora','congelador','freezer'],
        'Lavado': ['lavadora','secadora'],
        'Climatizacion': ['aire acondicionado','calefactor','ventilador'],
        'Pequeños electrodomesticos': ['licuadora','batidora','plancha','aspiradora']
      }
    },
    'Muebles y Decoracion': {
      subcategories: {
        'Sala': ['sofa','seccional','mesa de centro','mueble de tv'],
        'Comedor': ['mesa','silla','vitrina','juego de comedor'],
        'Dormitorio': ['cama','colchon','tarima','cabecera','velador','ropero','comoda'],
        'Oficina': ['escritorio','silla','estanteria'],
        'Decoracion': ['cuadro','reloj','alfombra'],
        'Iluminacion': ['lampara','foco','led','aplique']
      }
    },
    'Hogar y Organizacion': {
      subcategories: {
        'Limpieza': ['aspiradora'],
        'Cocina': ['utensilios','olla','sarten'],
        'Baño': ['organizador'],
        'Lavanderia': ['plancha'],
        'Seguridad': ['camara','alarma'],
        'Jardin': ['gras','herramienta']
      }
    },
    'Belleza y Cuidado Personal': {
      subcategories: {
        'Cuidado personal': ['afeitadora','barberia','plancha de cabello']
      }
    },
    'Juguetes y Entretenimiento': {
      subcategories: {
        'Juguetes educativos': ['juguete'],
        'Juegos de mesa': ['cartas','tablero'],
        'Control remoto y robotica': ['drone','drón'],
        'Arte y manualidades': ['marco','arte','manualidad']
      }
    },
    'Motos y Movilidad Electrica': {
      subcategories: {
        'Motocicletas lineales': ['125cc','150cc','250cc','deportiva','automatica'],
        'Trimoviles y cargueros': ['carguero','trimovil','pasajeros','eléctrico'],
        'Motos electricas y scooters': ['scooter','moto eléctrica','bicimoto'],
        'Accesorios para motocicletas': ['casco','guante','baul','luz led'],
        'Equipamiento del conductor': ['rodillera','impermeable'],
        'Herramientas y taller': ['cargador de bateria','bateria']
      }
    }
  }
};

export const normalizeText = (s) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

export function classifyHierarchy(product) {
  const name = normalizeText(product?.name);
  const desc = normalizeText(product?.description);
  const cat = normalizeText(product?.category || product?.categoryName);
  const texts = [name, desc, cat].filter(Boolean);

  let catKey = null;
  let subKey = null;
  const types = new Set();

  for (const [category, catObj] of Object.entries(FILTERS_MAP.categories)) {
    let categoryHit = false;
    for (const [subName, keywords] of Object.entries(catObj.subcategories)) {
      let subHit = false;
      for (const kw of keywords) {
        const k = normalizeText(kw);
        if (texts.some(t => t.includes(k))) {
          types.add(kw);
          subHit = true;
          categoryHit = true;
        }
      }
      if (subHit && !subKey) subKey = subName;
    }
    if (categoryHit && !catKey) catKey = category;
  }

  return { category: catKey, subcategory: subKey, types: Array.from(types) };
}