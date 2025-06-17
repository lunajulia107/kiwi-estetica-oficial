import React, { useEffect, useState, useRef } from 'react';
import SearchBar from '../../components/SearchBar'; 
 
const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;
  const modalRef = useRef();

  useEffect(() => {
    const carregarAgendamentos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/agendamentos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const resultado = await response.json();
        setAgendamentos(response.ok && Array.isArray(resultado.dados) ? resultado.dados : []);
      } catch {
        setAgendamentos([]);
      }
    };

    carregarAgendamentos();
  }, []);

  const abrirModal = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const confirmarAgendamento = async () => {
    const { id } = agendamentoSelecionado;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/agendamentos/${id}/confirmar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setAgendamentos(prev =>
          prev.map(agt => agt.id === id ? { ...agt, status: 'confirmado' } : agt)
        );
        window.bootstrap.Modal.getInstance(modalRef.current).hide();
      } else {
        alert(data.mensagem || 'Erro ao confirmar agendamento.');
      }
    } catch {
      alert('Erro inesperado. Tente novamente.');
    }
  };

  const enviarMensagemWhatsApp = () => {
    const celular = agendamentoSelecionado?.celular?.replace(/\D/g, '');
    if (!celular) return alert('Celular não disponível para este cliente.');

    const mensagem = `Olá ${agendamentoSelecionado.nome}, seu agendamento para *${agendamentoSelecionado.procedimento}* está confirmado para o dia *${agendamentoSelecionado.data}* às *${agendamentoSelecionado.horario}*.`;
    const url = `https://wa.me/55${celular}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  // Filtra pelos filtros e busca
  const agendamentosFiltrados = agendamentos.filter(agt => {
    const statusOk = statusFiltro === "todos" || agt.status === statusFiltro;
    const buscaOk = agt.nome.toLowerCase().includes(busca.toLowerCase());
    return statusOk && buscaOk;
  });

  // Paginação
  const totalPaginas = Math.ceil(agendamentosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const agendamentosPagina = agendamentosFiltrados.slice(inicio, fim);

  const irParaPagina = (num) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaAtual(num);
  };

  // Reset pagina ao mudar filtro/busca
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [statusFiltro, busca]);

  return (
    <>
      <h3 className="fw-bold mb-3">Agendamentos</h3>

      {/* Filtros */}
      <div className="align-items-center d-flex flex-wrap gap-3 justify-content-between mb-3">
        <SearchBar busca={busca} setBusca={setBusca} />

        <div className="align-items-center d-flex flex-wrap gap-3">
          <label className="form-label" htmlFor="">Filtrar por</label>
          <select
            className="form-select w-auto"
            onChange={(e) => setStatusFiltro(e.target.value)}
            value={statusFiltro}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendentes</option>
            <option value="confirmado">Confirmados</option>
          </select> 
        </div> 
      </div>

      {/* Mobile: Cards */}
      <div className="d-md-none">
        {agendamentosPagina.map(agt => (
          <div className="card mb-3 shadow-sm" key={agt.id}>
            <div className="card-body">
              <h5 className="card-title">{agt.nome}</h5>
              <p><strong>Data:</strong> {agt.data} às {agt.horario}</p>
              <p><strong>Procedimento:</strong> {agt.procedimento}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`badge bg-${agt.status === 'pendente' ? 'warning' : 'success'}`}>
                  {agt.status}
                </span>
              </p>
              {agt.status === 'pendente' && (
                <button className="btn btn-sm btn-success" onClick={() => abrirModal(agt)}>
                  Confirmar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Tabela */}
      <div className="bg-white d-none d-md-block p-3 rounded-4 table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Cliente</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Procedimento</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {agendamentosPagina.map(agt => (
              <tr key={agt.id}>
                <td>{agt.nome}</td>
                <td>{agt.data}</td>
                <td>{agt.horario}</td>
                <td>{agt.procedimento}</td>
                <td>
                  <span className={`badge bg-${agt.status === 'pendente' ? 'warning' : 'success'}`}>
                    {agt.status}
                  </span>
                </td>
                <td>
                  {agt.status === 'pendente' && (
                    <button className="btn btn-sm btn-success" onClick={() => abrirModal(agt)}>
                      Confirmar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <nav aria-label="Paginação" className="d-flex justify-content-end mt-3">
        <ul className="pagination">
          <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => irParaPagina(paginaAtual - 1)}>Anterior</button>
          </li>

          {[...Array(totalPaginas)].map((_, idx) => {
            const num = idx + 1;
            return (
              <li key={num} className={`page-item ${paginaAtual === num ? 'active' : ''}`}>
                <button className="page-link" onClick={() => irParaPagina(num)}>{num}</button>
              </li>
            )
          })}

          <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => irParaPagina(paginaAtual + 1)}>Próximo</button>
          </li>
        </ul>
      </nav>

      {/* Modal */}
      <div
        aria-hidden="true"
        aria-labelledby="modalConfirmLabel"
        className="modal fade"
        ref={modalRef}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            {agendamentoSelecionado && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Agendamento</h5>
                  <button className="btn-close" data-bs-dismiss="modal" type="button"></button>
                </div>
                <div className="modal-body">
                  <p><strong>Cliente:</strong> {agendamentoSelecionado.nome}</p>
                  <p><strong>Procedimento:</strong> {agendamentoSelecionado.procedimento}</p>
                  <p><strong>Data:</strong> {agendamentoSelecionado.data} às {agendamentoSelecionado.horario}</p>
                  <p>Deseja confirmar este agendamento?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
                  <button className="btn btn-success" onClick={confirmarAgendamento} type="button">Confirmar</button>
                  <button className="btn btn-success ms-2" onClick={enviarMensagemWhatsApp} type="button">
                    Confirmar e Enviar WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Agendamentos;
