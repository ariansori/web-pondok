"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/agenda.ts
const express_1 = require("express");
const agenda_1 = require("../controllers/agenda");
const router = (0, express_1.Router)();
router.get('/', agenda_1.getAgendas);
router.get('/:id', agenda_1.getAgendaById);
router.post('/', agenda_1.createAgenda);
router.put('/:id', agenda_1.updateAgenda);
router.delete('/:id', agenda_1.deleteAgenda);
exports.default = router;
//# sourceMappingURL=agenda.js.map