import { supabase } from "./supabaseClient.js";

// =========================
// DOM
// =========================
const form = document.getElementById("curso-form");
const inputId = document.getElementById("id");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCreditos = document.getElementById("creditos");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const statusDiv = document.getElementById("status");
const listaCursos = document.getElementById("lista");
const tituloForm = document.getElementById("form-title");

let editando = false;

// =========================
// Función de estado
// =========================
function mostrarStatus(mensaje, tipo = "success") {
  statusDiv.textContent = mensaje;
  statusDiv.className = `alert alert-${tipo} mt-2`;
  setTimeout(() => {
    statusDiv.textContent = "";
    statusDiv.className = "";
  }, 3000);
}

// =========================
// Eventos
// =========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const codigo = inputCodigo.value.trim();
  const nombre = inputNombre.value.trim();
  const creditos = parseInt(inputCreditos.value.trim());
//editar
  if (editando) {
    const id = inputId.value; /* obtener el id del curso a editar */
    await actualizarCurso(id, codigo, nombre, creditos);/*actualñizar curso*/
    editando = false;
    tituloForm.textContent = "Registrar curso";   // vuelve al título original
    btnSave.textContent = "Guardar Curso";
    btnCancel.style.display = "none";
//insertar 
} else {
    await crearCurso(codigo, nombre, creditos);
  }
  form.reset();  // limpiar formulario
});

btnCancel.addEventListener("click", () => {
  form.reset();
  editando = false;
  tituloForm.textContent = "Registrar curso";   // aquí restauras el título
  btnSave.textContent = "Guardar Curso";
  btnCancel.style.display = "none";
});

// Editar / Eliminar curso
listaCursos.addEventListener("click", async (e) => {
  if (e.target.closest(".btn-delete")) {
    const id = e.target.closest("button").getAttribute("data-id");
    await eliminarCurso(id);
  }
  if (e.target.closest(".btn-edit")) {
    const id = e.target.closest("button").getAttribute("data-id");
    const curso = await obtenerCurso(id);

    if (curso) {
      inputId.value = curso.id;
      inputCodigo.value = curso.codigo;
      inputNombre.value = curso.nombre;
      inputCreditos.value = curso.creditos;
      editando = true;
      tituloForm.textContent = "Editar curso";   // cambia el título al editar
      btnSave.textContent = "Actualizar Curso";
      btnCancel.style.display = "inline-block";
    }
  }
});

// ================================
// CRUD (create-read-update-delete)
// ================================
async function cargarCursos() {
  let { data: cursos, error } = await supabase.from("Cursos").select("*");

  if (error) {
    console.error("Error al cargar cursos:", error);
    mostrarStatus("Error al cargar cursos", "danger");
    return;
  }

  listaCursos.innerHTML = "";
  cursos.forEach((curso) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `
      ${curso.codigo} - ${curso.nombre} [${curso.creditos} créditos]
      <button class="btn btn-danger btn-sm btn-delete float-end mx-1" data-id="${curso.id}">
        <i class="fa-solid fa-trash-can"></i>
      </button>
      <button class="btn btn-primary btn-sm btn-edit float-end" data-id="${curso.id}">
        <i class="fa-solid fa-pencil"></i>
      </button>
    `;
    listaCursos.appendChild(li);
  });
}

async function crearCurso(codigo, nombre, creditos) {
  const curso = { codigo, nombre, creditos };
  let { error } = await supabase.from("Cursos").insert([curso]);
  if (error) {
    console.error(error);
    mostrarStatus("Error al crear curso", "danger");
    return;
  }
  mostrarStatus("Curso creado correctamente");
  cargarCursos();
}

async function eliminarCurso(id) {
  let { error } = await supabase.from("Cursos").delete().eq("id", id);
  if (error) {
    console.error(error);
    mostrarStatus("Error al eliminar curso", "danger");
    return;
  }
  mostrarStatus("Curso eliminado correctamente");
  cargarCursos();
}

async function actualizarCurso(id, codigo, nombre, creditos) {
  const curso = { codigo, nombre, creditos };
  let { error } = await supabase.from("Cursos").update(curso).eq("id", id);
  if (error) {
    console.error(error);
    mostrarStatus("Error al actualizar curso", "danger");
    return;
  }
  mostrarStatus("Curso actualizado correctamente");
  cargarCursos();
}

async function obtenerCurso(id) {
  let { data: curso, error } = await supabase
    .from("Cursos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    mostrarStatus("Error al obtener curso", "danger");
    return null;
  }
  return curso;
}

// Inicializar
cargarCursos();