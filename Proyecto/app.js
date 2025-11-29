import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formulario");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCreditos = document.getElementById("creditos");
const tablaCursos = document.getElementById("tabla-cursos");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = inputCodigo.value.trim();
  const nombre = inputNombre.value.trim();
  const creditos = parseInt(inputCreditos.value.trim());

  if (!codigo || !nombre || !creditos) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const { error } = await supabase.from("curso").insert([{ codigo, nombre, creditos }]);
  if (error) {
    console.error("Error al insertar curso:", error);
    alert("Error al registrar el curso.");
    return;
  }

  form.reset();
  cargarCursos();
});

tablaCursos.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.getAttribute("data-id");
    const { error } = await supabase.from("curso").delete().eq("codigo", id);
    if (error) {
      console.error("Error al eliminar curso:", error);
      alert("Error al eliminar el curso.");
      return;
    }
    cargarCursos();
  }
});

async function cargarCursos() {
  const { data: cursos, error } = await supabase.from("curso").select("*");
  if (error) {
    console.error("Error al cargar cursos:", error);
    return;
  }

  tablaCursos.innerHTML = "";

  cursos.forEach((curso) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${curso.codigo}</td>
      <td>${curso.nombre}</td>
      <td>${curso.creditos}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${curso.codigo}">
          Eliminar
        </button>
      </td>
    `;
    tablaCursos.appendChild(fila);
  });
}

cargarCursos();