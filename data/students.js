const STUDENTS = [
    "Zuny Acosta", "Sara Aguirre", "Sebastian Arias", "Salome Arrieta",
    "Sofia Ayala", "Andres Benitez", "Valentina Betancur", "Steve Borja",
    "Sharon Ceballos", "Miguel Ciro", "Marlys Contreras", "Emily Gamez",
    "Mariana Garay", "Adria Gutierrez", "Valentina Hernandez", "Santiago Herrera",
    "Marinella Lobo", "Salome Lopez", "Mateo Marquez", "Emiliano Morillo",
    "Zaira Palacio", "Elias Palacios", "Lorena Perez", "Maria Piñeres",
    "Elias Ramos", "Lezly Restrepo", "Samuel Ricard", "Emily Rincon",
    "Jimena Rios", "Nathalia Romero", "Shara Silva", "Evelin Solera",
    "Jawin Suarez", "David Vanegas", "Nikol Vargas", "Stiven Vasquez",
    "Dario Zapa"
];

function populateStudentsDropdown() {
    const select = document.getElementById('player-name-input');
    if (!select) return;

    // Limpiar todas las opciones existentes excepto la primera ("Select your name...")
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Agregar estudiantes de la lista plana
    STUDENTS.forEach(studentName => {
        const option = document.createElement('option');
        option.value = studentName;
        option.textContent = studentName;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', populateStudentsDropdown);
