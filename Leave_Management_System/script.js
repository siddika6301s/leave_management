const STORAGE_KEY = "leaveEaseRequests";
const $ = (id) => document.getElementById(id);
const form = $("leaveForm");
const fromInput = $("from-date");
const toInput = $("to-date");
let leaves = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves));
  render();
}
function daysBetween(from, to) {
  if (!from || !to) return 0;
  const start = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  const diff = Math.round((end - start) / 86400000);
  return diff >= 0 ? diff + 1 : 0;
}
function updateDuration() {
  $("duration").textContent = daysBetween(fromInput.value, toInput.value);
}
fromInput.addEventListener("change", () => {
  toInput.min = fromInput.value;
  updateDuration();
});
toInput.addEventListener("change", updateDuration);

function resetForm() {
  form.reset();
  $("edit-id").value = "";
  $("form-title").textContent = "Apply for Leave";
  $("submit-btn").textContent = "＋ Apply Leave";
  $("cancel-edit").hidden = true;
  $("duration").textContent = "0";
  $("form-message").textContent = "";
  toInput.min = "";
}
$("cancel-edit").addEventListener("click", resetForm);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const from = fromInput.value;
  const to = toInput.value;
  const duration = daysBetween(from, to);
  if (!duration) {
    $("form-message").textContent = "Please select a valid date range (To date must be on or after From date).";
    $("form-message").style.color = "#bd4b4b";
    return;
  }
  const editId = $("edit-id").value;
  const record = {
    id: editId || (Date.now().toString() + Math.random().toString(16).slice(2, 6)),
    employeeId: $("employee-id").value.trim(),
    occupation: $("occupation").value,
    leaveType: $("leave-type").value,
    purpose: $("purpose").value,
    fromDate: from,
    toDate: to,
    duration,
    notes: $("notes").value.trim(),
    status: editId ? (leaves.find(x => x.id === editId)?.status || "Pending") : "Pending",
    appliedDate: editId ? (leaves.find(x => x.id === editId)?.appliedDate || new Date().toISOString().slice(0,10)) : new Date().toISOString().slice(0,10)
  };
  if (editId) {
    leaves = leaves.map(item => item.id === editId ? record : item);
    $("form-message").textContent = "Leave application updated successfully.";
  } else {
    leaves.unshift(record);
    $("form-message").textContent = "Leave applied successfully.";
  }
  $("form-message").style.color = "#26865f";
  save();
  resetForm();
  $("form-message").textContent = editId ? "Leave application updated successfully." : "Leave applied successfully.";
  $("form-message").style.color = "#26865f";
});

function formatDate(value) {
  if (!value) return "";
  return new Date(value + "T00:00:00").toLocaleDateString("en-IN", {day:"2-digit", month:"short", year:"numeric"});
}
function render() {
  const search = $("search-employee").value.trim().toLowerCase();
  const status = $("status-filter").value;
  const filtered = leaves.filter(item =>
    item.employeeId.toLowerCase().includes(search) && (!status || item.status === status)
  );
  $("leave-list").innerHTML = filtered.map(item => `
    <tr>
      <td><strong>${escapeHTML(item.employeeId)}</strong><small>${escapeHTML(item.leaveType)} · ${escapeHTML(item.occupation)}</small><br><small>${escapeHTML(item.purpose)}</small></td>
      <td>${formatDate(item.fromDate)}<br><small>to ${formatDate(item.toDate)}</small></td>
      <td><strong>${item.duration} day(s)</strong></td>
      <td><span class="status ${item.status}">${item.status}</span></td>
      <td><div class="actions"><button class="action-btn edit-btn" data-edit="${item.id}">Edit</button><button class="action-btn delete-btn" data-delete="${item.id}">Delete</button></div></td>
    </tr>`).join("");
  $("empty-state").style.display = filtered.length ? "none" : "block";
  $("shown-count").textContent = `Showing ${filtered.length} of ${leaves.length} request(s)`;
  $("total-count").textContent = leaves.length;
  $("pending-count").textContent = leaves.filter(x => x.status === "Pending").length;
  $("days-count").textContent = leaves.reduce((sum, x) => sum + Number(x.duration || 0), 0);
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
$("leave-list").addEventListener("click", (event) => {
  const editId = event.target.dataset.edit;
  const deleteId = event.target.dataset.delete;
  if (editId) {
    const item = leaves.find(x => x.id === editId);
    if (!item) return;
    $("edit-id").value = item.id;
    $("employee-id").value = item.employeeId;
    $("occupation").value = item.occupation;
    $("leave-type").value = item.leaveType;
    $("purpose").value = item.purpose;
    fromInput.value = item.fromDate;
    toInput.value = item.toDate;
    toInput.min = item.fromDate;
    $("notes").value = item.notes || "";
    updateDuration();
    $("form-title").textContent = "Update Leave";
    $("submit-btn").textContent = "✓ Update Leave";
    $("cancel-edit").hidden = false;
    $("leave-form").scrollIntoView({behavior:"smooth"});
  }
  if (deleteId) {
    const item = leaves.find(x => x.id === deleteId);
    if (item && confirm(`Delete leave request for ${item.employeeId}?`)) {
      leaves = leaves.filter(x => x.id !== deleteId);
      save();
    }
  }
});
$("search-employee").addEventListener("input", render);
$("status-filter").addEventListener("change", render);
$("clear-filters").addEventListener("click", () => {
  $("search-employee").value = "";
  $("status-filter").value = "";
  render();
});
render();
