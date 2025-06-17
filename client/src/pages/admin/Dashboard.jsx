import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const response = await fetch('http://localhost:5000/api/admin/dashboard', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Erro ao buscar dados');
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    if (loading) return <p>Carregando dados do dashboard...</p>;
    if (error) return <p>Erro: {error}</p>;

    const {
        proximaCliente,
        totalHoje,
        agendamentosPendentes,
        agendamentosConfirmados,
        agendamentosCategoria,
        topProcedimentos
    } = dashboardData;

    const dataDoughnut = {
        labels: agendamentosCategoria.labels,
        datasets: [
            {
                label: 'Agendamentos',
                data: agendamentosCategoria.valores,
                backgroundColor: ['#97C249', '#614C33', '#0A3521'], 
                borderWidth: 0,
            },
        ],
    };

    const optionsDoughnut = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { boxWidth: 20, color: '#000' },
            },
            tooltip: {
                callbacks: {
                    label: context => `${context.parsed} agendamentos`,
                },
            },
        },
    };

    const dataBar = {
        labels: topProcedimentos.labels,
        datasets: [
            {
                label: 'Agendamentos',
                data: topProcedimentos.valores,
                backgroundColor: '#97C249',
                borderRadius: 4,
            },
        ],
    };

    const optionsBar = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: context => `${context.parsed.y} agendamentos`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 2 },
            },
        },
    };

    return (
        <>
            <section className="bg-forest-green ps-4 pe-4 ps-lg-0 pe-lg-0 py-5 rounded-4 text-light">
                <div className="container-fluid">
                    <div className="align-items-center row">
                        <div className="col-12 col-xxl-2 mb-4 mb-xl-0">
                            <h3 className="fw-bold mb-0 ps-lg-3">{proximaCliente || '—'}</h3>
                            <p className="mb-0 ps-lg-3 small">Próxima cliente</p>
                        </div>

                        <div className="border-light border-opacity-10 border-start col-12 col-xl-3 col-xxl-2 mb-4 mb-xl-0">
                            <h2 className="fw-bold mb-0 ps-lg-3">
                                {totalHoje ?? 0}<span className="text-lime-green">C</span>
                            </h2>
                            <p className="mb-0 ps-lg-3 small">Total de hoje</p>
                        </div>

                        <div className="border-light border-opacity-10 border-start col-12 col-xl-3 col-xxl-2 mb-4 mb-xl-0">
                            <h2 className="fw-bold mb-0 ps-lg-3">
                                {agendamentosPendentes ?? 0}<span className="text-lime-green">A</span>
                            </h2>
                            <p className="mb-0 ps-lg-3 small">Pendentes</p>
                        </div>

                        <div className="border-light border-opacity-25 border-start col-12 col-xl-3 col-xxl-2 mb-4 mb-xl-0">
                            <h2 className="fw-bold mb-0 ps-lg-3">
                                {agendamentosConfirmados ?? 0}<span className="text-lime-green">C</span>
                            </h2>
                            <p className="mb-0 ps-lg-3 small">Confirmados</p>
                        </div>

                        <div className="col-12 col-xl-3 col-xxl-4 ps-lg-3">
                            <p className="col-10 mb-2 small">
                                Acompanhe os atendimentos pendentes. Esses dados são atualizados automaticamente com base nos registros da plataforma.
                            </p>
                            <a href="#" className="fw-bold text-decoration-none text-lime-green">
                                Conferir pendentes
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-fluid mt-4">
                <div className="row">
                    <article className="col-12 col-xl-8 mb-4 ps-0">
                        <div className="bg-white p-4 rounded-4">
                            <p className="fw-semibold mb-4">Top 5 procedimentos</p>
                            <Bar data={dataBar} options={optionsBar} />
                        </div>
                    </article>
                    <article className="col-12 col-xl-4 pe-0">
                        <div className="bg-white p-4 rounded-4">
                            <p className="fw-semibold mb-4">Resumo por categoria</p>
                            <div className="align-items-center d-flex flex-column">
                                <div style={{ width: '100%', maxWidth: '350px', height: '350px' }}>
                                    <Doughnut data={dataDoughnut} options={optionsDoughnut} />
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
