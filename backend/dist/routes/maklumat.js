"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maklumat_1 = require("../controllers/maklumat");
const router = (0, express_1.Router)();
router.get('/', maklumat_1.getMaklumats);
router.get('/:id', maklumat_1.getMaklumatById);
router.post('/', maklumat_1.createMaklumat);
router.put('/:id', maklumat_1.updateMaklumat);
router.delete('/:id', maklumat_1.deleteMaklumat);
exports.default = router;
//# sourceMappingURL=maklumat.js.map