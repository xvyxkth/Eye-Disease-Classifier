import UploadFile from "./dropComponent/UploadFile"
import './App.css'

function App() {

  return (
    <div>
      <h1>Eye Disease Classifier</h1>
      <h3>Drag and Drop your Images below to check for Glaucoma, Cataracts and Diabetic Retinopathy</h3>
      <UploadFile/>
    </div>
    
  )
}

export default App
