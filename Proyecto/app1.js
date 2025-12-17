import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formulario");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const inputCarrera = document.getElementById("carrera");
const tablaEstudiantes = document.getElementById("tabla-estudiantes");

// UI
const tituloForm = document.getElementById("form-title");
const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.querySelector("#formulario button[type='submit']");

// estado
let editando = false;
let codigoEditando = null;

// REGISTRAR / ACTUALIZAR
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = parseInt(inputCodigo.value.trim());
  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();
  const carrera = inputCarrera.value;

  if (isNaN(codigo) || !nombre || !email || !carrera) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  // ACTUALIZAR
  if (editando && codigoEditando !== null) {
    const { error } = await supabase
      .from("estudiante")
      .update({ nombre, email, carrera })
      .eq("codigo", codigoEditando);

    if (error) {
      console.error("Error al actualizar estudiante:", error.message);
      alert("Error al actualizar el estudiante.");
      return;
    }

    alert("Estudiante actualizado correctamente.");
    resetFormulario();
  } 
  // INSERTAR
  else {
    const { error } = await supabase
      .from("estudiante")
      .insert([{ codigo, nombre, email, carrera }]);

    if (error) {
      console.error("Error al insertar estudiante:", error.message);
      alert("Error al registrar el estudiante.");
      return;
    }

    alert("Estudiante registrado correctamente.");
  }

  form.reset();
  cargarEstudiantes();
});

// CANCELAR EDICIÓN
btnCancel.addEventListener("click", () => {
  resetFormulario();
});

// ACCIONES DE LA TABLA EDITAR / ELIMINAR
tablaEstudiantes.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const codigo = btn.getAttribute("data-id");

  // ELIMINAR
  if (btn.classList.contains("btn-delete")) {
    const {error} = await supabase.from("estudiante").delete().eq("codigo", codigo);          
    if (error) {
      console.error("Error al eliminar estudiante:", error);
      alert("Error al eliminar el estudiante.");
      return;
    }

    alert("Estudiante eliminado correctamente.");

    cargarEstudiantes();
  }

  // EDITAR
  if (btn.classList.contains("btn-edit")) {
    const { data: est, error } = await supabase
      .from("estudiante")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) {
      console.error("Error al obtener estudiante:", error.message);
      alert("Error al cargar estudiante.");
      return;
    }

    inputCodigo.value = est.codigo;
    inputNombre.value = est.nombre;
    inputEmail.value = est.email;
    inputCarrera.value = est.carrera;

    editando = true;
    codigoEditando = est.codigo;

    inputCodigo.disabled = true;
    tituloForm.textContent = "Editar Estudiante";
    btnSave.textContent = "Actualizar Estudiante";
    btnCancel.style.display = "inline-block";
  }
});

// RESET FORMULARIO
function resetFormulario() {
  form.reset();
  editando = false;
  codigoEditando = null;
  inputCodigo.disabled = false;
  tituloForm.textContent = "Registrar Nuevo Estudiante";
  btnSave.textContent = "Registrar Estudiante";
  btnCancel.style.display = "none";
}

// CARGAR ESTUDIANTES
async function cargarEstudiantes() {
  const { data: estudiantes, error } = await supabase
    .from("estudiante")
    .select("*")
    .order("codigo");

  if (error) {
    console.error("Error al cargar estudiantes:", error.message);
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
        <button class="btn btn-primary btn-sm btn-edit" data-id="${est.codigo}">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${est.codigo}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tablaEstudiantes.appendChild(fila);
  });
}

cargarEstudiantes();
