export async function getArticulos() {
  try {
    const res = await fetch("http://localhost:4000/api/articulo", {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error al obtener artículos");
    }
    console.log("✅ Artículos obtenidos con éxito", res);

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error en getArticulos:", error);
    throw error;
  }
}
