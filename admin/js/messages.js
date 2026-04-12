initAdminLayout();

let allMessages = [];
let currentMsgId = null;

async function loadMessages() {
  try {
    allMessages = await apiCall('/contact');
    renderTable();
  } catch (err) {
    console.error(err);
  }
}

function renderTable() {
  const filter = document.getElementById('statusFilter').value;
  const filtered = filter === 'all' ? allMessages : allMessages.filter(m => m.status === filter);
  const tbody = document.getElementById('msgBody');

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;">No messages found</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map((m, i) => `
    <tr style="${m.status === 'unread' ? 'font-weight:600;' : ''}">
      <td>${i + 1}</td>
      <td>${escapeHtml(m.name)}</td>
      <td>${escapeHtml(m.email)}</td>
      <td>${escapeHtml(m.subject)}</td>
      <td><span class="badge badge-${m.status}">${m.status}</span></td>
      <td>${formatDate(m.createdAt)}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="viewMsg('${m._id}')">View</button>
        <button class="btn btn-sm btn-danger" onclick="deleteMsg('${m._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function viewMsg(id) {
  const m = allMessages.find(msg => msg._id === id);
  if (!m) return;
  currentMsgId = id;

  document.getElementById('modalSubject').textContent = m.subject;
  document.getElementById('modalName').textContent = m.name;
  document.getElementById('modalEmail').textContent = m.email;
  document.getElementById('modalPhone').textContent = m.phone || '—';
  document.getElementById('modalDate').textContent = formatDate(m.createdAt);
  document.getElementById('modalMessage').textContent = m.message;
  document.getElementById('modalStatus').value = m.status;

  openModal('viewModal');

  // Auto-mark as read if unread
  if (m.status === 'unread') {
    apiCall('/contact/' + id, {
      method: 'PUT',
      body: JSON.stringify({ status: 'read' })
    }).then(() => {
      m.status = 'read';
      renderTable();
    });
  }
}

async function updateStatus() {
  if (!currentMsgId) return;
  const status = document.getElementById('modalStatus').value;
  try {
    await apiCall('/contact/' + currentMsgId, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    const m = allMessages.find(msg => msg._id === currentMsgId);
    if (m) m.status = status;
    renderTable();
    closeModal('viewModal');
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deleteMsg(id) {
  if (!confirm('Delete this message?')) return;
  try {
    await apiCall('/contact/' + id, { method: 'DELETE' });
    loadMessages();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

document.getElementById('statusFilter').addEventListener('change', renderTable);

loadMessages();
