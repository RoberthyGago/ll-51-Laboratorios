import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formulario");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCarrera = document.getElementById("carrera");
const tablaProfesores = document.getElementById("tabla-profesores");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = parseInt(inputCodigo.value.trim()); // 👈 lo guardamos como número
  const nombre = inputNombre.value.trim();
  const carrera = inputCarrera.value;

  if (!codigo || isNaN(codigo) || !nombre || !carrera) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  const { error } = await supabase
    .from("profesores") // 👈 nombre exacto de la tabla
    .insert([{ codigo, nombre, carrera }]);

  if (error) {
    console.error("Error al insertar profesor:", error.message);
    alert("Error al registrar el profesor.");
    return;
  }

  form.reset();
  cargarProfesores();
});

tablaProfesores.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = parseInt(e.target.getAttribute("data-id")); // 👈 usamos el id del botón
    const { error } = await supabase
      .from("profesores")
      .delete()
      .eq("codigo", id);

    if (error) {
      console.error("Error al eliminar profesor:", error.message);
      alert("Error al eliminar el profesor.");
      return;
    }
    cargarProfesores();
  }
});

async function cargarProfesores() {
  const { data: profesores, error } = await supabase
    .from("profesores")
    .select("*");

  if (error) {
    console.error("Error al cargar profesores:", error.message);
    alert("Error al cargar profesores.");
    return;
  }

  tablaProfesores.innerHTML = "";

  profesores.forEach((profesor) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${profesor.codigo}</td>
      <td>${profesor.nombre}</td>
      <td>${profesor.carrera}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${profesor.codigo}">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </td>
    `;
    tablaProfesores.appendChild(fila);
  });
}

cargarProfesores();