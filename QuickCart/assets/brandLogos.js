const normalizeKey = (s) => (s || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export const BRAND_LOGOS_BY_CATEGORY = {
  [normalizeKey("Tecnología")]: [
    { name: "Apple", logo: "/assets/logos/apple.svg" },
    { name: "Samsung", logo: "/assets/logos/samsung.svg" },
    { name: "Sony", logo: "/assets/logos/sony.svg" },
    { name: "Canon", logo: "/assets/logos/canon.svg" },
    { name: "Epson", logo: "/assets/logos/epson.svg" },
    { name: "Lenovo", logo: "/assets/logos/lenovo.svg" },
    { name: "Xiaomi", logo: "/assets/logos/xiaomi.svg" },
    { name: "Motorola", logo: "/assets/logos/motorola.svg" },
    { name: "LG", logo: "/assets/logos/lg.svg" },
    { name: "Philips", logo: "/assets/logos/philips.svg" },
    { name: "HP", logo: "/assets/logos/hp.svg" },
    { name: "Huawei", logo: "/assets/logos/huawei.svg" },
    { name: "JBL", logo: "/assets/logos/jbl.svg" },
    { name: "PlayStation", logo: "/assets/logos/playstation.svg" },
    { name: "Kingston", logo: "/assets/logos/kingston.svg" },
    { name: "SanDisk", logo: "/assets/logos/sandisk.svg" },
    { name: "Logitech", logo: "/assets/logos/logitech.svg" },
    { name: "TP-Link", logo: "/assets/logos/tplink.svg" },
    { name: "Toshiba", logo: "/assets/logos/toshiba.svg" },
    { name: "Panasonic", logo: "/assets/logos/panasonic.svg" },
    { name: "Realme", logo: "/assets/logos/realme.svg" },
    { name: "Redmi", logo: "/assets/logos/redmi.svg" },
    { name: "POCO", logo: "/assets/logos/poco.svg" },
    { name: "ZTE", logo: "/assets/logos/zte.svg" },
    { name: "Honor", logo: "/assets/logos/honor.svg" },
    { name: "Hisense", logo: "/assets/logos/hisense.svg" },
    { name: "Alcatel", logo: "/assets/logos/alcatel.svg" },
    { name: "Casio", logo: "/assets/logos/casio.svg" },
  ],
  [normalizeKey("Línea Blanca")]: [
    { name: "Whirlpool", logo: "/assets/logos/whirlpool.svg" },
    { name: "Mabe", logo: "/assets/logos/mabe.svg" },
    { name: "Oster", logo: "/assets/logos/oster.svg" },
    { name: "Electrolux", logo: "/assets/logos/electrolux.svg" },
    { name: "Indurama", logo: "/assets/logos/indurama.svg" },
    { name: "Imaco", logo: "/assets/logos/imaco.svg" },
    { name: "Midea", logo: "/assets/logos/midea.svg" },
    { name: "LG", logo: "/assets/logos/lg.svg" },
    { name: "Samsung", logo: "/assets/logos/samsung.svg" },
    { name: "Panasonic", logo: "/assets/logos/panasonic.svg" },
    { name: "White Westinghouse", logo: "/assets/logos/whitewestinghouse.svg" },
  ],
  [normalizeKey("Hogar")]: [
    { name: "Oster", logo: "/assets/logos/oster.svg" },
    { name: "Mabe", logo: "/assets/logos/mabe.svg" },
    { name: "Whirlpool", logo: "/assets/logos/whirlpool.svg" },
    { name: "Electrolux", logo: "/assets/logos/electrolux.svg" },
    { name: "Indurama", logo: "/assets/logos/indurama.svg" },
    { name: "Imaco", logo: "/assets/logos/imaco.svg" },
    { name: "Midea", logo: "/assets/logos/midea.svg" },
    { name: "LG", logo: "/assets/logos/lg.svg" },
  ],
  [normalizeKey("Oficina")]: [
    { name: "Epson", logo: "/assets/logos/epson.svg" },
    { name: "HP", logo: "/assets/logos/hp.svg" },
    { name: "Canon", logo: "/assets/logos/canon.svg" },
    { name: "Kingston", logo: "/assets/logos/kingston.svg" },
    { name: "SanDisk", logo: "/assets/logos/sandisk.svg" },
    { name: "Logitech", logo: "/assets/logos/logitech.svg" },
    { name: "Lenovo", logo: "/assets/logos/lenovo.svg" },
    { name: "TP-Link", logo: "/assets/logos/tplink.svg" },
  ],
  [normalizeKey("Entretenimiento")]: [
    { name: "PlayStation", logo: "/assets/logos/playstation.svg" },
    { name: "Sony", logo: "/assets/logos/sony.svg" },
    { name: "JBL", logo: "/assets/logos/jbl.svg" },
    { name: "Pioneer", logo: "/assets/logos/pioneer.svg" },
    { name: "Philips", logo: "/assets/logos/philips.svg" },
    { name: "LG", logo: "/assets/logos/lg.svg" },
    { name: "Samsung", logo: "/assets/logos/samsung.svg" },
  ],
  [normalizeKey("Motos")]: [
    { name: "Yamaha", logo: "/assets/logos/yamaha.svg" },
    { name: "Bajaj", logo: "/assets/logos/bajaj.svg" },
    { name: "KTM", logo: "/assets/logos/ktm.svg" },
    { name: "Jialing", logo: "/assets/logos/jialing.svg" },
    { name: "LS2", logo: "/assets/logos/ls2.svg" },
    { name: "LS2", logo: "/assets/logos/sarcos.svg" }

  ],
  [normalizeKey("Instrumentos musicales")]: [
    { name: "Fender", logo: "/assets/logos/fender.svg" },
    { name: "Gibson", logo: "/assets/logos/gibson.svg" },
    { name: "Yamaha", logo: "/assets/logos/yamaha.svg" },
    { name: "Roland", logo: "/assets/logos/roland.svg" },
    { name: "Ibanez", logo: "/assets/logos/ibanez.svg" },
  ],
  [normalizeKey("Dormitorio")]: [
    { name: "Paraíso", logo: "/assets/logos/paraiso.svg" },
    { name: "Record", logo: "/assets/logos/record.svg" },
    { name: "QuiltedFlex", logo: "/assets/logos/quiltedflex.svg" },
    { name: "Vigmar", logo: "/assets/logos/vigmar.svg" },
  ],
  [normalizeKey("Muebles")]: [
    { name: "Paraíso", logo: "/assets/logos/paraiso.svg" },
    { name: "Record", logo: "/assets/logos/record.svg" },
    { name: "QuiltedFlex", logo: "/assets/logos/quiltedflex.svg" },
    { name: "LS2", logo: "/assets/logos/sarcos.svg" }
  ],
  [normalizeKey("Cuidado Personal")]: [
    { name: "Wahl", logo: "/assets/logos/wahl.svg" },
    { name: "Philips", logo: "/assets/logos/philips.svg" },
    { name: "Oster", logo: "/assets/logos/oster.svg" },
    { name: "Imaco", logo: "/assets/logos/imaco.svg" },
  ],
};

export const getBrandsForCategory = (title) => {
  const key = normalizeKey(title);
  const list = BRAND_LOGOS_BY_CATEGORY[key] || [];
  return list.slice(0, 12);
};