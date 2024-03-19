import express from 'express';
import * as validations from '../middleware/validations.js'
import * as controller from '../controllers/codeSnippet.js'

const initRoutes = ()=>{
    const routes = express.Router();
        routes.route('/submit-code-snippet').post(validations.submitCodeSnippet,controller.submit)
        routes.route('/code-snippets').get(controller.getCodeSnippets)
    return routes;
}


export default initRoutes;