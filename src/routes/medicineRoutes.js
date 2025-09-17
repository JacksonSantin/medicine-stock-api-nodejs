/**
 * @swagger
 * tags:
 *   name: Medicines
 *   description: Gerenciamento de remédios
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicineController");

// CRUD
/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Cria um novo remédio
 *     tags: [Medicines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medicine'
 *     responses:
 *       201:
 *         description: Remédio criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", controller.create);

/**
 * @swagger
 * /medicines:
 *   get:
 *     summary: Lista todos os remédios
 *     tags: [Medicines]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Texto de busca
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de remédios com totais
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 medicines:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medicine'
 *                 totals:
 *                   type: object
 *                   properties:
 *                     qtd_comprimidos:
 *                       type: integer
 *                     qtd_embalagem:
 *                       type: integer
 */
router.get("/", controller.list);

/**
 * @swagger
 * /medicines/{id}:
 *   get:
 *     summary: Obtém um remédio pelo ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do remédio
 *     responses:
 *       200:
 *         description: Detalhes do remédio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 medicine:
 *                   $ref: '#/components/schemas/Medicine'
 *                 expireWarning:
 *                   type: string
 *                   description: "red se expira em ≤ 5 dias"
 *       404:
 *         description: Remédio não encontrado
 */
router.get("/:id", controller.get);

/**
 * @swagger
 * /medicines/{id}:
 *   put:
 *     summary: Atualiza um remédio
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do remédio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Medicine'
 *     responses:
 *       200:
 *         description: Remédio atualizado com sucesso
 *       404:
 *         description: Remédio não encontrado
 */
router.put("/:id", controller.update);

/**
 * @swagger
 * /medicines/{id}:
 *   delete:
 *     summary: Remove um remédio
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do remédio
 *     responses:
 *       200:
 *         description: Remédio removido com sucesso
 *       404:
 *         description: Remédio não encontrado
 */
router.delete("/:id", controller.remove);

/**
 * @swagger
 * /medicines/suggest-times:
 *   post:
 *     summary: Sugere horários para tomar o remédio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mode:
 *                 type: string
 *                 enum: [interval, times, times-per-day]
 *               hours:
 *                 type: integer
 *               times:
 *                 type: array
 *                 items:
 *                   type: string
 *               timesPerDay:
 *                 type: integer
 *               startAt:
 *                 type: string
 *                 description: Horário inicial HH:mm
 *     responses:
 *       200:
 *         description: Lista de horários sugeridos
 */
// suggestion endpoint (no auth required or optional)
const { suggestTimes } = require("../services/scheduleService");
router.post("/suggest-times", async (req, res) => {
  // body: { mode: 'interval'|'times'|'times-per-day', value: ... }
  try {
    const result = suggestTimes(req.body);
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
