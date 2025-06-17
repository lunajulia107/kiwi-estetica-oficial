const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointments');  

// POST /appointments — criar agendamento
router.post('/', async (req, res) => {
    console.log('Dados recebidos:', req.body);
    const { nome, celular, categoria, procedimento, data, horario } = req.body;

    if (!nome || !celular || !categoria || !procedimento || !data || !horario) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const existingConfirmedAppointment = await Appointment.findOne({
            where: { data, horario, status: 'confirmado' }
        });

        if (existingConfirmedAppointment) {
            return res.status(409).json({
                message: 'Este horário já está agendado e confirmado por outra pessoa. Por favor, escolha outro.'
            });
        }

        const existingPendingAppointment = await Appointment.findOne({
            where: { data, horario, status: 'pendente' }
        });

        if (existingPendingAppointment) {
            return res.status(409).json({
                message: 'Este horário está em processo de agendamento. Por favor, escolha outro horário ou tente mais tarde.'
            });
        }

        const newAppointment = await Appointment.create({
            nome,
            celular,
            categoria,
            procedimento,
            data,
            horario,
            status: 'pendente'
        });

        const numeroProfissional = process.env.WHATSAPP_PROFISSIONAL_NUMBER;
        const mensagem = `Olá, tenho um agendamento:\nNome: ${nome}\nCelular: ${celular}\nCategoria: ${categoria}\nProcedimento: ${procedimento}\nData: ${data}\nHorário: ${horario}`;
        const urlWhatsApp = `https://wa.me/${numeroProfissional}?text=${encodeURIComponent(mensagem)}`;

        res.status(201).json({
            message: 'Agendamento registrado como pendente. Por favor, confirme via WhatsApp.',
            whatsappLink: urlWhatsApp,
            appointmentId: newAppointment.id // Sequelize cria a propriedade 'id' para PK automaticamente
        });

    } catch (error) {
        console.error('Erro ao agendar:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao tentar agendar.' });
    }
});

// GET /appointments/horarios-ocupados?date=YYYY-MM-DD
router.get('/horarios-ocupados', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'A data é um parâmetro obrigatório.' });
    }

    try {
        const occupiedAppointments = await Appointment.findAll({
            where: {
                data: date,
                status: ['confirmado', 'pendente']
            },
            attributes: ['horario'],
            group: ['horario']
        });

        const occupiedHorarios = occupiedAppointments.map(a => a.horario);

        res.json({ horariosOcupados: occupiedHorarios });

    } catch (error) {
        console.error('Erro ao buscar horários ocupados:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar horários.' });
    }
});

// GET /appointments/datas-completamente-ocupadas
router.get('/datas-completamente-ocupadas', async (req, res) => {
    const totalHorariosDisponiveis = [
        '08:00', '09:00', '10:00', '11:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ].length;

    try {
        // No Sequelize, para fazer HAVING com COUNT e GROUP BY, usamos raw query
        const [results] = await Appointment.sequelize.query(`
            SELECT DATE_FORMAT(data, '%Y-%m-%d') AS data_formatada
            FROM appointments
            WHERE status IN ('confirmado', 'atendido', 'pendente')
            GROUP BY data
            HAVING COUNT(DISTINCT horario) = :totalHorariosDisponiveis;
        `, {
            replacements: { totalHorariosDisponiveis },
            type: Appointment.sequelize.QueryTypes.SELECT
        });

        const datasOcupadas = results.map(row => row.data_formatada);

        res.json({ datasOcupadas });

    } catch (error) {
        console.error('Erro ao buscar datas completamente ocupadas:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar datas ocupadas.' });
    }
});

module.exports = router;
