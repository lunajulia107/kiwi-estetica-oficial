import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CustomDatePicker from '../components/CustomDatePicker.jsx';

const Agendar = () => {
  const [formData, setFormData] = useState({
    nome: '', celular: '', categoria: '', procedimento: '', data: '', horario: ''
  });
  const [errors, setErrors] = useState({});
  const [horariosDisponiveis] = useState([
    '08:00', '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ]);
  const [submissionMessage, setSubmissionMessage] = useState({ text: '', type: '' });

  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [datasCompletamenteOcupadas, setDatasCompletamenteOcupadas] = useState([]);

  const procedimentosPorCategoria = {
    'procedimentos corporais': [
      'Carboxiterapia', 'Drenagem Linfática', 'Lipocavitação', 'Massagem Modeladora',
      'Massagem Nutritiva e Esfoliante', 'Massagem Relaxante', 'Protocolo Redux Duo',
      'Tratamento de Manchas'
    ],
    'procedimentos faciais': [
      'Limpeza de pele duo', 'Limpeza de pele normal', 'Massofilaxia facial', 'Peelings',
      'Revitalização e nutrição facial', 'Tratamento para manchas, lábios e olhos',
      'Tratamento rejuvenescedor', 'Tratamentos com LED Terapêutico'
    ],
    'terapias complementares': [
      'Acupuntura', 'Cromoterapia'
    ]
  };

  const applyPhoneMask = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'celular' ? applyPhoneMask(value) : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSubmissionMessage({ text: '', type: '' });
  };

  const handleDateChange = (isoDateString) => {
    setFormData(prev => ({ ...prev, data: isoDateString, horario: '' }));
    setErrors(prev => ({ ...prev, data: '' }));
    setSubmissionMessage({ text: '', type: '' });
  };

  const handleHorarioChange = (horario) => {
    setFormData(prev => ({ ...prev, horario: horario }));
    setErrors(prev => ({ ...prev, horario: '' }));
    setSubmissionMessage({ text: '', type: '' });
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'nome': errorMessage = !value.trim() ? 'Insira seu nome.' : !/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{2,}$/.test(value) ? 'Nome inválido. Use apenas letras e espaços.' : ''; break;
      case 'celular': errorMessage = !value.trim() ? 'Insira seu celular.' : !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value) ? 'Formato de celular inválido. Ex: (99) 99999-9999 ou (99) 9999-9999.' : ''; break;
      case 'categoria': errorMessage = !value ? 'Selecione uma categoria.' : ''; break;
      case 'procedimento': errorMessage = !value ? 'Selecione um procedimento.' : ''; break;
      case 'data': errorMessage = !value ? 'Insira uma data.' : ''; break;
      case 'horario': errorMessage = !value ? 'Selecione um horário.' : ''; break;
      default: break;
    }
    return errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let isValid = true;
    for (const key of ['nome', 'celular', 'categoria', 'procedimento', 'data', 'horario']) {
      const error = validateField(key, formData[key]);
      if (error) { newErrors[key] = error; isValid = false; }
    }
    setErrors(newErrors);

    if (isValid) {
      try {
        const response = await axios.post('http://localhost:5000/api/agendar', formData);
        window.open(response.data.whatsappLink, '_blank');
        setSubmissionMessage({ text: response.data.message, type: 'success' });
        setFormData({ nome: '', celular: '', categoria: '', procedimento: '', data: '', horario: '' });
        setHorariosOcupados([]);
        if (fetchDatasCompletamenteOcupadas.current) {
          fetchDatasCompletamenteOcupadas.current();
        }
      } catch (error) {
        console.error('Erro ao agendar:', error);
        setSubmissionMessage({
          text: error.response?.data?.message || 'Ocorreu um erro ao agendar. Por favor, tente novamente.',
          type: 'danger'
        });
      }
    } else {
      setSubmissionMessage({ text: 'Por favor, preencha todos os campos obrigatórios corretamente.', type: 'danger' });
    }
  };

  useEffect(() => {
    const fetchHorariosOcupados = async () => {
      if (formData.data) {
        try {
          const response = await axios.get(`http://localhost:5000/api/horarios-ocupados?date=${formData.data}`);
          setHorariosOcupados(response.data.horariosOcupados);
        } catch (error) {
          console.error('Erro ao buscar horários ocupados:', error);
          setHorariosOcupados([]);
        }
      } else {
        setHorariosOcupados([]);
      }
    };
    fetchHorariosOcupados();
  }, [formData.data]);

  const fetchDatasCompletamenteOcupadas = useRef(null);
  useEffect(() => {
    fetchDatasCompletamenteOcupadas.current = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/datas-completamente-ocupadas');
        setDatasCompletamenteOcupadas(response.data.datasOcupadas);
      } catch (error) {
        console.error('Erro ao buscar datas completamente ocupadas:', error);
        setDatasCompletamenteOcupadas([]);
      }
    };
    fetchDatasCompletamenteOcupadas.current();
  }, []);

  return (
    <div className="text-white" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/mulher-agendando.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="align-items-start d-flex flex-column justify-content-center p-4 w-100">
        <div className="container pb-5 pt-5">
          <div className="gap-5 pb-0 pt-0 pb-md-5 pt-md-5 row">
            <div className="col-lg-7 d-flex flex-column gap-5 justify-content-between">
              <div className="d-flex flex-column gap-2">
                <h1 className="display-4 fw-medium">
                  Você merece esse <span className="fw-bold">momento.</span>
                </h1>
                <p className="lead fw-normal w-75">
                  A Kiwi vai além da estética, é um convite para você florescer,
                  com cuidado, carinho e respeito à sua beleza natural.
                </p>
              </div>
              <div className="d-flex flex-column gap-2">
                <p className="align-items-center d-flex gap-2">
                  <i className="bi bi-whatsapp"></i>
                  <a href="https://wa.me/5511987654321" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white">
                    (11) 98765-4321
                  </a>
                </p>
                <p className="align-items-center d-flex gap-2">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>
                    Centro Comercial, 138 - Alphaville, Barueri - SP.
                    <br />
                    CEP: 06454-150. Seg à Sáb - Das 9h às 18h.
                  </span>
                </p>
                <p className="align-items-center d-flex gap-2">
                  <i className="bi bi-envelope-fill"></i>
                  <a href="mailto:kiwiestetica@gmail.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none text-white">
                    kiwiestetica@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white p-3 p-lg-4 rounded-4">
                <h3 className="fw-bold mb-2 text-forest-green text-center">Agendamento</h3>
                <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="form-label mb-2 text-forest-green" htmlFor="nome">Nome</label>
                    <input
                      className={`border form-control p-2 ${errors.nome ? 'is-invalid' : ''}`}
                      id="nome" name="nome" onChange={handleChange} type="text" value={formData.nome}
                    />
                    {errors.nome && <p className="text-danger mt-1">{errors.nome}</p>}
                  </div>
                  <div>
                    <label className="form-label mb-2 text-forest-green" htmlFor="celular">Celular</label>
                    <input
                      className={`border form-control p-2 text-black ${errors.celular ? 'is-invalid' : ''}`}
                      id="celular" name="celular" onChange={handleChange} placeholder="(00) 00000-0000"
                      type="tel" value={formData.celular} maxLength="15"
                    />
                    {errors.celular && <p className="text-danger mt-1">{errors.celular}</p>}
                  </div>
                  <div>
                    <label className="form-label mb-2 text-forest-green" htmlFor="categoria">Categoria</label>
                    <select
                      className={`border form-control form-select p-2 ${errors.categoria ? 'is-invalid' : ''}`}
                      id="categoria" name="categoria" onChange={handleChange} value={formData.categoria}
                    >
                      <option value="">Selecione uma categoria</option>
                      {Object.keys(procedimentosPorCategoria).sort().map((categoryKey) => (
                        <option key={categoryKey} value={categoryKey}>
                          {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1).replace('procedimentos ', '')}
                        </option>
                      ))}
                    </select>
                    {errors.categoria && <p className="text-danger mt-1">{errors.categoria}</p>}
                  </div>
                  {formData.categoria && (
                    <div>
                      <label className="form-label mb-2 text-forest-green" htmlFor="procedimento">Procedimentos</label>
                      <select
                        className={`border form-control form-select p-2 ${errors.procedimento ? 'is-invalid' : ''}`}
                        id="procedimento" name="procedimento" onChange={handleChange} value={formData.procedimento}
                      >
                        <option value="">Selecione um procedimento</option>
                        {procedimentosPorCategoria[formData.categoria]?.sort().map((proc, index) => (
                          <option key={index} value={proc}>{proc}</option>
                        ))}
                      </select>
                      {errors.procedimento && <p className="text-danger mt-1">{errors.procedimento}</p>}
                    </div>
                  )}
                  <div>
                    <label className="form-label mb-2 text-forest-green" htmlFor="data">Data</label>
                    <CustomDatePicker
                      selectedDate={formData.data}
                      onDateChange={handleDateChange}
                      disabledDates={datasCompletamenteOcupadas}
                    />
                    {errors.data && <p className="text-danger mt-1">{errors.data}</p>}
                  </div>
                  <div>
                    <label className="form-label mb-2 text-forest-green" htmlFor="horario">Horário</label>
                    <div className="d-flex flex-wrap gap-2">
                      {horariosDisponiveis.map((hora, idx) => (
                        <button
                          className={`btn btn-sm ${formData.horario === hora ? 'btn-brown text-white' : 'border text-black'}`}
                          type="button" key={idx} onClick={() => handleHorarioChange(hora)}
                          disabled={horariosOcupados.includes(hora) || !formData.data}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                    {errors.horario && <p className="text-danger mt-1">{errors.horario}</p>}
                  </div>
                  <div className="d-flex flex-column justify-content-start mb-2">
                    <button className="btn btn-lime-green pe-4 ps-4 text-white" type="submit">
                      Agendar agora
                    </button>
                    {submissionMessage.text && (
                      <p className={`mt-2 text-center ${submissionMessage.type === 'success' ? 'text-forest-green' : 'text-danger'}`}>
                        {submissionMessage.text}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agendar;