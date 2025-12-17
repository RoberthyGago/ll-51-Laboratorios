import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formulario");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCarrera = document.getElementById("carrera");
const tablaProfesores = document.getElementById("tabla-profesores");

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
  const carrera = inputCarrera.value;

  if (isNaN(codigo) || !nombre || !carrera) {
    alert("Por favor, completa todos los campos correctamente.");
    return;
  }

  // ACTUALIZAR
  if (editando && codigoEditando !== null) {
    const { error } = await supabase
      .from("profesores")
      .update({
        codigo,
        nombre,
        carrera
      })
      .eq("codigo", codigoEditando);

    if (error) {
      console.error("Error al actualizar profesor:", error.message);
      alert("Error al actualizar el profesor.");
      return;
    }

    alert("Profesor actualizado correctamente.");
    resetFormulario();
  } 
  // INSERTAR
  else {
    const { error } = await supabase
      .from("profesores")
      .insert([{ codigo, nombre, carrera }]);

    if (error) {
      console.error("Error al insertar profesor:", error.message);
      alert("Error al registrar el profesor.");
      return;
    }

    alert("Profesor registrado correctamente.");
  }

  form.reset();
  cargarProfesores();
});

// CANCELAR EDICIÓN
btnCancel.addEventListener("click", () => {
  resetFormulario();
});

// ACCIONES TABLA EDITAR / ELIMINAR
tablaProfesores.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const codigo = btn.getAttribute("data-id");

  // ELIMINAR
  if (btn.classList.contains("btn-delete")) {
    const { error } = await supabase
      .from("profesores")
      .delete()
      .eq("codigo", codigo);

    if (error) {
      console.error("Error al eliminar profesor:", error);
      alert("Error al eliminar el profesor.");
      return;
    }

    alert("Profesor eliminado correctamente.");
    cargarProfesores();
  }

  // EDITAR
  if (btn.classList.contains("btn-edit")) {
    const { data: prof, error } = await supabase
      .from("profesores")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) {
      console.error("Error al obtener profesor:", error.message);
      alert("Error al cargar profesor.");
      return;
    }

    inputCodigo.value = prof.codigo;
    inputNombre.value = prof.nombre;
    inputCarrera.value = prof.carrera;

    editando = true;
    codigoEditando = prof.codigo;

    tituloForm.textContent = "Editar Profesor";
    btnSave.textContent = "Actualizar Profesor";
    btnCancel.style.display = "inline-block";
  }
});

// RESET FORMULARIO
function resetFormulario() {
  form.reset();
  editando = false;
  codigoEditando = null;
  tituloForm.textContent = "Registrar Nuevo Profesor";
  btnSave.textContent = "Registrar Profesor";
  btnCancel.style.display = "none";
}

// CARGAR PROFESORES
async function cargarProfesores() {
  const { data: profesores, error } = await supabase
    .from("profesores")
    .select("*")
    .order("codigo");

  if (error) {
    console.error("Error al cargar profesores:", error.message);
    return;
  }

  tablaProfesores.innerHTML = "";

  profesores.forEach((prof) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${prof.codigo}</td>
      <td>${prof.nombre}</td>
      <td>${prof.carrera}</td>
      <td>
        <button class="btn btn-primary btn-sm btn-edit" data-id="${prof.codigo}">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${prof.codigo}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tablaProfesores.appendChild(fila);
  });
}

cargarProfesores();
