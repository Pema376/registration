const tableBody = document.querySelector("#studentTable tbody");

async function fetchStudents() {
  try {
    const res = await fetch("/api/admin/students");
    const students = await res.json();

    tableBody.innerHTML = ""; // Clear table first

    students.forEach((student) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.student_id}</td>
        <td>${student.full_name}</td>
        <td>${student.email}</td>
        <td>${student.program}</td>
        <td>${student.year}</td>
        <td>
          <div style="display:flex; flex-direction:column; gap:5px;">
            <div style="display:flex; align-items:center; gap:5px;">
              <select style="padding:5px; border-radius:5px;">
                <option value="">Field</option>
                <option value="full_name">Full Name</option>
                <option value="email">Email</option>
                <option value="program">Program</option>
                <option value="year">Year</option>
              </select>
              <input type="text" placeholder="New value" style="padding:5px; border-radius:5px;" />
            </div>
            <div style="display:flex; gap:5px;">
              <button onclick="updateStudent(this, '${student.student_id}')" title="Update" style="background-color:#00b894; color:white; border:none; padding:5px 10px; border-radius:4px;">Update</button>
              <button onclick="deleteStudent('${student.student_id}')" title="Delete" style="background-color:#d63031; color:white; border:none; padding:5px 10px; border-radius:4px;">Delete</button>
            </div>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to fetch students:", err);
  }
}

async function updateStudent(button, studentId) {
  const row = button.closest("td");
  const field = row.querySelector("select").value;
  const value = row.querySelector("input").value;

  if (!field || !value) {
    alert("Please select a field and provide a new value.");
    return;
  }

  try {
    const res = await fetch(`/api/admin/students/${studentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });

    const data = await res.json();
    alert(data.message);
    fetchStudents(); // Refresh table
  } catch (err) {
    console.error("Update failed:", err);
    alert("Update failed");
  }
}

async function deleteStudent(studentId) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  try {
    const res = await fetch(`/api/admin/students/${studentId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);
    fetchStudents(); // Refresh the table
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Delete failed");
  }
}

function logout() {
  window.location.href = "../../index.html";
}

// Load student data on page load
fetchStudents();
