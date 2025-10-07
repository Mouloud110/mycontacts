import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchContacts();
  }, [token, navigate]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setContacts(data);
      }
    } catch (err) {
      setError('Failed to load contacts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const contactData = { firstName, lastName, phone };

    try {
      if (editingId) {
        const response = await fetch(`${API_URL}/contacts/${editingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(contactData)
        });

        if (!response.ok) throw new Error('Update failed');
        setEditingId(null);
      } else {
        const response = await fetch(`${API_URL}/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(contactData)
        });

        if (!response.ok) throw new Error('Create failed');
      }

      setFirstName('');
      setLastName('');
      setPhone('');
      fetchContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact._id);
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setPhone(contact.phone);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;

    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchContacts();
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Contacts</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc' }}>
        <h2>{editingId ? 'Edit Contact' : 'Add Contact'}</h2>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', marginRight: '10px' }}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFirstName('');
              setLastName('');
              setPhone('');
            }}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Contacts List</h2>
      {contacts.length === 0 ? (
        <p>No contacts yet. Add your first contact above!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>First Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Last Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{contact.firstName}</td>
                <td style={{ padding: '10px' }}>{contact.lastName}</td>
                <td style={{ padding: '10px' }}>{contact.phone}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleEdit(contact)}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    style={{ cursor: 'pointer', color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Contacts;