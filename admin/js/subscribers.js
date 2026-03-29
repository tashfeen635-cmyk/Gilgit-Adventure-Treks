initAdminLayout();

let allSubscribers = [];

async function loadSubscribers() {
  try {
    allSubscribers = await apiCall('/subscribers');
    renderTable();
  } catch (err) {
    console.error(err);
  }
}

function renderTable() {
  const tbody = document.getElementById('subBody');
  if (allSubscribers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#94a3b8;">No subscribers yet</td></tr>';
    return;
  }
  tbody.innerHTML = allSubscribers.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${formatDate(s.createdAt)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteSub('${s._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteSub(id) {
  if (!confirm('Remove this subscriber?')) return;
  try {
    await apiCall('/subscribers/' + id, { method: 'DELETE' });
    loadSubscribers();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

loadSubscribers();
