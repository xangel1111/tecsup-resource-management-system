import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ReferenceLine
} from 'recharts';

import * as XLSX from 'xlsx'; // <--- Importar Excel
import jsPDF from 'jspdf';    // <--- Importar PDF
import autoTable from 'jspdf-autotable'; // <--- Importar Plugin de Tabla PDF
import { FaFileExcel, FaFilePdf } from 'react-icons/fa'; // <--- Iconos (opcional, o usa texto)

import './DashBoardReservas.css';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Función para obtener el mes actual en formato YYYY-MM (ej: "2025-11")
const getDefaultMonth = () => new Date().toISOString().slice(0, 7);

const DashBoardReservas = ({ reservations, users }) => {
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());

  // 1. Unir Reservas con Datos de Usuario (sólo se recalcula si cambian)
  const mergedData = useMemo(() => {
    
    if (!reservations || !users) return [];
    
    // Crear un mapa de usuarios para búsqueda rápida
    const usersMap = new Map(users.map(user => [user.id, user]));

    console.log(usersMap);
    
    return reservations
      .map(res => {
        // Solo incluimos reservas 'accepted' o 'completed' en las métricas
        if (res.status !== 'accepted' && res.status !== 'completed') {
          return null;
        }
        return {
          ...res,
          user: usersMap.get(res.userId), // Adjuntar info del usuario
          startTime: new Date(res.startTime), // Convertir a objeto Date
          endTime: new Date(res.endTime),
        };
      })
      .filter(Boolean); // Filtrar nulos (reservas no aceptadas)
  }, [reservations, users]);

  // 2. Filtrar data por el mes seleccionado
  const monthlyData = useMemo(() => {
    return mergedData.filter(res => {
      return res.startTime.toISOString().startsWith(selectedMonth);
    });
  }, [mergedData, selectedMonth]);

