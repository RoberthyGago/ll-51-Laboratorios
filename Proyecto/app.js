import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formulario");
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputCreditos = document.getElementById("creditos");
const tablaCursos = document.getElementById("tabla-cursos");

// 👇 nuevos elementos
const tituloForm = document.getElementById("form-title");
const btnCancel = document.getElementById("btn-cancel");
const btnSave = document.querySelector("#formulario button[type='submit']");

// Estado de edición
let editando = false;
let codigoEditando = null;

// Registrar o actualizar
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = inputCodigo.value.trim();
  const nombre = inputNombre.value.trim();
  const creditos = parseInt(inputCreditos.value.trim());

  if (!codigo || !nombre || !creditos) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (editando && codigoEditando) {
    const { error } = await supabase
      .from("curso")
      .update({ codigo, nombre, creditos })
      .eq("codigo", codigoEditando);

    if (error) {
      console.error("Error al actualizar curso:", error);
      alert("Error al actualizar el curso.");
      return;
    }

    alert("Curso actualizado correctamente.");
    resetFormulario();
  } else {
    const { error } = await supabase
      .from("curso")
      .insert([{ codigo, nombre, creditos }]);

    if (error) {
      console.error("Error al insertar curso:", error);
      alert("Error al registrar el curso.");
      return;
    }
    alert("Curso registrado correctamente.");
  }

  form.reset();
  cargarCursos();
});

// Cancelar edición
btnCancel.addEventListener("click", () => {
  resetFormulario();
});

// Acciones en la tabla (editar / eliminar)
tablaCursos.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const codigo = btn.getAttribute("data-id");

  // Eliminar
  if (btn.classList.contains("btn-delete")) {
    const { error } = await supabase.from("curso").delete().eq("codigo", codigo);
    if (error) {
      console.error("Error al eliminar curso:", error);
      alert("Error al eliminar el curso.");
      return;
    }
    alert("Curso eliminado correctamente.");
    cargarCursos();
  }

  // Editar
  if (btn.classList.contains("btn-edit")) {
    const { data: curso, error } = await supabase
      .from("curso")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) {
      console.error("Error al obtener curso:", error);
      alert("Error al cargar el curso.");
      return;
    }

    inputCodigo.value = curso.codigo;
    inputNombre.value = curso.nombre;
    inputCreditos.value = curso.creditos;

    editando = true;
    codigoEditando = curso.codigo;

    // 👇 Cambiar título y botones
    tituloForm.textContent = "Editar curso";
    btnSave.textContent = "Actualizar Curso";
    btnCancel.style.display = "inline-block";
  }
});

// Función para resetear formulario y estado
function resetFormulario() {
  form.reset();
  editando = false;
  codigoEditando = null;
  tituloForm.textContent = "Registrar Nuevo Curso";
  btnSave.textContent = "Registrar Curso";
  btnCancel.style.display = "none";
}

// Cargar cursos
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
        <button class="btn btn-primary btn-sm btn-edit" data-id="${curso.codigo}">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${curso.codigo}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tablaCursos.appendChild(fila);
  });
}

cargarCursos();