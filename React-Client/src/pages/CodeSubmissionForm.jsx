import React from 'react'
import { useState } from 'react'
import { FaRegPlayCircle } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import { FaArrowAltCircleRight } from "react-icons/fa";
import {toast} from 'sonner';
import { Link } from 'react-router-dom';

const CodeSubmissionForm = () => {
    const [username,setUsername] = useState('');
    const [codeLanguage,setCodeLanguage] = useState('C++');
    const [stdin, setStdin] = useState('');
    const [stdout, setStdout] = useState('');
    const [activeTab, setActiveTab] = useState('stdin');
    const [code,setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`);
    const getInitialCode = (lang) => {
        switch (lang) {
          case 'C++':
            return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}`;
          case 'Java':
            return `public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`;
          case 'Javascript':
            return `console.log('Hello World!')\n// Write your code here`;
          case 'Python':
            return `print('Hello World!')\n# Write your code here`;
          default:
            return '';
        }
      };
      const handleRefresh = () => {
        setCode(getInitialCode(codeLanguage));
        setActiveTab('stdin')
        setStdin('')
        setStdout('')
      };

      const handleRunCode = async()=>{
        const url = `${import.meta.env.VITE_API}/api/run-code`
        const data = {
            code_language : codeLanguage,
            source_code : code,
            stdin : stdin
        }
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json()
            if(!response.ok){
                const error = result.message;
                toast.error(error);
                return;
            }
            return  result.result;
        }catch(error){
            console.log(error);
            toast.error('Something went wrong. Please try again!')
        }
      }

      const handleSubmit = async()=>{
        const url = `${import.meta.env.VITE_API}/api/submit-code-snippet`
        const data = {
            username : username,
            code_language : codeLanguage,
            source_code : code,
            stdin : stdin
        }
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json()
            if(!response.ok){
                const error = result.message;
                toast.error(error);
                return;
            }
            toast.success('Code submitted successfully')
            setCode(getInitialCode(codeLanguage))
            setStdin('')
            setStdout('')
        }catch(error){
            console.log(error);
            toast.error('Something went wrong. Please try again!')
        }
      }

  return (
    <div className='md:w-1/2 mx-auto pt-10'>
      <form>
        <div className='flex w-full'>
            <div className="form-floating w-1/2 mx-1 mb-4">
                <input
                    className="form-control border-2 focus:shadow-none focus:border-gray-300 rounded-sm"
                    id="username"
                    placeholder="Enter User Name"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                />
                <label htmlFor="username" className="text-gray-500">
                    username
                </label>
            </div>
            <div className="form-floating w-1/2 mx-1">
                <select
                  className={`form-select border-2 focus:shadow-none focus:border-gray-300 rounded-sm w-full h-full cursor-pointer `}
                  id="codeLanguage"
                  value={codeLanguage}
                  onChange={(e)=>{setCodeLanguage(e.target.value);setCode(getInitialCode(e.target.value))}}
                >
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Javascript">Javascript</option>
                  <option value="Python">Python</option>
                </select>
                <label htmlFor="codeLanguage">Code Language</label>
              </div>
        </div>
        <CodeEditor 
            code={code} 
            setCode={setCode} 
            handleRefresh={handleRefresh} 
            handleRunCode={handleRunCode}
            setActiveTab={setActiveTab}
            setStdout={setStdout}
        />
        <div>
            <InputOutput 
                stdin={stdin} 
                stdout={stdout} 
                setStdin={setStdin} 
                setStdout={setStdout} 
                handleSubmit={handleSubmit}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
      </form>
    </div>
  )
}

export default CodeSubmissionForm;


