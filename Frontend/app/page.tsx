'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Employee {
  id?: number;
  nombre: string;
  rfid_uid?: string;
  dni: string;
  correo: string;
  horas_diarias_trabajadas: number;
  dias_trabajados: number;
  puesto: string;
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [scannedUid, setScannedUid] = useState<string | null>(null);
  const [dniToBind, setDniToBind] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Estado del formulario de creación
  const [formData, setFormData] = useState<Employee>({
    nombre: '',
    rfid_uid: '',
    dni: '',
    correo: '',
    horas_diarias_trabajadas: 8,
    dias_trabajados: 0,
    puesto: 'DEVELOPER'
  });

  const BACKEND_URL = 'http://localhost:4000';

  // 1. Cargar lista de empleados
  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/employee/all`);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();

    // 2. Conexión WebSocket para capturar tarjetas no registradas
    const socket = io(BACKEND_URL);

    socket.on('rfid:unknow_card', (data: { rfid_uid: string }) => {
      setScannedUid(data.rfid_uid);
      setStatusMessage({
        text: `Tarjeta no registrada detectada: ${data.rfid_uid}`,
        type: 'info'
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 3. Crear Empleado
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/api/employee/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ text: 'Empleado creado exitosamente', type: 'success' });
        setFormData({
          nombre: '',
          rfid_uid: '',
          dni: '',
          correo: '',
          horas_diarias_trabajadas: 8,
          dias_trabajados: 0,
          puesto: 'DEVELOPER'
        });
        fetchEmployees();
      } else {
        setStatusMessage({ text: data.message || 'Error al crear empleado', type: 'error' });
      }
    } catch (error) {
      setStatusMessage({ text: 'Error de conexión con el servidor', type: 'error' });
    }
  };

  // 4. Vincular tarjeta RFID por DNI
  const handleAssignRfid = async () => {
    if (!dniToBind || !scannedUid) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/employee/assign-rfid-dni`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: dniToBind, rfid_uid: scannedUid })
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage({ text: `Tarjeta ${scannedUid} vinculada correctamente al DNI ${dniToBind}`, type: 'success' });
        setScannedUid(null);
        setDniToBind('');
        fetchEmployees();
      } else {
        setStatusMessage({ text: data.message || 'Error al vincular tarjeta', type: 'error' });
      }
    } catch (error) {
      setStatusMessage({ text: 'Error al procesar la vinculación', type: 'error' });
    }
  };

  return (
    <div style={{ backgroundColor: '#F4F7F5', color: '#2A332E', minHeight: '100vh', padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Panel de Control y Accesos RFID</h1>
        {statusMessage && (
          <p style={{
            marginTop: '8px',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: statusMessage.type === 'success' ? '#D1FAE5' : statusMessage.type === 'error' ? '#FEE2E2' : '#E0F2FE',
            color: '#2A332E'
          }}>
            {statusMessage.text}
          </p>
        )}
      </header>

      {/* Grid General: Izquierda (Escaneo + Formulario) / Derecha (Lista) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        
        {/* LADO IZQUIERDO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Recuadro de Detección RFID en Tiempo Real */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Detección de Tarjetas RFID</h2>
            
            {scannedUid ? (
              <div style={{ padding: '16px', border: '2px dashed #4ACF92', borderRadius: '8px', backgroundColor: '#F4F7F5' }}>
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>Tarjeta desconocida detectada:</p>
                <code style={{ fontSize: '18px', color: '#2A332E', display: 'block', margin: '8px 0' }}>{scannedUid}</code>
                <p style={{ marginBottom: '12px' }}>¿Desea asociarla a algún usuario existente?</p>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Ingrese DNI del usuario"
                    value={dniToBind}
                    onChange={(e) => setDniToBind(e.target.value)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}
                  />
                  <button
                    onClick={handleAssignRfid}
                    style={{ backgroundColor: '#4ACF92', color: '#FFFFFF', padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Vincular
                  </button>
                  <button
                    onClick={() => setScannedUid(null)}
                    style={{ backgroundColor: '#E5E7EB', color: '#2A332E', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: '#6B7280', fontStyle: 'italic' }}>Esperando lectura de tarjeta desde el lector ESP32...</p>
            )}
          </div>

          {/* Formulario para Agregar Empleados */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Registrar Nuevo Empleado</h2>
            <form onSubmit={handleCreateEmployee} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}
              />
              <input
                type="text"
                placeholder="DNI"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                required
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                required
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}
              />
              <input
                type="text"
                placeholder="RFID UID (Opcional)"
                value={formData.rfid_uid}
                onChange={(e) => setFormData({ ...formData, rfid_uid: e.target.value })}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}
              />
              <select
                value={formData.puesto}
                onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC', gridColumn: 'span 2' }}
              >
                <option value="DEVELOPER">DEVELOPER</option>
                <option value="DESIGNER">DESIGNER</option>
                <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="ANALYST">ANALYST</option>
              </select>
              <button
                type="submit"
                style={{
                  gridColumn: 'span 2',
                  backgroundColor: '#4ACF92',
                  color: '#FFFFFF',
                  padding: '10px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                Guardar Empleado
              </button>
            </form>
          </div>

        </div>

        {/* LADO DERECHO: Lista de Usuarios Registrados */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxHeight: '80vh', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Usuarios Registrados ({employees.length})</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {employees.map((emp) => (
  <div
    key={emp.id || emp.correo}
    style={{
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #4ACF92',
      backgroundColor: '#F4F7F5'
    }}
  >
    <p style={{ fontWeight: 'bold', fontSize: '15px' }}>{emp.nombre}</p>
    
    {/* Muestra el DNI o el texto 'Sin DNI' si es NULL o vacío */}
    <p style={{ fontSize: '13px', color: '#6B7280' }}>
      DNI: {emp.dni ? emp.dni : <span style={{ color: '#EF4444', fontWeight: 'bold' }}>Sin DNI</span>} | {emp.puesto}
    </p>

    {/* Muestra el RFID o 'Sin asignar' */}
    <p style={{ fontSize: '12px', color: '#2A332E', marginTop: '4px' }}>
      RFID: {emp.rfid_uid ? <code>{emp.rfid_uid}</code> : <span style={{ color: '#9CA3AF' }}>Sin asignar</span>}
    </p>
  </div>
))}
          </div>
        </div>

      </div>
    </div>
  );
}