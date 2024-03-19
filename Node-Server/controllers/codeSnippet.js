import executeQuery from '../db/queriesExecutor.js'
import { insertCodeSnippetQuery,getCodeSnippetsQuery,updateCodeOutputQuery } from '../db/queries.js'
import { checkCacheAndGet,setCache,clearCache } from '../db/redisCache.js'
import { JUDGE0CE_API_KEY,JUDGE0CE_API_HOST } from '../config/index.js'
import * as ID from '../constants/codeLanguages.js'
import fetch from 'node-fetch';

export const submit = async(req,res)=>{
    const {
        username,
        code_language,
        stdin,
        source_code,
    } = req.body
    const code_language_id = getCodeLanguageId(code_language);
    try{
        const response= await executeQuery(insertCodeSnippetQuery,[username, code_language, stdin,source_code])
        const rowId = response[0].insertId;
        const result = await submitCode(code_language_id,stdin,source_code);
        let output;
        if(result.stdout)output=result.stdout;
        else if(result.stderr) output = result.stderr;
        else output = result.status.description;
        await executeQuery(updateCodeOutputQuery,[output,rowId])
        await clearCache('codeSnippets');
        res.status(200).send({
            status : 200,
            message : 'code snippet submitted!',
            result : result,
        })
    }catch(error){
        console.error('Error inserting code snippet : ',error)
    }
}

const submitCode = async (code_language, stdin, source_code) => {
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true&fields=*';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': JUDGE0CE_API_KEY,
            'X-RapidAPI-Host': JUDGE0CE_API_HOST
        },
        body: JSON.stringify({
            language_id: code_language,
            source_code: source_code,
            stdin: stdin
        })
    };
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw new Error('Failed to submit code. Status: ' + response.status);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getCodeLanguageId = (code_language)=>{
    let id;
    switch(code_language){
        case 'C++' : {
            id = ID.CPP;
            break;
        }
        case 'Java' : {
            id = ID.JAVA;
            break;
        }
        case 'Javascript' : {
            id = ID.JAVASCRIPT;
            break;
        }
        case 'Python' : {
            id = ID.PYTHON;
            break;
        }
    }
    return id;
}

export const getCodeSnippets = async(req,res)=>{
    
    try {
        const cachedSnippets = await checkCacheAndGet('codeSnippets');
        if (cachedSnippets) {
          res.status(200).send({
            status: 200,
            message: 'Code snippets retrieved from cache!',
            result: cachedSnippets
          });
        } else {
          const snippets = await executeQuery(getCodeSnippetsQuery);
          setCache('codeSnippets', snippets[0]);
          res.status(200).send({
            status: 200,
            message: 'Code snippets retrieved from database!',
            snippets: snippets[0]
          });
        }
      }catch(error){
        console.error('Error getting code snippets : ',error)
    }
}