import {useState} from 'react';
import api from '../api';


function FileUploader({setFilesList,setQstList,onUploadSuccess}){

    const [file, setFile] = useState(null);

    function handleFileChange(event) {
        try{
            if (event.target.files){
                const currentFile = event.target.files[0]
                const fileName = currentFile.name.toLowerCase();
                if(fileName.endsWith('.csv')){
                    setFile(currentFile);
                }else{
                    alert('Please upload a valid CSV file.')
                }
                
            }
        } catch (error){
            console.log("Error:",error)

        }
    }

    
    async function handleUpload(event){
        const formData = new FormData();
        formData.append("file", file);

        try {
            
            await api.post('/uploadfile/',formData,{
                headers: {
                    'Content-Type': 'multipart/form-data', 
                }
            });
            console.log("Success uploading the file!");
            await api.post('/processfile/', {
                file_name: file.name,
            });
            await getFilesList();
            await getQstList();
        
        } catch (error){
            console.log("Error:",error);
        }
       
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();

    }

    async function getFilesList(){
        try{
            const response = await api.get('/getFilesList/');
            const fileList = response.data.files
            setFilesList(fileList);
            console.log(fileList);

        } catch (error){
            console.log("Error:",error)
        }
    }

    async function getQstList(){
         try{
            const response = await api.get('/getQstList/');
            const qstList = response.data.files
            setQstList(qstList);
            console.log(qstList);

        } catch (error){
            console.log("Error:",error)
        }
    }

    return (
        <div className="fileUploader">
            <input type="file" onChange={handleFileChange}></input>
            {file && <button onClick={handleUpload}>Upload File</button>}
            
        </div>
    );
};

export default FileUploader;