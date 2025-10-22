export async function getCategorias() {
  try {
    const res = await fetch("http://localhost:4000/api/categoria", {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error al obtener categorías");
    }
    const data = await res.json();
    console.log("Categorías obtenidas con éxito", data?.length ?? 0);
    return data;
  } catch (error) {
    console.error("Error en getCategorias:", error);
    throw error;
  }
}