// 3. Calcular Estadísticas (KPIs, Gráficos)
  const stats = useMemo(() => {
    // --- A. KPIs Principales ---
    const totalReservations = monthlyData.length;
    const totalHours = monthlyData.reduce((acc, res) => {
      const duration = (res.endTime - res.startTime) / (1000 * 60 * 60); 
      return acc + duration;
    }, 0);

    // --- E. Cálculo de Capacidad ---
    const totalCubicles = 4;
    const dailyHoursOpen = 12; 
    const maxDailyCapacity = totalCubicles * dailyHoursOpen; // 48
    const saturationPoint = maxDailyCapacity * 0.8; // 38.4
    
    // --- B. Gráfico de Horas Pico (BarChart) --- CORREGIDO
    const hourCounts = Array(24).fill(0);
    monthlyData.forEach(res => {
      const startHour = res.startTime.getHours();
      hourCounts[startHour]++;
    });

    // CORRECCIÓN: Filtramos por índice numérico (index) NO por texto
    const peakHoursData = hourCounts
      .map((count, index) => ({ hourIndex: index, count })) // Guardamos el índice
      .filter(item => item.hourIndex >= 6 && item.hourIndex <= 22) // Filtramos números
      .map(item => ({
        hour: `${item.hourIndex}:00`, // Ahora sí convertimos a texto
        reservas: item.count,
      }));

    // --- C. Gráfico de Reservas por Día (LineChart) ---
    const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate();
    const dayCounts = Array(daysInMonth + 1).fill(0);
    monthlyData.forEach(res => {
      const day = res.startTime.getDate();
      dayCounts[day]++;
    });
    const reservationsByDayData = dayCounts.slice(1).map((count, day) => ({
      day: day + 1,
      reservas: count,
    }));

    // --- D. Gráfico de Carreras (PieChart) ---
    const majorCounts = {};
    monthlyData.forEach(res => {
      const major = res.user?.carrera || 'No especificada';
      majorCounts[major] = (majorCounts[major] || 0) + 1;
    });
    const reservationsByMajorData = Object.entries(majorCounts).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalReservations,
      totalHours: totalHours.toFixed(1),
      peakHoursData,
      reservationsByDayData,
      reservationsByMajorData,
      maxDailyCapacity,      
      saturationPoint        
    };
  }, [monthlyData]);

  // ============================================================
  // 🚀 NUEVAS FUNCIONES DE EXPORTACIÓN
  // ============================================================

  // 1. Preparar datos limpios para exportar (aplanar objetos)
  const getDataForExport = () => {
    return monthlyData.map(res => ({
      ID: res.id,
      Fecha: res.startTime.toLocaleDateString(),
      Inicio: res.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      Fin: res.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      Estudiante: res.user?.name || 'Desconocido',
      Carrera: res.user?.carrera || 'N/A',
      Cubículo: `Cubículo ${res.cubicleId}`, // Asumiendo que tienes el ID
      Estado: res.status
    }));
  };

  // 2. Exportar a Excel
  const handleExportExcel = () => {
    const data = getDataForExport();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservas");
    XLSX.writeFile(workbook, `Reporte_Reservas_${selectedMonth}.xlsx`);
  };

  // 3. Exportar a PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const data = getDataForExport();

    doc.text(`Reporte de Reservas - ${selectedMonth}`, 14, 15);
    
    const tableColumn = ["Fecha", "Inicio", "Fin", "Estudiante", "Carrera", "Cubículo"];
    const tableRows = data.map(item => [
      item.Fecha,
      item.Inicio,
      item.Fin,
      item.Estudiante,
      item.Carrera,
      item.Cubículo
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Reporte_Reservas_${selectedMonth}.pdf`);
  };

  return (
    <div className="dashboard-reservas">
      
      {/* --- HEADER ACTUALIZADO --- */}
      <div className="dashboard-header">
        <h2>Dashboard de Reservas</h2>
        
        <div className="dashboard-controls">
          {/* Botones de Exportación */}
          <button className="btn-export excel" onClick={handleExportExcel} title="Exportar Excel">
            <FaFileExcel /> Excel
          </button>
          <button className="btn-export pdf" onClick={handleExportPDF} title="Exportar PDF">
            <FaFilePdf /> PDF
          </button>

          {/* Separador vertical visual */}
          <div className="separator"></div>

          {/* Selector de Mes */}
          <input 
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="month-selector"
          />
        </div>
      </div>

      {/* --- Fila de KPIs --- */}
      <div className="kpi-row">
        <div className="kpi-card">
          <h4>Total de Reservas (Aceptadas)</h4>
          <p>{stats.totalReservations}</p>
        </div>
        <div className="kpi-card">
          <h4>Total de Horas Reservadas</h4>
          <p>{stats.totalHours}</p>
        </div>
        <div className="kpi-card">
          <h4>Promedio Reservas / Día</h4>
          <p>{(stats.totalReservations / stats.reservationsByDayData.length).toFixed(1)}</p>
        </div>
      </div>

      {/* --- Fila de Gráficos Principales --- */}
      <div className="chart-row">
        <div className="chart-container large">
          <h3>Reservas por Hora del Día (Horas Pico)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reservas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container small">
          <h3>Reservas por Carrera</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.reservationsByMajorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {stats.reservationsByMajorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Gráfico Modificado --- */}
      <div className="chart-row">
        <div className="chart-container full">
          <h3>Tendencia de Reservas Diarias vs Capacidad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.reservationsByDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Día', position: 'insideBottom', offset: -5 }} />
              
              {/* CORRECCIÓN AQUÍ: Forzamos el dominio hasta la capacidad máxima */}
              <YAxis domain={[0, stats.maxDailyCapacity]} /> 
              
              <Tooltip />
              <Legend />
              
              <Line type="monotone" dataKey="reservas" name="Reservas Reales" stroke="#82ca9d" activeDot={{ r: 8 }} strokeWidth={3} />
              
              <ReferenceLine 
                y={stats.saturationPoint} 
                label="Alerta (80%)" 
                stroke="red" 
                strokeDasharray="3 3" 
              />
              
              <ReferenceLine 
                y={stats.maxDailyCapacity} 
                label="Capacidad Max" 
                stroke="gray" 
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Sección de Decisiones --- */}
      <div className="insights-container">
        <h3>Decisiones Clave y Observaciones</h3>
        <ul>
          <li>
            <strong>Análisis de Horas Pico:</strong> El gráfico de barras muestra picos de demanda entre las 
            <strong> 10:00-12:00</strong> y <strong>15:00-17:00</strong>.
            Si los cubículos se llenan, considera incentivar reservas en horas valle (ej: 9:00, 13:00) con algún beneficio.
          </li>
          <li>
            <strong>Demanda por Carrera:</strong> La carrera de <strong>{stats.reservationsByMajorData[0]?.name || 'N/A'}</strong> 
            es la que más reserva. ¿Necesitan software o hardware específico que justifique un nuevo cubículo temático para ellos?
          </li>
          <li>
            <strong>Demanda General:</strong> Si el número total de reservas supera constantemente el 80% de la capacidad
            total disponible (ej: +250 reservas/mes), es un indicador claro para <strong>invertir en un nuevo cubículo</strong>.
          </li>
        </ul>
      </div>

    </div>
  );
};

export default DashBoardReservas;