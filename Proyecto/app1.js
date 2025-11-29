import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formulario");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const inputCarrera = document.getElementById("carrera");
const tablaEstudiantes = document.getElementById("tabla-estudiantes");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = parseInt(inputCodigo.value.trim());
  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();
  const carrera = inputCarrera.value;

  if (!codigo || isNaN(codigo) || !nombre || !email || !carrera) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  const { error } = await supabase
    .from("estudiante") // 👈 nombre confirmado
    .insert([{ codigo, nombre, email, carrera }]);

  if (error) {
    console.error("Error al insertar estudiante:", error.message);
    alert("Error al registrar el estudiante.");
    return;
  }

  form.reset();
  cargarEstudiantes();
});

tablaEstudiantes.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    const { error } = await supabase
      .from("estudiante")
      .delete()
      .eq("codigo", id);

    if (error) {
      console.error("Error al eliminar estudiante:", error.message);
      alert("Error al eliminar el estudiante.");
      return;
    }
    cargarEstudiantes();
  }
});

async function cargarEstudiantes() {
  const { data: estudiantes, error } = await supabase
    .from("estudiante")
    .select("*");

  if (error) {
    console.error("Error al cargar estudiantes:", error.message);
    alert("Error al cargar estudiantes.");
    return;
  }

  tablaEstudiantes.innerHTML = "";

  estudiantes.forEach((est) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${est.codigo}</td>
      <td>${est.nombre}</td>
      <td>${est.email}</td>
      <td>${est.carrera}</td>
      <td>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${est.codigo}">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </td>
    `;
    tablaEstudiantes.appendChild(fila);
  });
}

cargarEstudiantes();