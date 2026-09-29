// backend/src/routes/agenda.ts
import { Router } from 'express';
import {
  getAgendas,
  getAgendaById,
  createAgenda,
  updateAgenda,
  deleteAgenda
} from '../controllers/agenda';

const router = Router();

router.get('/', getAgendas);
router.get('/:id', getAgendaById);
router.post('/', createAgenda);
router.put('/:id', updateAgenda);
router.delete('/:id', deleteAgenda);

export default router;