const CodeEditor = ({code,setCode,handleRefresh,handleRunCode,setActiveTab,setStdout}) => {
    const [isLoading,setLoading] = useState(false)
  
    const handleCodeChange = (e) => {
      setCode(e.target.value);
    };
  
    const handleRun = async() => {
     setLoading(true)
     const data = await handleRunCode();
     setLoading(false);
     setActiveTab('stdout')
     if(data.stdout)setStdout(data.stdout)
     else if(data.stderr)setStdout(data.stderr)
     else setStdout(data.status.description)
    };
  
   
  
    return (
      <div className="flex flex-col h-[25rem] border-2">
        {/* Top Bar */}
        <div className="flex bg-gray-300 justify-between font-medium">
           <div className='mt-1'>
           <Link
                className={`px-3 text-lg font-medium text-gray-100 hover:text-gray-200`}
                to={'/submissions'}
            >
                <FaArrowAltCircleRight className='inline text-lg mb-1 mr-2'/>
                Go to Submissions
            </Link>
           </div>
           <div className='flex items-center justify-end text-gray-700'>
                 {/* Refresh Button */}
                <div onClick={handleRefresh} className="mx-4 my-2  cursor-pointer hover:text-gray-500">
                <LuRefreshCw className='text-lg  inline mr-1 mb-1'/>Refresh
                </div>
            {/* Run Code Button */}
            {
                isLoading?
                <div className='mx-4 my-2'><Spinner size={'sm'}/></div>
                :<div onClick={handleRun} className="mx-4 my-2 cursor-pointer hover:text-gray-500">
                    <FaRegPlayCircle className='text-lg inline mr-1 mb-1'/>Run
                </div>
            }
            
           </div>
         
        </div>
        {/* Code Editor */}
       <div className='overflow-auto no-scrollbar'>
       <div className="flex-grow flex">
            {/* Line Numbers */}
            <div className="w-6 pt-4 flex-shrink-0 ">
                <div className="text-sm font-medium text-gray-600 overflow-auto no-scrollbar">
                {code.split('\n').map((_, index) => (
                    <div key={index} className="px-1">
                    {index + 1}
                    </div>
                ))}
                </div>
            </div>
            {/* Code Input */}
            <textarea
                value={code}
                onChange={handleCodeChange}
                className="flex-grow p-4 text-sm font-medium outline-none resize-none no-scrollbar"
                style={{ overflow: "auto" }}
                placeholder="Write your code here..."
            ></textarea>
        </div>
       </div>

      </div>
    );
  };



const  InputOutput  = ({stdin,stdout,setStdin,setStdout,handleSubmit,activeTab,setActiveTab}) => {
   
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };
  
    const handleInputChange = (e) => {
      if (activeTab === 'stdin') {
        setStdin(e.target.value);
      } else {
        setStdout(e.target.value);
      }
    };
  
    return (
      <div className="flex flex-col h-[18rem] mt-2">
        <div className='flex justify-between'>
        <div className="flex">
          <button
           type="button"
            className={`px-4 py-2 text-lg font-medium text-gray-700 ${
              activeTab === 'stdin' ? 'bg-gray-200' : ''
            }`}
            onClick={() => handleTabChange('stdin')}
          >
            Input
          </button>
          <button
           type="button"
            className={`px-4 py-2 text-lg font-medium text-gray-700 ${
              activeTab === 'stdout' ? 'bg-gray-200' : ''
            }`}
            onClick={() => handleTabChange('stdout')}
          >
            Output
          </button>
        </div>
        <div>
        {/* <button
            className={`px-3 py-1.5 text-lg font-medium text-gray-100 bg-gray-500 mb-2 mr-3`}
          >
            <FaArrowAltCircleRight className='inline text-lg mb-1 mr-2'/>
            Go to Submissions
          </button> */}
        <button
            className={`px-3 py-1.5 text-lg font-medium hover:bg-gray-600 text-gray-100 bg-gray-500 mb-2`}
            onClick={handleSubmit}
            type="button"
          >
            Submit
          </button>
        </div>
        </div>
        <textarea
          value={activeTab === 'stdin' ? stdin : stdout}
          onChange={handleInputChange}
          className="flex-grow p-4 text-sm font-medium outline-none resize-none bg-gray-200"
          placeholder={
            activeTab === 'stdin' ? 'Enter input here...' : 'Output will be displayed here...'
          }
          readOnly={activeTab==='stdout' ? true : false}
        ></textarea>
      </div>
    );
  };



  const Spinner = ({ size, speed }) => {
    const spinnerSizeClass = size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-8 w-8' : 'h-12 w-12';
  
    const animationDurationClass = speed === 'fast' ? 'animate-spin-fast' : speed === 'slow' ? 'animate-spin-slow' : 'animate-spin';
  
    return (
      <div className="flex justify-center items-center">
        <div className={`spinner-border text-gray-500 ${spinnerSizeClass} ${animationDurationClass}`} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };