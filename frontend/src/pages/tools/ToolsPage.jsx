import { useEffect, useState } from 'react';
import './ToolsPage.css';
import ToolsList from './ToolsLoan';
import MyLoans from './MyLoans';
import UserNavbar from '../../components/UserNavbar';
import loansApi from '../../api/loansApi';
import Asistente from './Asistente';

const HerramientasPage = () => {
  
  const [tools, setTools] = useState([]);
  const [loans, setLoans] = useState([]);

  const getAllTools = async () => {
    const data = await loansApi.getAllTools();
    setTools(data);
  };

  const getAllLoans = async () => {
    const data = await loansApi.getAllLoans();
    setLoans(data);
  };

  const cancelLoan = async (loanId) => {
    try {
      const data = await loansApi.cancelLoan(loanId);  
      await getAllLoans(); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTools();
    getAllLoans();
  },[]);
  
  useEffect(() => {
  }, [tools]);

  const loanTool = async (data) => {
    try {
      const loanedTool = await loansApi.createReservation(data)
      console.log(loanedTool)
      await getAllLoans();
    } catch(error) {
      console.log(error);
    }
  };

  const [activeTab, setActiveTab] = useState('reservar');

  return (
    <div className="page-container">
      {/* --- Barra de Navegación Superior --- */}
      <UserNavbar activePage="herramientas" />

      {/* --- Contenido Principal --- */}
      <main className="content-container"> {/* Renombrado para evitar conflictos */}
        {/* --- Pestañas de Navegación --- */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'reservar' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservar')}
          >
            Reservar Herramienta
          </button>
          <button
            className={`tab-btn ${activeTab === 'prestamos' ? 'active' : ''}`}
            onClick={() => setActiveTab('prestamos')}
          >
            Mis Préstamos
          </button>
          <button
            className={`tab-btn ${activeTab === 'asistente' ? 'active' : ''}`}
            onClick={() => setActiveTab('asistente')}
          >
            Asistente IA
          </button>
        </div>

        {/* --- Contenido Condicional --- */}
        {activeTab === 'reservar' && tools.length > 0 && (
          <ToolsList 
            setActiveTab={setActiveTab} 
            masterToolList={tools}
            masterLoanList={loans}
            loanTool={loanTool}
          />
        )}
        {activeTab === 'prestamos' &&(
          <MyLoans 
            masterLoanList={loans}
            cancelLoan={cancelLoan}
          />
        )}
        {activeTab === 'asistente' &&(
          <Asistente 
            
          />
        )}
      </main>
    </div>
  );
};

export default HerramientasPage;