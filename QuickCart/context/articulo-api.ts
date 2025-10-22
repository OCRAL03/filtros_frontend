export async function getArticulos() {
  try {
    const res = await fetch("http://localhost:4000/api/articulo", {
      method: "GET",
      // Evita caching agresivo en dev
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener artículos");
    }
    const data = await res.json();
    console.log("Artículos obtenidos con éxito", data?.length ?? 0);
    return data;
  } catch (error) {
    console.error("Error en getArticulos:", error);
    throw error;
  }
}
