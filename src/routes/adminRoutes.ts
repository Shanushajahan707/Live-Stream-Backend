import { Router } from 'express';
import { AdminRepository } from '../repositories/AdminRepository'; 
import { AdminInteractor } from '../interactors/AdminInteractor';
import { AdminController } from '../controllers/AdminController';

const router=Router()

const repository= new AdminRepository()
const interactor =new AdminInteractor(repository)
const controller = new AdminController(interactor)

router.get('/getusers',controller.onGetUser.bind(controller))
router.put('/blockuser/:id',controller.onBlockUser.bind(controller))
export default router