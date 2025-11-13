import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';

// Reutilizamos el mismo CSS porque la estructura es idéntica
import './DashBoardReservas.css'; 

const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
const BAR_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const getDefaultMonth = () => new Date().toISOString().slice(0, 7);

const DashBoardPrestamos = ({ loans, users, equipments }) => {
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());

  // 1. Unir Préstamos con Usuarios y Equipos
  const mergedData = useMemo(() => {
    if (!loans || !users) return [];
    
    const usersMap = new Map(users.map(u => [u.id, u]));
    
    // Si 'equipments' viene como prop, úsalo. Si no, usa nombres genéricos o IDs.
    const equipMap = equipments 
      ? new Map(equipments.map(e => [e.id, e])) 
      : new Map(); // Mapa vacío si no hay equipos

    return loans.map(loan => {
      // Buscar nombre del equipo (si existe el prop equipments, si no, usar ID)
      const equipInfo = equipMap.get(loan.equipmentId);
      const equipName = equipInfo ? equipInfo.name : `Herramienta ${loan.equipmentId}`;

      return {
        ...loan,
        user: usersMap.get(loan.userId),
        equipmentName: equipName,
        startDate: new Date(loan.startDate),
        endDate: new Date(loan.endDate),
      };
    });
  }, [loans, users, equipments]);

  // 2. Filtrar por mes
  const monthlyData = useMemo(() => {
    return mergedData.filter(l => l.startDate.toISOString().startsWith(selectedMonth));
  }, [mergedData, selectedMonth]);

  // 3. Calcular Estadísticas
  const stats = useMemo(() => {
    const totalLoans = monthlyData.length;
    
    // Calcular Activos, Devueltos y Retrasados
    let activeCount = 0;
    let returnedCount = 0;
    let overdueCount = 0;


    monthlyData.forEach(l => {

      
      console.log(l.status)
      if (l.status === 'loaned') activeCount++;
      if (l.status === 'returned') {
        console.log(l)
        returnedCount++;}
      if (l.status === 'overdue') overdueCount++;
    });

    // --- A. Gráfico: Préstamos por Tipo de Herramienta (BarChart) ---
    const equipmentCounts = {};
    monthlyData.forEach(l => {
      const name = l.equipmentName;
      equipmentCounts[name] = (equipmentCounts[name] || 0) + 1;
    });
    const loansByEquipmentData = Object.entries(equipmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Ordenar por los más pedidos

    // --- B. Gráfico: Préstamos por Carrera (PieChart) ---
    const majorCounts = {};
    monthlyData.forEach(l => {
      const major = l.user?.carrera || 'No especificada';
      majorCounts[major] = (majorCounts[major] || 0) + 1;
    });
    const loansByMajorData = Object.entries(majorCounts).map(([name, value]) => ({ name, value }));

    // --- C. Gráfico: Demanda Diaria vs Inventario (LineChart) ---
    const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate();
    const dayCounts = Array(daysInMonth + 1).fill(0);
    monthlyData.forEach(l => {
      const day = l.startDate.getDate();
      dayCounts[day]++;
    });
    const loansByDayData = dayCounts.slice(1).map((count, day) => ({
      day: day + 1,
      prestamos: count,
    }));

    // Lógica de Inventario:
    // Supongamos que tenemos 5 unidades de cada una de las 4 herramientas = 20 total
    // Esto es un estimado para la línea de referencia.
    const totalStockEstimate = 6; 
    const alertStock = totalStockEstimate * 0.8; // 16 préstamos simultáneos en un día es alerta

    return {
      totalLoans,
      activeCount,
      returnedCount,
      overdueCount,
      loansByEquipmentData,
      loansByMajorData,
      loansByDayData,
      totalStockEstimate,
      alertStock
    };
  }, [monthlyData, selectedMonth]);

  // ================= EXPORTACIÓN =================
  const getDataForExport = () => {
    return monthlyData.map(l => ({
      ID: l.id,
      Herramienta: l.equipmentName,
      Estudiante: l.user?.name || 'Desc.',
      Carrera: l.user?.carrera || 'N/A',
      Inicio: l.startDate.toLocaleDateString(),
      Fin: l.endDate.toLocaleDateString(),
      Estado: l.status
    }));
  };

  const handleExportExcel = () => {
    const data = getDataForExport();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Prestamos");
    XLSX.writeFile(workbook, `Reporte_Prestamos_${selectedMonth}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const data = getDataForExport();
    doc.text(`Reporte de Préstamos - ${selectedMonth}`, 14, 15);
    const tableColumn = ["Herramienta", "Estudiante", "Carrera", "Inicio", "Fin", "Estado"];
    const tableRows = data.map(i => [i.Herramienta, i.Estudiante, i.Carrera, i.Inicio, i.Fin, i.Estado]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save(`Reporte_Prestamos_${selectedMonth}.pdf`);
  };

  return (
    <div className="dashboard-reservas"> {/* Reutilizamos clase CSS */}
      
      <div className="dashboard-header">
        <h2>Dashboard de Préstamos</h2>
        <div className="dashboard-controls">
          <button className="btn-export excel" onClick={handleExportExcel}><FaFileExcel /> Excel</button>
          <button className="btn-export pdf" onClick={handleExportPDF}><FaFilePdf /> PDF</button>
          <div className="separator"></div>
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="month-selector" />
        </div>
      </div>

      {/* --- KPIs (Adaptados a Préstamos) --- */}
      <div className="kpi-row">
        <div className="kpi-card">
          <h4>Préstamos Totales</h4>
          <p>{stats.totalLoans}</p>
        </div>
        <div className="kpi-card" style={{ borderLeftColor: '#28a745' }}>
          <h4>Devueltos Exitosamente</h4>
          <p>{stats.returnedCount}</p>
        </div>
        <div className="kpi-card" style={{ borderLeftColor: '#ffc107' }}>
          <h4>En Préstamo (Activos)</h4>
          <p>{stats.activeCount}</p>
        </div>
        <div className="kpi-card" style={{ borderLeftColor: '#dc3545' }}>
          <h4>Con Retraso (Mora)</h4>
          <p style={{ color: '#dc3545' }}>{stats.overdueCount}</p>
        </div>
      </div>

      {/* --- Gráficos Principales --- */}
      <div className="chart-row">
        <div className="chart-container large">
          <h3>Herramientas Más Solicitadas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.loansByEquipmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE">
                {stats.loansByEquipmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container small">
          <h3>Préstamos por Carrera</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.loansByMajorData}
                cx="50%" cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {stats.loansByMajorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Tendencia e Inventario --- */}
      <div className="chart-row">
        <div className="chart-container full">
          <h3>Flujo Diario de Préstamos vs Stock Estimado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.loansByDayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: 'Día', position: 'insideBottom', offset: -5 }} />
              
              {/* --- CORRECCIÓN AQUÍ --- */}
              {/* Forzamos al eje Y a mostrar desde 0 hasta el Stock Total */}
              <YAxis domain={[0, stats.totalStockEstimate]} />
              
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="prestamos" name="Préstamos Nuevos" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
              
              {/* Línea de Alerta de Stock */}
              <ReferenceLine y={stats.alertStock} label="Alerta Stock Bajo" stroke="red" strokeDasharray="3 3" />
              
              {/* Opcional: Línea de Stock Máximo para referencia visual */}
              <ReferenceLine y={stats.totalStockEstimate} label="Stock Total" stroke="gray" />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Decisiones --- */}
      <div className="insights-container">
        <h3>Análisis de Inventario</h3>
        <ul>
          <li>
            <strong>Top Herramienta:</strong> La herramienta más solicitada es <strong>{stats.loansByEquipmentData[0]?.name || 'N/A'}</strong>. 
            Revisa el estado físico de estas unidades frecuentemente por el alto desgaste.
          </li>
          <li>
            <strong>Control de Retrasos:</strong> Tienes <strong>{stats.overdueCount}</strong> préstamos con retraso este mes. 
            {stats.overdueCount > 5 
              ? " Es una cifra alta. Considera enviar correos automáticos de recordatorio 1 día antes del vencimiento." 
              : " La cifra es baja, el sistema de devoluciones funciona bien."}
          </li>
          <li>
            <strong>Stock:</strong> Si la línea morada cruza la línea roja frecuentemente, significa que en esos días 
            probablemente rechazaste solicitudes por falta de equipos.
          </li>
        </ul>
      </div>

    </div>
  );
};

export default DashBoardPrestamos;