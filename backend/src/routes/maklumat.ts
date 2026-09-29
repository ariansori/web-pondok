import { Router } from 'express';
import {
  getMaklumats,
  getMaklumatById,
  createMaklumat,
  updateMaklumat,
  deleteMaklumat
} from '../controllers/maklumat';

const router = Router();

router.get('/', getMaklumats);
router.get('/:id', getMaklumatById);
router.post('/', createMaklumat);
router.put('/:id', updateMaklumat);
router.delete('/:id', deleteMaklumat);

export default router;