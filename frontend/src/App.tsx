import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import Signin from "./pages/Signin"
import Signup from "./pages/Singup"
import Dashboard from "./pages/Dashboard"
import CreateTask from "./pages/Createtask"
import ProtectedRoute from "./components/Protectedroute"
import EditTask from "./pages/Edittask"
import ViewTask from "./pages/Viewtask"


function App() {

  return (
     <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Landing/>} />
          <Route path = "/signin" element = {<Signin/>}/>
          <Route path = "/signup" element = {<Signup/>} />


          <Route path = "/dashboard" element = {
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
            }/>

          <Route path = "/task/create" element = {
            <ProtectedRoute>  
              <CreateTask/>
            </ProtectedRoute>
            }/>

          <Route path = "/task/:id/edit" element = {
            <ProtectedRoute>
              <EditTask/>
            </ProtectedRoute>
          }/>  

          <Route path = "/task/:id" element = {
            <ProtectedRoute>
              <ViewTask/>
            </ProtectedRoute>
          }/>

        </Routes>
     </BrowserRouter> 
  )
}

export default App
