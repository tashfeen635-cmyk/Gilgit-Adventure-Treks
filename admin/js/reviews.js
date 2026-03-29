initAdminLayout();

let allReviews = [];

async function loadReviews() {
  try {
    allReviews = await apiCall('/reviews');
    renderTable();
  } catch (err) {
    console.error(err);
  }
}

function renderTable() {
  const tbody = document.getElementById('revBody');
  if (allReviews.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;">No reviews</td></tr>';
    return;
  }
  tbody.innerHTML = allReviews.map(r => `
    <tr>
      <td><img class="thumb" src="${escapeHtml(r.avatar)}" alt="${escapeHtml(r.name)}" style="border-radius:50%;width:36px;height:36px;"></td>
      <td><strong>${escapeHtml(r.name)}</strong></td>
      <td>${escapeHtml(r.location)}</td>
      <td>${escapeHtml(r.destination)}</td>
      <td>${r.rating}/5</td>
      <td>${r.verified ? 'Yes' : 'No'}</td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="editReview('${r._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteReview('${r._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function showAddModal() {
  document.getElementById('modalTitle').textContent = 'Add Review';
  document.getElementById('revForm').reset();
  document.getElementById('editId').value = '';
  openModal('revModal');
}

function editReview(id) {
  const r = allReviews.find(x => x._id === id);
  if (!r) return;
  document.getElementById('modalTitle').textContent = 'Edit Review';
  document.getElementById('editId').value = r._id;
  document.getElementById('rName').value = r.name;
  document.getElementById('rLocation').value = r.location;
  document.getElementById('rDest').value = r.destination;
  document.getElementById('rRating').value = r.rating;
  document.getElementById('rAvatar').value = r.avatar;
  document.getElementById('rText').value = r.text;
  document.getElementById('rVerified').value = r.verified ? 'true' : 'false';
  openModal('revModal');
}

async function saveReview() {
  const editId = document.getElementById('editId').value;
  const body = {
    name: document.getElementById('rName').value.trim(),
    location: document.getElementById('rLocation').value.trim(),
    destination: document.getElementById('rDest').value.trim(),
    rating: parseInt(document.getElementById('rRating').value),
    avatar: document.getElementById('rAvatar').value.trim(),
    text: document.getElementById('rText').value.trim(),
    verified: document.getElementById('rVerified').value === 'true'
  };

  try {
    if (editId) {
      await apiCall('/reviews/' + editId, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      await apiCall('/reviews', { method: 'POST', body: JSON.stringify(body) });
    }
    closeModal('revModal');
    loadReviews();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deleteReview(id) {
  if (!confirm('Delete this review?')) return;
  try {
    await apiCall('/reviews/' + id, { method: 'DELETE' });
    loadReviews();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

loadReviews();
