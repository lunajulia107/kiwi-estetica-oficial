const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const auth = require('../auth/adminAuth');
const { Op, fn, col, literal } = require('sequelize'); 
const Appointments = require('../models/Appointments'); 
const moment = require('moment');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin || !(await bcrypt.compare(password, admin.senha))) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});
 
router.get('/usuario-logado', auth, async (req, res) => {
  try { 
    const admin = await Admin.findByPk(req.adminId, {
      attributes: ['nome', 'email', 'cargo']
    }); 

    if (!admin) {
      return res.status(404).json({ mensagem: 'Administrador não encontrado' });
    }

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao buscar dados do administrador' });
  }
});

router.get('/dashboard', auth, async (req, res) => {
    try {
        const hoje = moment().format('YYYY-MM-DD');
        const agora = moment().format('HH:mm:ss');

        const proximo = await Appointments.findOne({
            where: {
                data: hoje,
                horario: { [Op.gte]: agora },
                status: 'confirmado'
            },
            order: [['horario', 'ASC']]
        });

        const totalHoje = await Appointments.count({
            where: { data: hoje }
        });

        const pendentes = await Appointments.count({
            where: { data: hoje, status: 'pendente' }
        });

        const confirmados = await Appointments.count({
            where: { data: hoje, status: 'confirmado' }
        });
 
        const categoriasFixas = ['procedimentos faciais', 'procedimentos corporais', 'terapias complementares'];
 
        const contagensCategorias = await Promise.all(
            categoriasFixas.map(categoria =>
                Appointments.count({ where: { data: hoje, categoria } })
            )
        );

        const procedimentos = await Appointments.findAll({
            attributes: [
                'procedimento',
                [fn('COUNT', col('procedimento')), 'quantidade']
            ],
            group: ['procedimento'],
            order: [[literal('quantidade'), 'DESC']],
            limit: 5
        });

        const resposta = {
            proximaCliente: proximo ? proximo.nome : null,
            totalHoje,
            agendamentosPendentes: pendentes,
            agendamentosConfirmados: confirmados,
            agendamentosCategoria: {
                labels: categoriasFixas.map(c => c.charAt(0).toUpperCase() + c.slice(1)),  
                valores: contagensCategorias
            },
            topProcedimentos: {
                labels: procedimentos.map(p => p.procedimento),
                valores: procedimentos.map(p => parseInt(p.dataValues.quantidade))
            }
        };
 
        res.json(resposta);
    } catch (err) { 
        res.status(500).json({ mensagem: "Erro ao buscar dados do dashboard" });
    }
}); 

router.get('/agendamentos', auth, async (req, res) => {
    try {
        const agendamentos = await Appointments.findAll({
            order: [['data', 'ASC'], ['horario', 'ASC']],
            attributes: [
                'id',
                'nome',
                'celular',
                'categoria',
                'procedimento',
                'data',
                'horario',
                'status'
            ],
            raw: true
        });

        console.log(agendamentos);

        if (agendamentos.length === 0) {
            return res.status(200).json({
                status: 'sucesso',
                mensagem: 'Nenhum agendamento encontrado',
                dados: []
            });
        }

        res.status(200).json({
            status: 'sucesso',
            total: agendamentos.length,
            dados: agendamentos
        });
    } catch (err) { 
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro ao buscar agendamentos'
        });
    }
}); 

router.put('/agendamentos/:id/confirmar', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const agendamento = await Appointments.findByPk(id);

        if (!agendamento) {
            return res.status(404).json({ mensagem: 'Agendamento não encontrado' });
        }

        if (agendamento.status !== 'pendente') {
            return res.status(400).json({ mensagem: 'Agendamento não está pendente' });
        }

        agendamento.status = 'confirmado';
        await agendamento.save();

        res.json({ mensagem: 'Agendamento confirmado com sucesso', agendamento });
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensagem: 'Erro ao confirmar agendamento' });
    }
});

module.exports = router;
