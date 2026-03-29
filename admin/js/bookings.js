initAdminLayout();

let allBookings = [];

async function loadBookings() {
  try {
    allBookings = await apiCall('/bookings');
    renderTable();
  } catch (err) {
    console.error(err);
  }
}

function renderTable() {
  const tbody = document.getElementById('bookBody');
  if (allBookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94a3b8;">No bookings yet</td></tr>';
    return;
  }
  tbody.innerHTML = allBookings.map(b => `
    <tr>
      <td><strong>${escapeHtml(b.reference)}</strong></td>
      <td>${escapeHtml(b.destination)}</td>
      <td>${b.checkIn || 'Flexible'} &rarr; ${b.checkOut || 'Flexible'}</td>
      <td>${b.adults}A ${b.children ? '+ ' + b.children + 'C' : ''}</td>
      <td>${b.totalPrice ? formatPKR(b.totalPrice) : '—'}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td>${formatDate(b.createdAt)}</td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="editStatus('${b._id}', '${b.status}')">Status</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBooking('${b._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editStatus(id, currentStatus) {
  document.getElementById('editBookingId').value = id;
  document.getElementById('bookingStatus').value = currentStatus;
  openModal('statusModal');
}

async function updateStatus() {
  const id = document.getElementById('editBookingId').value;
  const status = document.getElementById('bookingStatus').value;
  try {
    await apiCall('/bookings/' + id, { method: 'PUT', body: JSON.stringify({ status }) });
    closeModal('statusModal');
    loadBookings();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

async function deleteBooking(id) {
  if (!confirm('Delete this booking?')) return;
  try {
    await apiCall('/bookings/' + id, { method: 'DELETE' });
    loadBookings();
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

loadBookings();
